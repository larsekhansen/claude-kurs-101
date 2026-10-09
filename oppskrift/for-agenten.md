# Oppskrift for en agent: lag et interaktivt kurs som dette

Du er en KI-agent som skal lage et kurs i samme klasse som «Introduksjon til
Claude», men om et annet tema. Les hele denne fila før du gjør noe. Les så
`spesifikasjon.md`, `design.md` og `presentasjonsteknikk.md` i samme mappe.
`prosessen.md` forteller hvordan originalen ble laget, og hva som gikk galt.

## Oppdraget

Lag en kursside for en økt der alle er til stede samtidig, i et møterom, på
Teams eller begge deler. Sidene er lysbilder. Presentøren styrer hvilken side
alle ser. Deltakerne følger med på egen PC, gjør små oppgaver, stemmer, deler
korte svar og stiller spørsmål. Ingen logger inn. Siden virker også uten
live-tjenesten, da blar hver deltaker selv.

Målet er ikke en pen presentasjon. Målet er at folk kan noe nytt når de går,
og at de faktisk bruker det dagen etter.

## Spør om dette først

Still alle spørsmålene i én runde, og ikke spør om det du kan bestemme selv.

1. Tema, og hva deltakerne skal kunne etterpå. To eller tre ting, ikke flere.
2. Hvem som kommer: hvor mange, hvilke fagfelt, og hvor mye de kan fra før.
3. Lengde, dato og format: møterom, Teams eller begge.
4. Hvilke verktøy deltakerne har tilgang til, og med hvilken lisens.
5. Eksempler fra hverdagen deres, eller en sak alle kjenner.
6. Hvem som presenterer, og om det finnes en medhjelper.
7. Farger og skrift: en merkevare å følge, eller fritt.
8. Hvor siden skal ligge: GitHub Pages, et annet sted, eller som ett artefakt
   i claude.ai.

## Arbeidsgangen

Hver fase har en port. Ikke gå videre før porten er passert.

### 1. Research

Finn ut av temaet, publikummet og hva som virker i undervisning av voksne.
Skriv et kort notat med kilder.

Port: Alle faktapåstander i kurset har en kilde du har åpnet selv. Lover
sjekkes i rå tekst hos Lovdata, tall hos den som eier tallet.

### 2. Plan

Lag en kjøreplan: én ting per side, hver side er Se, Gjør eller Del, med
minutter. Planlegg rundt 35 av 45 minutter, resten er buffer. Merk sider som
kan kuttes, og ha én reserveside.

Kritiser planen i minst to runder. Spør: Er det en krok i første minutt? Én
flate om gangen? Gjør folk mer enn de ser? Er eksemplene fra deres hverdag?
Er det pauser med humor? Er slutten en topp? Holder tiden?

Port: Planen holder tiden på papiret, og hver side har én jobb.

### 3. Innhold

Skriv `docs/kurs.md` først. Det er fasit for innholdet. Høyst to prompter
eller oppgaver synlige per side. Korte titler. Notater til presentøren med
replikker og hva hen skal si høyt.

Test hver prompt i det samme verktøyet og den samme lisensen som deltakerne
har. Mål tiden. Se at kontrasten du vil vise, faktisk dukker opp. Bytt ut
eksempler som feiler, for eksempel filer som er for store til å hentes.

Port: Alle prompter er kjørt, og alle fakta er sjekket.

### 4. Bygg

Start fra denne malen: `index.html` og `worker/`. Bytt innhold, ikke
arkitektur. Se «Tilpass til et nytt tema» under.

### 5. Test

- Ende-til-ende med Playwright mot `wrangler dev` og en lokal server:
  presentør, to deltakere og skjermvisningen i hver sin kontekst.
- Følging, slippe fri, hente seg inn, ta alle hit, ny innlasting.
- Hånd, varsel, ta ned hender. Vegg, avstemning, fasit, spørsmål med stemmer.
- En medhjelper med samme presentørlenke flytter ingen.
- Solo-modus: siden uten live-tjenesten.
- Nullstill alt: svar, steg, innlegg, spørsmål, fasit og hender forsvinner,
  også i faner som var lukket da det skjedde.
- Notatene: redigering, fet skrift og «Tilbake til originalen».
- axe på alle sider i presentør-, deltaker- og skjermvisningen, lyst og mørkt,
  også med paneler og oversikten åpne. Målet er null brudd.

Port: Alle sjekker grønne, ingen konsollfeil, null brudd i axe.

### 6. Publiser

