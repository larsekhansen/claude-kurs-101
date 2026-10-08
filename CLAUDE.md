# Claude-kurset, KI Norge / Digdir

Interaktiv kursside for «Introduksjon til Claude», et 45-minutters Teams-kurs
Lars Hansen holder for kolleger i Digdir. Sidene er slides, hver prompt kan
kopieres med ett trykk, og presentøren kan styre hvilken side publikum ser.
Hostes på GitHub Pages, åpent for alle med lenken, uten innlogging.

## Les først

1. `docs/handoff.md`: hele konteksten fra planleggingen, beslutninger og hvorfor.
2. `docs/kurs.md`: alt kursinnhold, alle prompter, kilder og notater. Dette er fasit for innholdet.
3. `docs/oppsett.md`: live-tjenesten, deploy, presentør-token og lokal utvikling.
4. `docs/rapporter/`: beslutningsloggen, og rapporten om presentasjonsteknikk som
   ligger bak grepene i kurset.
5. `index.html`: appen.
6. `oppskrift/`: hvordan kurset ble laget, og hvordan et nytt kurs lages fra
   denne malen. Oppdater den når arbeidsgangen eller arkitekturen endres.

## Slik er det bygget

- `index.html` er hele appen, én fil. Alt innhold ligger i `SLIDES`-arrayet
  øverst i scriptet. Sider med egen lenke (`#/side-id`), piltaster, oversikt,
  kopier-knapper, light/dark og mobil.
- Hver side har en modus: Se, Gjør eller Del. Oppgaver er steg der bare det
  aktive er åpent. Presentøren og skjermen i rommet ser hvor mange som er
  ferdige med hvert steg.
- Deltakerne velger fagfelt i starten og får eksempler fra sitt felt. Prompter
  kan derfor være et objekt med én tekst per fagfelt, der `_` er standard.
- Avstemninger og en anonym vegg viser svarene for alle. En avstemning kan ha
  fasit, som presentøren viser når hen vil. En side med `gate` holder resten
  av siden tilbake til fasiten er vist.
  Fasiten vises også når presentøren går videre, og for den som blar selv uten
  presentasjon når hen har svart.
- Fire kapitler vises i toppen. De mørke sidene er pauser med humor.
- Presentøren har applaus (konfetti på alle skjermer), kan løfte fram innlegg
  fra veggen, og har tidtaker mot planen. Sider merket `cut` kan kuttes.
- Juksearket på siste side lages i nettleseren fra deltakerens fagfelt og
  egne innlegg.
- Live-laget er en WebSocket mot en Cloudflare Worker med én Durable Object,
  `worker/index.js`. Presentøren åpner siden med `#presenter=<token>`, og
  tokenet sjekkes i Workeren. Deltakerne følger presentøren, slipper fri når
  de blar selv, og kan hente seg inn igjen. ✋ og reaksjoner. Bare fanen som
  startet presentasjonen, styrer. En medhjelper med samme lenke blar fritt.
- Alle kan trykke på «N her» og se hvem som er her og køen av hender. Bare
  presentøren ser fagfelt, fremdrift og hvem som blar selv, og kan ta alle
  med seg.
- Spørsmål fra salen med stemmer, og nedtelling som presentøren starter.
- Presentøren kan redigere notatene i kurssiden. De lagres i Workeren og går
  bare til presentører. Skal endringene inn i repoet, hent dem med en
  presentørforbindelse og oppdater `SLIDES` og `docs/kurs.md`.
- «Sider» åpner en oversikt med alle sidene som kort. Presentøren kan skru
  sider av og på for alle, og ser tall fra rommet på hvert kort.
- Illustrasjonene er tegnet i HTML og CSS i `artHtml`, ikke bilder, så de
  følger fargene, mørk modus og skjermstørrelsen. `art` på en side viser en,
  og `artAfter` holder den igjen til flertallet er ferdig med et steg.
- `?skjerm` er visningen for skjermen i møterommet. Den følger presentøren og
  telles ikke som deltaker. Den åpner bare steget flertallet står på, og på
  brede skjermer står veggen, stilprompten og memen i en egen kolonne.
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
  Fullfør steg i det andre, se tellerne under stegene i det første. Rekk opp
  hånda, se varselet og ✋ i det første, trykk Ta ned hender, se at den går
  ned. Del noe på en vegg, og se at det kommer opp i det første. Still et
  spørsmål og stem på det. Bla i en fane med samme presentørlenke, og se at
  ingen andre flytter seg. Last siden på nytt som deltaker, og se at du blir
  der du var. Skriptene i ende-til-ende-testen ligger
  ikke i repoet. Testen kjøres med Playwright mot `wrangler dev` og en lokal
  server, med presentør, to deltakere og skjermvisningen i hver sin kontekst.
  Tilgjengeligheten sjekkes med axe på alle sider, i presentør-, deltaker- og
  skjermvisningen, lyst og mørkt. Målet er null brudd.
- Kjør aldri tester som endrer tilstand mot produksjonsrommet mens folk er
  koblet til. Se først, som skjermvisning, som ikke telles og ikke endrer noe.
  Fra localhost kobler siden til `wrangler dev`, ikke til produksjon.

## Stil

- UI-tekst på norsk bokmål. Ingen tankestreker i tekst, bruk komma eller punktum.
- Paletten er ki.norge.no sin: vinrødt og crimson, fersken og korall på varm
  papirbakgrunn. Tokens i `:root`, light/dark via `prefers-color-scheme`.
- PT Serif til overskrifter og Instrument Sans til resten, som på
  ki.norge.no. Begge fra Google Fonts, med fallback.
- Prompter vises som snakkebobler, ikke som kode. Mørke sider fyller hele
  scenen med vinrødt.
- Ett grep per side, og høyst to prompter synlige om gangen. Luft rundt dem.
- Humoren er tørr og hører til poenget. Memene ligger i `memer/`, laget med
  memegen.link. På Gjør-sider kommer memen når alle stegene er gjort.
- Ikke normativt eller moraliserende. Vis det, ikke forkynn det.
- Lean kode. Ikke abstraher mer enn oppgaven trenger.
