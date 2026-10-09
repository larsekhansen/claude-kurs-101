// Live-tjenesten for Claude-kurset. Ett rom, én Durable Object.
// Presentøren styrer siden. Deltakerne følger, rekker opp hånda, krysser av
// steg i oppgavene, svarer på avstemninger, deler korte svar på en vegg og
// stiller spørsmål som de andre kan stemme på.
// Protokollen er JSON over WebSocket, se docs/oppsett.md.
import { DurableObject } from "cloudflare:workers";

const EMOJI = ["👍", "😂", "❓"];
const FX = ["applaus"];
const STALE_MS = 150_000; // ingen ping på 2,5 minutter: forbindelsen regnes som død
const SWEEP_MS = 60_000;
const MAX_SOCKETS = 400;
const MAX_WALL = 80; // innlegg per vegg
const MAX_POST = 240; // tegn per innlegg
const MAX_QUESTIONS = 60;
const MAX_NOTE = 6000; // tegn i notatene til én side
const OPEN = 1;
const ID = /^[a-z0-9-]{1,40}$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/ws") {
      return new Response("Live-tjenesten for Claude-kurset.\n", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Forventet WebSocket", { status: 426 });
    }
    const origin = request.headers.get("Origin");
    if (origin && !originAllowed(origin, env)) {
      return new Response("Ukjent opphav", { status: 403 });
    }
    return env.ROOM.get(env.ROOM.idFromName("kurs")).fetch(request);
  },
};

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.live = { on: false, slide: null };
    this.clearAt = 0;
    this.resetAt = 0;
    this.walls = {};
    this.revealed = {};
    this.count = null;
    this.questions = [];
    this.hidden = {};
    this.notes = {};
    this.flood = new Map();
    this.presenceTimer = null;
    // Svarer på ping uten å vekke objektet. Tidspunktet brukes til å finne døde forbindelser.
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
    ctx.blockConcurrencyWhile(async () => {
      this.live = (await ctx.storage.get("live")) || this.live;
      this.clearAt = (await ctx.storage.get("clearAt")) || 0;
      this.resetAt = (await ctx.storage.get("resetAt")) || 0;
      this.walls = (await ctx.storage.get("walls")) || {};
      this.revealed = (await ctx.storage.get("revealed")) || {};
      this.count = (await ctx.storage.get("count")) || null;
      this.questions = (await ctx.storage.get("questions")) || [];
      this.hidden = (await ctx.storage.get("hidden")) || {};
      this.notes = (await ctx.storage.get("notes")) || {};
    });
  }

  async fetch() {
    if (this.ctx.getWebSockets().length >= MAX_SOCKETS) {
      return new Response("Fullt", { status: 503 });
    }
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ role: null, cid: null, name: "", hand: false, handAt: 0, prog: {}, ans: {}, at: Date.now() });
    if ((await this.ctx.storage.getAlarm()) === null) {
      await this.ctx.storage.setAlarm(Date.now() + SWEEP_MS);
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw) {
    if (typeof raw !== "string" || raw.length > 16000) return;
    let m;
    try { m = JSON.parse(raw); } catch { return; }
    if (!m || typeof m !== "object") return;
    const a = ws.deserializeAttachment();
    if (m.t === "hello") return this.hello(ws, a, m);
    if (!a || !a.role) return; // hello må komme først
    const presenter = a.role === "presenter";
    const viewer = a.role === "viewer";
    switch (m.t) {
      case "name": if (viewer) this.rename(ws, a, m.name); break;
      case "me": if (viewer) { this.setHand(ws, a, m.hand); this.setFollow(ws, m.follow); } break;
      case "step": if (viewer) this.setStep(ws, a, m.slide, m.n); break;
      case "vote": if (viewer) this.vote(ws, a, m.poll, m.opt); break;
      case "post": if (viewer || presenter) await this.post(ws, m.wall, m.text); break;
      case "react": if (a.role !== "screen") this.react(ws, m.e); break;
      case "go": if (presenter) await this.go(ws, m); break;
      case "clear": if (presenter) await this.clear(); break;
      case "wipe": if (presenter) await this.wipe(m.wall); break;
      case "reveal": if (presenter) await this.reveal(m.poll, m.on); break;
      case "fx": if (presenter && FX.includes(m.kind) && !this.flooded(ws, "fx", 3, 5000)) this.broadcast({ t: "fx", kind: m.kind }, ws); break;
      case "spot": if (presenter) this.spot(m); break;
      case "pull": if (presenter && this.live.on && !this.flooded(ws, "pull", 3, 5000)) this.broadcast({ t: "pull" }, ws); break;
      case "count": if (presenter) await this.setCount(m); break;
      case "ask": if (viewer || presenter) await this.ask(ws, m.text); break;
      case "like": if (viewer) await this.like(a, m.id, m.on); break;
      case "answered": if (presenter) await this.answered(m.id, m.done); break;
      case "qwipe": if (presenter) await this.qwipe(); break;
      case "hide": if (presenter) await this.hide(m.slide, m.on); break;
      case "note": if (presenter) await this.setNote(m.slide, m.text); break;
      case "reset": if (presenter) await this.reset(); break;
    }
  }

  async webSocketClose(ws) {
    try { ws.close(1000, "Ha det"); } catch {}
    this.flood.delete(ws);
    this.schedulePresence();
  }

  async webSocketError(ws) {
    this.flood.delete(ws);
    this.schedulePresence();
  }

  async alarm() {
    const now = Date.now();
    let open = 0;
    for (const s of this.ctx.getWebSockets()) {
      if (this.isStale(s, s.deserializeAttachment(), now)) {
        try { s.close(4000, "Ingen livstegn"); } catch {}
      } else open++;
    }
    if (open > 0) await this.ctx.storage.setAlarm(now + SWEEP_MS);
    this.broadcastPresence();
  }

  hello(ws, a, m) {
    if (a && a.role) return;
    const cid = typeof m.cid === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(m.cid) ? m.cid : crypto.randomUUID();
    const hasToken = typeof m.token === "string" && m.token.length > 0;
    const presenter = hasToken && sameToken(m.token, this.env.PRESENTER_TOKEN);
    // Skjermvisningen i møterommet følger presentasjonen, men telles ikke som deltaker.
    const role = presenter ? "presenter" : m.screen === true ? "screen" : "viewer";
    const next = { ...a, role, cid };
    let nameTaken = null;

    if (role === "viewer") {
      // Samme nettleser i flere faner er samme person, med samme tilstand.
      const twin = this.sockets().find(([s, b]) => s !== ws && b.role === "viewer" && b.cid === cid);
      if (twin) {
        const b = twin[1];
        Object.assign(next, { name: b.name, hand: b.hand, handAt: b.handAt, prog: b.prog, ans: b.ans });
      } else if ((Number(m.reset) || 0) >= this.resetAt) {
        // Har presentøren tatt ned hendene siden sist, gjelder ikke en gammel hånd.
        next.hand = (Number(m.seen) || 0) >= this.clearAt && m.hand === true;
        next.handAt = next.hand ? Date.now() : 0;
        next.prog = cleanMap(m.prog, (v) => Number.isInteger(v) && v >= 0 && v <= 20);
        next.ans = cleanMap(m.ans, (v) => typeof v === "string" && ID.test(v));
      }
      // Ellers har presentøren nullstilt alt siden fanen sist var koblet til, og det gamle gjelder ikke.
      // Følger fanen presentasjonen, eller blar den selv? Gjelder fanen, ikke personen.
      next.follow = m.follow !== false;
      const wanted = cleanName(m.name);
      if (!next.name && wanted) {
        if (this.nameFree(wanted, cid)) next.name = wanted;
        else nameTaken = wanted;
      }
    }

    ws.serializeAttachment(next);
    if (role === "viewer" && next.name) this.updateCid(cid, { name: next.name }, ws);
    send(ws, {
      t: "welcome",
      role,
      badToken: hasToken && !presenter,
      live: this.live,
      clearAt: this.clearAt,
      resetAt: this.resetAt,
      walls: this.walls,
      revealed: this.revealed,
      count: this.count,
      questions: this.questions.map(publicQ),
      hidden: this.hidden,
      notes: presenter ? this.notes : undefined,
      now: Date.now(),
      me: { name: next.name, hand: next.hand, prog: next.prog, ans: next.ans },
      nameTaken,
    });
    this.schedulePresence();
  }

  rename(ws, a, raw) {
    const name = cleanName(raw);
    if (!name || !this.nameFree(name, a.cid)) {
      send(ws, { t: "name-taken", name });
      return;
    }
    this.updateCid(a.cid, { name });
    this.schedulePresence();
  }

  setHand(ws, a, hand) {
    if (typeof hand !== "boolean" || hand === a.hand) return;
    this.updateCid(a.cid, { hand, handAt: hand ? Date.now() : 0 }, ws);
    this.schedulePresence();
  }

  setFollow(ws, follow) {
    if (typeof follow !== "boolean") return;
    const a = ws.deserializeAttachment();
    if ((a.follow !== false) === follow) return;
    ws.serializeAttachment({ ...a, follow });
    this.schedulePresence();
  }

  setStep(ws, a, slide, n) {
    if (typeof slide !== "string" || !ID.test(slide) || !Number.isInteger(n) || n < 0 || n > 20) return;
    if (!(slide in a.prog) && Object.keys(a.prog).length >= 40) return;
    this.updateCid(a.cid, { prog: { ...a.prog, [slide]: n } }, ws);
    this.schedulePresence();
  }

  vote(ws, a, poll, opt) {
    if (typeof poll !== "string" || !ID.test(poll) || typeof opt !== "string" || !ID.test(opt)) return;
    if (!(poll in a.ans) && Object.keys(a.ans).length >= 40) return;
    this.updateCid(a.cid, { ans: { ...a.ans, [poll]: opt } }, ws);
    this.schedulePresence();
  }

  // Veggen er anonym. Serveren lagrer bare teksten.
  async post(ws, wall, raw) {
    if (typeof wall !== "string" || !ID.test(wall)) return;
    const text = cleanText(raw);
    if (!text || this.flooded(ws, "post", 3, 10_000)) return;
    if (!this.walls[wall] && Object.keys(this.walls).length >= 40) return;
    const list = this.walls[wall] || (this.walls[wall] = []);
    const item = { id: crypto.randomUUID().slice(0, 8), text, at: Date.now() };
    list.push(item);
    if (list.length > MAX_WALL) list.splice(0, list.length - MAX_WALL);
    await this.ctx.storage.put("walls", this.walls);
    this.broadcast({ t: "wall", wall, item });
  }

  async wipe(wall) {
    if (typeof wall !== "string" || !ID.test(wall) || !this.walls[wall]) return;
    delete this.walls[wall];
    await this.ctx.storage.put("walls", this.walls);
    this.broadcast({ t: "wall-wipe", wall });
  }

  // Fasiten i en avstemning vises for alle når presentøren sier det.
  async reveal(poll, on) {
    if (typeof poll !== "string" || !ID.test(poll)) return;
    if (on === true) this.revealed[poll] = true;
    else delete this.revealed[poll];
    await this.ctx.storage.put("revealed", this.revealed);
    this.broadcast({ t: "reveal", poll, on: on === true });
  }

  // Presentøren løfter fram et innlegg fra veggen eller et spørsmål på alle skjermer, uten navn.
  spot(m) {
    if (m.off === true) { this.broadcast({ t: "spot", text: null }); return; }
    if (typeof m.q === "string") {
      const q = this.questions.find((x) => x.id === m.q);
      if (q) this.broadcast({ t: "spot", text: q.text, kind: "q" });
      return;
    }
    if (typeof m.wall !== "string" || !ID.test(m.wall) || typeof m.id !== "string") return;
    const item = (this.walls[m.wall] || []).find((x) => x.id === m.id);
    if (item) this.broadcast({ t: "spot", text: item.text });
  }

  // Nedtelling for en oppgave. Klientene regner ut resten selv, med serverens klokke.
  async setCount(m) {
    const sec = Math.round(Number(m.sec));
    this.count = m.off === true || !(sec > 0 && sec <= 3600) ? null : { until: Date.now() + sec * 1000, sec };
    await this.ctx.storage.put("count", this.count);
    this.broadcast({ t: "count", count: this.count, now: Date.now() });
  }

  // Spørsmål fra salen er anonyme. Serveren husker hvem som har stemt, men sender bare antallet.
  async ask(ws, raw) {
    const text = cleanText(raw);
    if (!text || this.flooded(ws, "ask", 3, 30_000)) return;
    const q = { id: crypto.randomUUID().slice(0, 8), text, at: Date.now(), likes: [], done: false };
    this.questions.push(q);
    if (this.questions.length > MAX_QUESTIONS) this.questions.splice(0, this.questions.length - MAX_QUESTIONS);
    await this.saveQuestion(q);
  }

  async like(a, id, on) {
    const q = this.questions.find((x) => x.id === id);
    if (!q || typeof on !== "boolean") return;
    const i = q.likes.indexOf(a.cid);
    if (on === (i >= 0)) return;
    if (on) q.likes.push(a.cid); else q.likes.splice(i, 1);
    await this.saveQuestion(q);
  }

  async answered(id, done) {
    const q = this.questions.find((x) => x.id === id);
    if (!q) return;
    q.done = done === true;
    await this.saveQuestion(q);
  }

  async saveQuestion(q) {
    await this.ctx.storage.put("questions", this.questions);
    this.broadcast({ t: "q", item: publicQ(q) });
  }

  async qwipe() {
    this.questions = [];
    await this.ctx.storage.put("questions", this.questions);
    this.broadcast({ t: "q-wipe" });
  }

  // Presentøren kan skru sider av og på. Skjulte sider hoppes over for alle.
  // Både av og på lagres, så en side som er skjult som standard i kurssiden kan skrus på.
  async hide(slide, on) {
    if (typeof slide !== "string" || !ID.test(slide)) return;
    if (!(slide in this.hidden) && Object.keys(this.hidden).length >= 40) return;
    this.hidden[slide] = on === true;
    await this.ctx.storage.put("hidden", this.hidden);
    this.broadcast({ t: "hidden", hidden: this.hidden });
  }

  // Presentøren kan redigere notatene i kurssiden. De lagres her og går bare til presentører.
  async setNote(slide, text) {
    if (typeof slide !== "string" || !ID.test(slide) || typeof text !== "string") return;
    const t = cleanNote(text);
    if (t) {
      if (!(slide in this.notes) && Object.keys(this.notes).length >= 40) return;
      this.notes[slide] = t;
    } else delete this.notes[slide];
    await this.ctx.storage.put("notes", this.notes);
    const msg = JSON.stringify({ t: "notes", notes: this.notes });
    for (const [s, a] of this.sockets()) {
      if (a.role === "presenter") { try { s.send(msg); } catch {} }
    }
  }

  react(ws, e) {
    if (!EMOJI.includes(e) || this.flooded(ws, "react", 8, 4000)) return;
    this.broadcast({ t: "react", e }, ws);
  }

  // since er når presentasjonen ble startet, så presentøren kan holde tiden.
  // by er fanen som styrer. En medhjelper med samme lenke blar fritt til hen tar over.
  async go(ws, m) {
    const slide = typeof m.slide === "string" && ID.test(m.slide) ? m.slide : this.live.slide;
    const on = m.on === true;
    const by = on && typeof m.by === "string" && /^[A-Za-z0-9_-]{6,64}$/.test(m.by) ? m.by : null;
    this.live = { on, slide, since: on ? (this.live.on && this.live.since) || Date.now() : null, by };
    await this.ctx.storage.put("live", this.live);
    this.broadcast({ t: "live", ...this.live }, ws);
  }

  async clear() {
    this.clearAt = Date.now();
    await this.ctx.storage.put("clearAt", this.clearAt);
    for (const [s, a] of this.sockets()) {
      if (a.role === "viewer") s.serializeAttachment({ ...a, hand: false, handAt: 0 });
    }
    this.broadcast({ t: "clear", at: this.clearAt });
    this.broadcastPresence();
  }

  // Nullstiller alt fra øving: vegger, spørsmål, fasit, nedtelling, hender, steg og svar.
  // Notatene og hvilke sider som er skjult, beholdes.
  async reset() {
    this.resetAt = this.clearAt = Date.now();
    this.walls = {};
    this.revealed = {};
    this.count = null;
    this.questions = [];
    this.live = { on: false, slide: null };
    await this.ctx.storage.put({ resetAt: this.resetAt, clearAt: this.clearAt, walls: {}, revealed: {}, count: null, questions: [], live: this.live });
    for (const [s, a] of this.sockets()) {
      if (a.role === "viewer") s.serializeAttachment({ ...a, hand: false, handAt: 0, prog: {}, ans: {} });
    }
    this.broadcast({ t: "reset", at: this.resetAt, live: this.live });
    this.broadcastPresence();
  }

  flooded(ws, kind, max, windowMs) {
    const now = Date.now();
    const all = this.flood.get(ws) || {};
    const f = all[kind] || { n: 0, t: now };
    if (now - f.t > windowMs) { f.n = 0; f.t = now; }
    f.n++;
    all[kind] = f;
    this.flood.set(ws, all);
    return f.n > max;
  }

  // Oppdaterer alle faner til samme person og sier fra til dem.
  updateCid(cid, patch, except) {
    for (const [s, a] of this.sockets()) {
      if (a.role !== "viewer" || a.cid !== cid) continue;
      const b = { ...a, ...patch };
      s.serializeAttachment(b);
      if (s !== except) send(s, { t: "me", name: b.name, hand: b.hand, prog: b.prog, ans: b.ans });
    }
  }

  nameFree(name, cid) {
    const key = nameKey(name);
    const now = Date.now();
    for (const [s, a] of this.sockets()) {
      if (a.role !== "viewer" || a.cid === cid || !a.name || nameKey(a.name) !== key) continue;
      if (this.isStale(s, a, now)) {
        try { s.close(4000, "Ingen livstegn"); } catch {}
        continue;
      }
      return false;
    }
    return true;
  }

  sockets() {
    const out = [];
    for (const s of this.ctx.getWebSockets()) {
      if (s.readyState !== OPEN) continue;
      const a = s.deserializeAttachment();
      if (a && a.role) out.push([s, a]);
    }
    return out;
  }

  isStale(s, a, now) {
    const ts = this.ctx.getWebSocketAutoResponseTimestamp(s);
    const last = Math.max((a && a.at) || 0, ts ? ts.getTime() : 0);
    return now - last > STALE_MS;
  }

  broadcast(m, except) {
    const text = JSON.stringify(m);
    for (const [s] of this.sockets()) {
      if (s === except) continue;
      try { s.send(text); } catch {}
    }
  }

  schedulePresence() {
    if (this.presenceTimer) return;
    this.presenceTimer = setTimeout(() => {
      this.presenceTimer = null;
      this.broadcastPresence();
    }, 250);
  }

  // Alle ser hvem som er her og hvem som rekker opp hånda, og fordelingen i avstemningene.
  // Bare presentøren får fagfelt, fremdrift og hvem som blar selv.
  broadcastPresence() {
    const people = new Map();
    const all = this.sockets();
    for (const [, a] of all) {
      if (a.role === "viewer" && !people.has(a.cid)) {
        people.set(a.cid, { name: a.name, hand: a.hand, handAt: a.handAt, prog: a.prog || {}, ans: a.ans || {}, follow: a.follow !== false });
      }
    }
    const list = [...people.values()].sort(byQueue);
    // polls: antall per svar. steps: steps[side][i] er hvor mange som er ferdige med steg i+1.
    const polls = {};
    const steps = {};
    for (const p of list) {
      for (const [poll, opt] of Object.entries(p.ans)) {
        const counts = polls[poll] || (polls[poll] = {});
        counts[opt] = (counts[opt] || 0) + 1;
      }
      for (const [slide, n] of Object.entries(p.prog)) {
        const done = steps[slide] || (steps[slide] = []);
        for (let i = 0; i < n; i++) done[i] = (done[i] || 0) + 1;
      }
    }
    const counts = { t: "presence", here: list.length, hands: list.filter((p) => p.hand).length, free: list.filter((p) => !p.follow).length, polls, steps };
    const names = JSON.stringify({ ...counts, people: list.map((p) => ({ name: p.name, hand: p.hand })) });
    const full = JSON.stringify({
      ...counts,
      people: list.map((p) => ({ name: p.name, hand: p.hand, prog: p.prog, ans: p.ans, follow: p.follow })),
    });
    for (const [s, a] of all) {
      try { s.send(a.role === "presenter" ? full : names); } catch {}
    }
  }
}

