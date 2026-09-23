# Claude-kurset, KI Norge / Digdir

Interaktiv kursside for «Introduksjon til Claude», et 45-minutters Teams-kurs
Lars Hansen holder for kolleger i Digdir. Sidene er slides, hver prompt kan
kopieres med ett trykk, og presentøren kan styre hvilken side publikum ser.
Skal hostes på GitHub Pages, åpent for alle med lenken, uten innlogging.

## Les først

1. `docs/handoff.md`: hele konteksten fra planleggingen, beslutninger og hvorfor.
2. `docs/kurs.md`: alt kursinnhold, alle prompter, kilder og notater. Dette er fasit for innholdet.
3. `index.html`: appen slik den er nå.

## Status

`index.html` er én selvstendig fil og fungerer i dag i «solo-modus» hvor som
helst: sider med egen lenke (`#/side-id`), piltaster, oversikt, kopier-knapper,
light/dark, mobil. Alt innhold ligger i `SLIDES`-arrayet øverst i scriptet.

Synk-laget er skrevet mot claude.ai-artefaktenes runtime og virker IKKE på
GitHub Pages. Det er alt som går via `window.claude.use("db")`,
`use("room")`, `use("user")` og `sendToClaudeSession`. På GitHub Pages er
`window.claude` udefinert, og koden faller allerede tilbake til solo-modus.

## Oppgaven

Bytt ut synk-laget med en backend som virker fra GitHub Pages, uten innlogging
for deltakerne. Behold alt annet uendret.

Funksjoner som skal virke etter byttet:

1. Presentørmodus. Presentøren åpner siden med et hemmelig token i
   URL-fragmentet, for eksempel `#presenter=<token>`. Token verifiseres på
   serversiden, aldri bare i klienten. Presentøren får «Start presentasjon»,
   «Stopp», «Notater», «Nullstill» og backstage-siden.
2. Følging. Når presentasjonen er i gang, hopper alle som følger til siden
   presentøren står på. Blar en deltaker selv, slipper hen fri og får en knapp
   «Gå til presentasjonen (n)». Sen ankomst skal lande på riktig side, så
   gjeldende side må ligge lagret, ikke bare kringkastes.
3. Tilstedeværelse. Antall her nå, antall ✋ (hånd) og antall ✅ (ferdig) vises
   for presentøren i toppen. Deltakerne toggler hånd og ferdig nederst.
   «Nullstill» hos presentøren tømmer hender og ferdige hos alle.
4. Reaksjoner. 👍 😂 ❓ fra deltakerne flyter opp på alle skjermer.
5. «Til Claude»-knappen (`data-send`, `sendToClaudeSession`) finnes ikke
   utenfor claude.ai. Fjern den.

Anbefalt stack: Supabase, gratisnivå. Én tabell `live_state` (én rad:
`slide_id`, `on`, `updated_at`) som alle kan lese via anon key og som bare
skrives gjennom én RPC `set_live(token, slide_id, on)` av typen security
definer som sammenligner token med en verdi i en privat tabell. Deltakerne
abonnerer på `postgres_changes` på `live_state`. Realtime Presence på én kanal
for her/hånd/ferdig, Broadcast på samme kanal for reaksjoner og nullstill.
Alternativ hvis Supabase er uønsket: PartyKit eller en Cloudflare Worker med
Durable Object, presentør-token sjekket i workeren. Velg én, ikke begge.

## Krav

- Én HTML-fil pluss eventuelt én JS-fil. Ingen rammeverk, ingen build-steg,
  ingen npm i produksjon. Supabase-klienten kan lastes fra CDN.
- Anon key i klienten er greit. Service key, presentør-token eller andre
  hemmeligheter skal aldri inn i repoet. Legg token i Supabase, ikke i koden.
- Deploy: GitHub Pages fra `main`, `index.html` i rot. Legg inn en kort
  oppsettsguide i `docs/oppsett.md` (Supabase-SQL, hvordan token settes,
  hvordan presentør-lenken lages).
- Test-scenario som skal virke før du sier deg ferdig: to nettleservinduer,
  ett med token og ett uten. Start presentasjon i det første, bla, og se at
  det andre følger. Bla i det andre, se at det slipper fri og at knappen for
  å hente seg inn igjen virker. Toggle ✋ og ✅ i det andre, se tellerne i det
  første. Trykk Nullstill, se at de tømmes.
- Kursinnholdet skal ikke endres. Må noe endres, oppdater `docs/kurs.md` i
  samme commit.

## Stil

- UI-tekst på norsk bokmål. Ingen tankestreker i tekst, bruk komma eller punktum.
- Behold designet: tokens i `:root`, light/dark via `prefers-color-scheme`,
  IBM Plex Sans / IBM Plex Mono / Source Serif 4 fra Google Fonts med fallback.
- Lean kode. Ikke abstraher mer enn oppgaven trenger.
