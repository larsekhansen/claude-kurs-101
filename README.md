# Claude-kurset

Interaktiv kursside for «Introduksjon til Claude» (KI Norge / Digdir).
Presentøren styrer hvilken side alle ser. Oppgavene er steg med eksempler fra
hvert fagfelt, og presentøren ser hvor mange som er ferdige. Avstemninger og en
anonym vegg viser svarene for alle. Deltakerne skriver bare et navn, ingen
innlogging.

Kurssiden: https://larsekhansen.github.io/claude-kurs-101/
Skjermen i møterommet: https://larsekhansen.github.io/claude-kurs-101/?skjerm

- `index.html`: appen, én fil.
- `worker/`: live-tjenesten, en Cloudflare Worker med Durable Object.
- `docs/kurs.md`: alt kursinnhold og alle prompter.
- `docs/oppsett.md`: deploy, presentør-token og lokal utvikling.
- `docs/handoff.md`: kontekst og beslutninger fra planleggingen.
- `docs/rapporter/`: beslutningsloggen og rapportene, nyeste øverst.
- `memer/`: memene, laget med memegen.link.
- `CLAUDE.md`: hvordan det er bygget, og reglene for å endre det.