Siden på GitHub Pages eller tilsvarende. Live-tjenesten på en konto som er
riktig for prosjektet. Presentørtokenet som hemmelighet i tjenesten, aldri i
repoet. Lever presentørlenken privat til presentøren.

Port: En sjekk i produksjon som ikke forstyrrer noen. Kjør aldri tester som
endrer tilstand mens ekte folk er koblet til. Se først, som skjermvisning.

### 7. Øv

Én gjennomkjøring med presentørlenken på laptopen og skjermvisningen på en
annen skjerm. Send deltakerne en kort beskjed i forkant. Avtal med
medhjelperen.

### 8. Etterpå

En ny liten oppgave i chatten to dager etter. Et minutt på neste
avdelingsmøte der én forteller hva hen prøvde. Før beslutningene inn i
`docs/rapporter/beslutningslogg.md`.

## Arkitekturen du gjenbruker

- Én HTML-fil uten byggesteg og uten rammeverk. Alt innhold ligger i
  `SLIDES` øverst i scriptet.
- En Cloudflare Worker med én Durable Object som holder rommet: hvilken side
  presentasjonen står på, hvem som er her, hender, steg, svar, vegger,
  spørsmål, nedtelling og skjulte sider. JSON over WebSocket.
- Presentøren åpner siden med `#presenter=<token>`. Tokenet sjekkes i
  tjenesten. Skjermen i rommet bruker `?skjerm`.
- Hvorfor: ingen innlogging for deltakerne, gratis drift, og alt kan settes
  opp av én person uten nye systemer.

Protokollen står i `docs/oppsett.md`.

## Tilpass til et nytt tema

I `index.html`:

- [ ] `SLIDES`: bytt innholdet. Feltene står i `spesifikasjon.md`.
- [ ] `FIELDS`: fagfeltene deltakerne velger blant.
- [ ] `CHAPTERS`: kapitlene i toppen. Ingen kapittelnavn som røper svaret på
      en gjetning.
- [ ] `COURSE_URL` og `QR`: ny adresse og ny QR-kode for startsiden.
- [ ] `LIVE_URL`: adressen til din Worker.
- [ ] `artHtml`: illustrasjonene. Lag nye for dine viktigste poenger.
- [ ] `cheatParts`: hva som kommer med på juksearket.
- [ ] `<title>`, `meta description` og teksten i navnedialogen.
- [ ] Fargene i `:root`, både lys og mørk modus, hvis du følger en annen
      merkevare.
- [ ] Teksten «Lars» i grensesnittet, hvis presentøren heter noe annet.

I `worker/wrangler.jsonc`: `name`, `account_id` og `ALLOWED_ORIGINS`. Lag et
nytt presentørtoken og legg det inn som hemmelighet.

I `memer/`: nye memer, laget med memegen.link, med norsk tekst og alt-tekst.

## Krav som ikke kan brytes

- Ingen hemmeligheter i repoet. Ingen personopplysninger i offentlige filer.
- Sjekk fakta i primærkilden. Claude tar feil på en overbevisende måte, også
  når den lager kurs om nettopp det.
- Én ting per side, høyst to prompter synlige om gangen, og luft rundt.
- Ikke moraliser. Vis det, ikke forkynn det.
- Null brudd i axe, og alt skal virke med tastatur.
- Bruk riktig konto. Aldri jobbkontoer i private prosjekter, og omvendt.
- Ikke test mot produksjonsrommet mens ekte folk er koblet til.

## Vanlige feil fra originalen

- For mange prompter per side. Første versjon hadde opptil seks, og ble for
  tett.
- Abstrakte sider uten oppgave. De ble tatt ut.
- En gjetning som ble røpet av tittelen og kapittelnavnet før folk rakk å
  gjette.
- Skjermen i rommet med det viktigste under kanten.
- Håndsopprekning som bare synte som et lite tall hos presentøren.
- Alle faner med presentørlenken styrte presentasjonen, så en medhjelper som
  bladde, flyttet hele rommet.
- En fasit som Claude hadde funnet på. Lovdata avslørte den.
- Et eksempel med en PDF som var for stor til å hentes.
- En test mot produksjon som forstyrret folk som var koblet til.

## Leveransen

- `index.html`, `worker/`, `memer/`
- `docs/kurs.md` med alt innhold, `docs/oppsett.md` med drift og protokoll
- `docs/rapporter/beslutningslogg.md`, nøytral og uten navn
- Presentørlenken, levert privat
- En sjekkliste for dagen før og på dagen, se `sjekklister.md`
