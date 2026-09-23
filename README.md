# Claude-kurset

Interaktiv kursside for «Introduksjon til Claude» (KI Norge / Digdir).
Sidene er slides, hver prompt kan kopieres med ett trykk, og presentøren kan
styre hvilken side publikum ser. Deltakerne skriver bare et navn, ingen
innlogging.

Kurssiden: https://larsekhansen.github.io/claude-kurs-101/

- `index.html`: appen, én fil.
- `worker/`: live-tjenesten, en Cloudflare Worker med Durable Object.
- `docs/kurs.md`: alt kursinnhold og alle prompter.
- `docs/oppsett.md`: deploy, presentør-token og lokal utvikling.
- `docs/handoff.md`: kontekst og beslutninger fra planleggingen.
- `CLAUDE.md`: hvordan det er bygget, og reglene for å endre det.
