// Live-tjenesten for Claude-kurset. Ett rom, én Durable Object.
// Presentøren styrer siden. Deltakerne følger, rekker opp hånda, krysser av
// steg i oppgavene, svarer på avstemninger og deler korte svar på en vegg.
// Protokollen er JSON over WebSocket, se docs/oppsett.md.
import { DurableObject } from "cloudflare:workers";

const EMOJI = ["👍", "😂", "❓"];
const STALE_MS = 150_000; // ingen ping på 2,5 minutter: forbindelsen regnes som død
const SWEEP_MS = 60_000;
const MAX_SOCKETS = 400;
const MAX_WALL = 80; // innlegg per vegg
const MAX_POST = 240; // tegn per innlegg
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
    this.walls = {};
    this.flood = new Map();
    this.presenceTimer = null;
    // Svarer på ping uten å vekke objektet. Tidspunktet brukes til å finne døde forbindelser.
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
    ctx.blockConcurrencyWhile(async () => {
      this.live = (await ctx.storage.get("live")) || this.live;
      this.clearAt = (await ctx.storage.get("clearAt")) || 0;
      this.walls = (await ctx.storage.get("walls")) || {};
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
    if (typeof raw !== "string" || raw.length > 4000) return;
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
      case "me": if (viewer) this.setHand(ws, a, m.hand); break;
      case "step": if (viewer) this.setStep(ws, a, m.slide, m.n); break;
      case "vote": if (viewer) this.vote(ws, a, m.poll, m.opt); break;
      case "post": if (viewer || presenter) await this.post(ws, m.wall, m.text); break;
      case "react": if (a.role !== "screen") this.react(ws, m.e); break;
      case "go": if (presenter) await this.go(ws, m); break;
      case "clear": if (presenter) await this.clear(); break;
      case "wipe": if (presenter) await this.wipe(m.wall); break;
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
      } else {
        // Har presentøren nullstilt siden sist, gjelder ikke en gammel hånd.
        next.hand = (Number(m.seen) || 0) >= this.clearAt && m.hand === true;
        next.handAt = next.hand ? Date.now() : 0;
        next.prog = cleanMap(m.prog, (v) => Number.isInteger(v) && v >= 0 && v <= 20);
        next.ans = cleanMap(m.ans, (v) => typeof v === "string" && ID.test(v));
      }
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
      walls: this.walls,
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

  react(ws, e) {
    if (!EMOJI.includes(e) || this.flooded(ws, "react", 8, 4000)) return;
    this.broadcast({ t: "react", e }, ws);
  }

  async go(ws, m) {
    const slide = typeof m.slide === "string" && ID.test(m.slide) ? m.slide : this.live.slide;
    this.live = { on: m.on === true, slide };
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

  // Alle får antall og fordelingen i avstemningene. Bare presentøren får navn og fremdrift.
  broadcastPresence() {
    const people = new Map();
    const all = this.sockets();
    for (const [, a] of all) {
      if (a.role === "viewer" && !people.has(a.cid)) {
        people.set(a.cid, { name: a.name, hand: a.hand, handAt: a.handAt, prog: a.prog || {}, ans: a.ans || {} });
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
    const counts = { t: "presence", here: list.length, hands: list.filter((p) => p.hand).length, polls, steps };
    const short = JSON.stringify(counts);
    const full = JSON.stringify({
      ...counts,
      people: list.map((p) => ({ name: p.name, hand: p.hand, prog: p.prog, ans: p.ans })),
    });
    for (const [s, a] of all) {
      try { s.send(a.role === "presenter" ? full : short); } catch {}
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
