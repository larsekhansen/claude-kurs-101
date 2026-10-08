# Oppsett

Kurssiden er én statisk fil, `index.html`, på GitHub Pages. Presentør-synk,
tilstedeværelse, steg, avstemninger, veggen og reaksjoner går via en
Cloudflare Worker med én Durable Object, i `worker/`. Deltakerne logger ikke inn. De skriver et navn, og
serveren passer på at to som er koblet til samtidig ikke har samme navn.

## Adresser

- Kurssiden: https://larsekhansen.github.io/claude-kurs-101/
- Live-tjenesten: https://claude-kurs.lars1702.workers.dev, WebSocket på `/ws`
- Presentørlenken: `https://larsekhansen.github.io/claude-kurs-101/#presenter=<token>`
- Skjermvisningen for møterommet: https://larsekhansen.github.io/claude-kurs-101/?skjerm

Tokenet står ikke i repoet. Det ligger som secret i Workeren.

## Wrangler-profil

Workeren ligger på Lars sin private Cloudflare-konto. Innloggingen ligger i en
egen wrangler-profil, så den ikke blandes med jobbinnloggingen:

```bash
export XDG_CONFIG_HOME="$HOME/.config/cf-privat"
npx wrangler login
npx wrangler whoami
```

`login` trengs bare første gang. `whoami` skal vise gratiskontoen.
`account_id` i `worker/wrangler.jsonc` hindrer deploy fra en annen innlogging.

## Deploy Workeren

```bash
cd worker
XDG_CONFIG_HOME="$HOME/.config/cf-privat" npx wrangler deploy
```

## Presentør-token

Lag et nytt token og legg det inn. Det gamle slutter å virke med en gang.

```bash
openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n' > /tmp/token.txt
cd worker
XDG_CONFIG_HOME="$HOME/.config/cf-privat" npx wrangler secret put PRESENTER_TOKEN < /tmp/token.txt
```

Presentørlenken er kurssidens adresse med `#presenter=` og innholdet i fila
bak. Slett fila etterpå. Tokenet må være minst 16 tegn, og bare bokstaver,
tall, `-` og `_`.

Siden fjerner tokenet fra adresselinja med en gang og husker det bare i den
fanen. Lenken du deler i Teams, er derfor alltid den vanlige.

## I møterommet

Presentørvisningen hører hjemme på laptopen, med notater og navn. Skjermen i
rommet får skjermvisningen (`?skjerm`): stor tekst, ingen knapper, følger
presentøren, viser fremdrift, avstemninger og veggen, og telles ikke som
deltaker. Den åpner bare steget flertallet står på. På skjermer fra 1200
piksler og bredere står veggen, stilprompten og memen i en egen kolonne, så
alt får plass uten å rulle. Claude ligger i et eget vindu som deles når du
demonstrerer.

## GitHub Pages

Pages publiserer fra `main`, rotmappa. Ingen byggesteg.

## Lokal utvikling

```bash
python3 -m http.server 8000
cd worker && npx wrangler dev --port 8787
```

Legg `PRESENTER_TOKEN=<noe på minst 16 tegn>` i `worker/.dev.vars`, som git
ignorerer. Åpne http://localhost:8000 og legg til `#presenter=<tokenet>` for
presentørvisningen. Fra localhost kobler siden til `ws://127.0.0.1:8787/ws` og
aldri til produksjonsrommet. `?live=` overstyrer adressen, bare på localhost.

## Slik virker live-laget

- Hver fane har én WebSocket. Første melding er `hello` med nettleser-id,
  navn og eventuelt token. Serveren svarer `welcome` med rolle, hvilken side
  presentasjonen står på, og om navnet var ledig.
- Presentøren sender `go` ved hvert sidebytte. Siden lagres i Durable Object,
  så de som kommer sent, lander på riktig side.
- Tilstedeværelse regnes ut fra de åpne forbindelsene. Alle får antall, navn
  og hånd per person med hender først, fordelingen i avstemningene, hvor mange
  som er ferdige med hvert steg, og `free`, hvor mange som blar selv. Bare
  presentøren får fagfelt, fremdrift og følging per person.
- `step` sier hvor mange steg en deltaker er ferdig med på en side, `vote`
  svarer på en avstemning. Fagfeltet er avstemningen `felt`.
- `post` legger et innlegg på en vegg. Veggen er anonym, serveren lagrer bare
  teksten, maks 240 tegn og 80 innlegg per vegg. Presentøren tømmer en vegg
  med `wipe`.
- Skjermvisningen sier `screen: true` i `hello`, og telles ikke.
- Presentøren kan sende `reveal` (vis eller skjul fasiten i en avstemning,
  lagres så de som kommer sent ser den), `fx` (applaus til alle andre) og
  `spot` (løfter fram et innlegg fra veggen, uten navn, eller lukker det).
- `live` har `since`, tidspunktet presentasjonen ble startet, og `by`, fanen
  som styrer. `since` brukes av tidtakeren og nullstilles når presentasjonen
  stoppes. Bare fanen i `by` sender `go`. En annen fane med presentørlenken
  blar fritt til den tar over med Styr herfra.
- Deltakerne sier fra med `me` og `follow` når de blar selv eller følger igjen.
  Presentøren kan sende `pull`, som henter alle til siden presentasjonen står
  på.
- `count` med `sec` starter en nedtelling på inntil en time, og `off` stopper
  den. Den lagres, og `welcome` og `count` har `now`, serverens klokke, så
  klientene regner ut resten likt.
- Spørsmål fra salen: `ask` legger inn et anonymt spørsmål på maks 240 tegn,
  med høyst 60 spørsmål og tre per 30 sekunder per fane. `like` med `on`
  stemmer eller trekker stemmen, `answered` merker som besvart, og `qwipe`
  tømmer. Serveren husker hvem som har stemt, men sender bare antallet. `spot`
  med `q` løfter et spørsmål fram.
- `hide` med `slide` og `on` skrur en side av eller på. Det lagres, sendes til
  alle som `hidden`, og står i `welcome`. Skjulte sider hoppes over i
  navigasjonen for alle.
- `note` med `slide` og `text` lagrer presentørens egne notater for en side,
  maks 6000 tegn. Tom tekst går tilbake til notatene i kurssiden. Notatene
  sendes som `notes` bare til presentører, også i `welcome`. De ligger i
  Durable Object-lagringen og overlever nye versjoner av Workeren.
  Ryddeskriptet rører dem ikke.
- Navn er unike blant dem som er koblet til nå, uansett store og små
  bokstaver. Flere faner i samme nettleser er samme person, med samme navn,
  hånd og ferdig.
- Reaksjoner sendes til alle andre og strupes ved spam.
- Nullstill tar ned alle hender, også hos dem som kobler seg på igjen
  etterpå. Steg og svar blir stående.
- Klientene pinger hvert 25. sekund. Forbindelser uten livstegn på 2,5
  minutter lukkes, så tellerne ikke henger igjen.
- Bare nettsider fra `ALLOWED_ORIGINS` i `worker/wrangler.jsonc`, og
  localhost, får koble til.
