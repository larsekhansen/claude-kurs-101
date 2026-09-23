// Live-tjenesten for Claude-kurset. Ett rom, én Durable Object.
// Presentøren styrer siden, deltakerne følger, rekker opp hånda og reagerer.
// Protokollen er JSON over WebSocket, se docs/oppsett.md.
import { DurableObject } from "cloudflare:workers";

const EMOJI = ["👍", "😂", "❓"];
const STALE_MS = 150_000; // ingen ping på 2,5 minutter: forbindelsen regnes som død
const SWEEP_MS = 60_000;
const MAX_SOCKETS = 400;
const OPEN = 1;

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
    this.flood = new Map();
    this.presenceTimer = null;
    // Svarer på ping uten å vekke objektet. Tidspunktet brukes til å finne døde forbindelser.
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
    ctx.blockConcurrencyWhile(async () => {
      this.live = (await ctx.storage.get("live")) || this.live;
      this.clearAt = (await ctx.storage.get("clearAt")) || 0;
    });
  }

  async fetch() {
    if (this.ctx.getWebSockets().length >= MAX_SOCKETS) {
      return new Response("Fullt", { status: 503 });
    }
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ role: null, cid: null, name: "", hand: false, handAt: 0, done: false, at: Date.now() });
    if ((await this.ctx.storage.getAlarm()) === null) {
      await this.ctx.storage.setAlarm(Date.now() + SWEEP_MS);
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw) {
    if (typeof raw !== "string" || raw.length > 2000) return;
    let m;
    try { m = JSON.parse(raw); } catch { return; }
    if (!m || typeof m !== "object") return;
    const a = ws.deserializeAttachment();
    if (m.t === "hello") return this.hello(ws, a, m);
    if (!a || !a.role) return; // hello må komme først
    const presenter = a.role === "presenter";
    switch (m.t) {
      case "name": if (!presenter) this.rename(ws, a, m.name); break;
      case "me": if (!presenter) this.setMe(ws, a, m); break;
      case "react": this.react(ws, m.e); break;
      case "go": if (presenter) await this.go(ws, m); break;
      case "clear": if (presenter) await this.clear(); break;
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
    const next = { ...a, role: presenter ? "presenter" : "viewer", cid };
    let nameTaken = null;

    if (!presenter) {
      // Samme nettleser i flere faner er samme person, med samme tilstand.
      const twin = this.sockets().find(([s, b]) => s !== ws && b.role === "viewer" && b.cid === cid);
      if (twin) {
        const b = twin[1];
        Object.assign(next, { name: b.name, hand: b.hand, handAt: b.handAt, done: b.done });
      } else {
        // Har presentøren nullstilt siden sist, gjelder ikke gammel hånd og ferdig.
        const fresh = (Number(m.seen) || 0) >= this.clearAt;
        next.hand = fresh && m.hand === true;
        next.handAt = next.hand ? Date.now() : 0;
        next.done = fresh && m.done === true;
      }
      const wanted = cleanName(m.name);
      if (!next.name && wanted) {
        if (this.nameFree(wanted, cid)) next.name = wanted;
        else nameTaken = wanted;
      }
    }

    ws.serializeAttachment(next);
    if (!presenter && next.name) this.updateCid(cid, { name: next.name }, ws);
    send(ws, {
      t: "welcome",
      role: next.role,
      badToken: hasToken && !presenter,
      live: this.live,
      clearAt: this.clearAt,
      me: { name: next.name, hand: next.hand, done: next.done },
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

  setMe(ws, a, m) {
    const patch = {};
    if (typeof m.hand === "boolean" && m.hand !== a.hand) {
      patch.hand = m.hand;
      patch.handAt = m.hand ? Date.now() : 0;
    }
    if (typeof m.done === "boolean") patch.done = m.done;
    this.updateCid(a.cid, patch, ws);
    this.schedulePresence();
  }

  react(ws, e) {
    if (!EMOJI.includes(e)) return;
    const now = Date.now();
    const f = this.flood.get(ws) || { n: 0, t: now };
    if (now - f.t > 4000) { f.n = 0; f.t = now; }
    f.n++;
    this.flood.set(ws, f);
    if (f.n > 8) return;
    this.broadcast({ t: "react", e }, ws);
  }

  async go(ws, m) {
    const slide = typeof m.slide === "string" && /^[a-z0-9-]{1,40}$/.test(m.slide) ? m.slide : this.live.slide;
    this.live = { on: m.on === true, slide };
    await this.ctx.storage.put("live", this.live);
    this.broadcast({ t: "live", ...this.live }, ws);
  }

  async clear() {
    this.clearAt = Date.now();
    await this.ctx.storage.put("clearAt", this.clearAt);
    for (const [s, a] of this.sockets()) {
      if (a.role === "viewer") s.serializeAttachment({ ...a, hand: false, handAt: 0, done: false });
    }
    this.broadcast({ t: "clear", at: this.clearAt });
    this.broadcastPresence();
  }

  // Oppdaterer alle faner til samme person og sier fra til dem.
  updateCid(cid, patch, except) {
    for (const [s, a] of this.sockets()) {
      if (a.role !== "viewer" || a.cid !== cid) continue;
      const b = { ...a, ...patch };
      s.serializeAttachment(b);
      if (s !== except) send(s, { t: "me", name: b.name, hand: b.hand, done: b.done });
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

  // Alle får antall. Bare presentøren får navn.
  broadcastPresence() {
    const people = new Map();
    const all = this.sockets();
    for (const [, a] of all) {
      if (a.role === "viewer" && !people.has(a.cid)) {
        people.set(a.cid, { name: a.name, hand: a.hand, handAt: a.handAt, done: a.done });
      }
    }
    const list = [...people.values()].sort(byQueue);
    const counts = {
      t: "presence",
      here: list.length,
      hands: list.filter((p) => p.hand).length,
      done: list.filter((p) => p.done).length,
    };
    const short = JSON.stringify(counts);
    const full = JSON.stringify({ ...counts, people: list.map((p) => ({ name: p.name, hand: p.hand, done: p.done })) });
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

function cleanName(s) {
  if (typeof s !== "string") return "";
  const t = s.normalize("NFC").replace(/[\p{Cc}\p{Cf}]/gu, "").replace(/\s+/g, " ").trim();
  return Array.from(t).slice(0, 32).join("").trim();
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