function send(ws, m) {
  try { ws.send(JSON.stringify(m)); } catch {}
}

// Hender først, i den rekkefølgen de kom opp. Så navn alfabetisk, uten navn sist.
function byQueue(a, b) {
  if (a.hand !== b.hand) return a.hand ? -1 : 1;
  if (a.hand) return a.handAt - b.handAt;
  if (!a.name !== !b.name) return a.name ? -1 : 1;
  return a.name.localeCompare(b.name, "nb");
}

function publicQ(q) {
  return { id: q.id, text: q.text, at: q.at, likes: q.likes.length, done: q.done };
}

function cleanMap(obj, ok) {
  const out = {};
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return out;
  for (const [k, v] of Object.entries(obj).slice(0, 40)) {
    if (ID.test(k) && ok(v)) out[k] = v;
  }
  return out;
}

function cleanName(s) {
  if (typeof s !== "string") return "";
  const t = s.normalize("NFC").replace(/[\p{Cc}\p{Cf}]/gu, "").replace(/\s+/g, " ").trim();
  return Array.from(t).slice(0, 32).join("").trim();
}

function cleanText(s) {
  if (typeof s !== "string") return "";
  const t = s.normalize("NFC").replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/g, " ").trim();
  return Array.from(t).slice(0, MAX_POST).join("").trim();
}

function cleanNote(s) {
  const t = s.normalize("NFC").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F\p{Cf}]/gu, "").replace(/\n{3,}/g, "\n\n").trim();
  return Array.from(t).slice(0, MAX_NOTE).join("").trim();
}

function nameKey(s) {
  return s.toLocaleLowerCase("nb");
}

function sameToken(given, secret) {
  if (typeof secret !== "string" || !secret) return false;
  const enc = new TextEncoder();
  const a = enc.encode(given);
  const b = enc.encode(secret);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}

function originAllowed(origin, env) {
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).includes(origin);
}
