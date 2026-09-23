# Claude-kurset, KI Norge / Digdir

Interaktiv kursside for «Introduksjon til Claude», et 45-minutters Teams-kurs
Lars Hansen holder for kolleger i Digdir. Sidene er slides, hver prompt kan
kopieres med ett trykk, og presentøren kan styre hvilken side publikum ser.
Hostes på GitHub Pages, åpent for alle med lenken, uten innlogging.

## Les først

1. `docs/handoff.md`: hele konteksten fra planleggingen, beslutninger og hvorfor.
2. `docs/kurs.md`: alt kursinnhold, alle prompter, kilder og notater. Dette er fasit for innholdet.
3. `docs/oppsett.md`: live-tjenesten, deploy, presentør-token og lokal utvikling.
4. `index.html`: appen.

## Slik er det bygget

- `index.html` er hele appen, én fil. Alt innhold ligger i `SLIDES`-arrayet
  øverst i scriptet. Sider med egen lenke (`#/side-id`), piltaster, oversikt,
  kopier-knapper, light/dark og mobil.
- Live-laget er en WebSocket mot en Cloudflare Worker med én Durable Object,
  `worker/index.js`. Presentøren åpner siden med `#presenter=<token>`, og
  tokenet sjekkes i Workeren. Deltakerne følger presentøren, slipper fri når
  de blar selv, og kan hente seg inn igjen. ✋, ✅ og reaksjoner.
- Deltakerne skriver bare et navn. Navn er unike blant dem som er koblet til.
- Får siden ikke kontakt med Workeren, virker den i solo-modus.

## Krav

- Én HTML-fil. Ingen rammeverk, ingen build-steg, ingen npm i produksjon.
  Workeren har ingen avhengigheter.
- Hemmeligheter skal aldri inn i repoet. Presentør-tokenet ligger som secret
  i Workeren.
- Deploy: GitHub Pages fra `main`, `index.html` i rot. Workeren deployes med
  wrangler og den private profilen i `docs/oppsett.md`. Bruk aldri
  Digdir-innloggingen til dette prosjektet.
- Kursinnholdet skal ikke endres. Må noe endres, oppdater `docs/kurs.md` i
  samme commit.
- Test før du sier deg ferdig: to nettleservinduer, ett med token og ett uten.
  Start presentasjon i det første, bla, og se at det andre følger. Bla i det
  andre, se at det slipper fri og at knappen for å hente seg inn igjen virker.
  Toggle ✋ og ✅ i det andre, se tellerne i det første. Trykk Nullstill, se at
  de tømmes.

## Stil

- UI-tekst på norsk bokmål. Ingen tankestreker i tekst, bruk komma eller punktum.
- Paletten er ki.norge.no sin: vinrødt og crimson, fersken og korall på varm
  papirbakgrunn. Tokens i `:root`, light/dark via `prefers-color-scheme`.
- PT Serif til overskrifter og Instrument Sans til resten, som på
  ki.norge.no. Begge fra Google Fonts, med fallback.
- Prompter vises som snakkebobler, ikke som kode. Mørke sider fyller hele
  scenen med vinrødt.
- Lean kode. Ikke abstraher mer enn oppgaven trenger.
