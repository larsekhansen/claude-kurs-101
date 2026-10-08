# Beslutningslogg

Beslutninger og milepæler for kurset, med den nyeste øverst. Hvordan loggen
føres, står i [README](README.md). Innholdet står i [`../kurs.md`](../kurs.md)
og oppsettet i [`../oppsett.md`](../oppsett.md).

## 2026-10-08

- **Navnene vises for alle, ikke bare for presentøren.** Bestilleren ville at
  alle skulle kunne trykke på «N her» og se hvem som er her. Hender står først,
  i køen. Fagfelt, fremdrift og svar per person er fortsatt bare for
  presentøren, og veggen og spørsmålene er anonyme. Teksten der man skriver
  navnet, sier at navnet vises for alle.
- **Håndsopprekning så ut til å ikke virke.** Den virket, men synte bare som et
  lite tall hos presentøren. Nå får presentøren beskjed med navn, ✋ blir
  korallfarget hos alle, også på skjermen i rommet, og deltakeren får
  bekreftet at hånda er oppe.
- **Grep fra PowerPoint og Mentimeter, der de gir mening:** spørsmål fra salen
  med stemmer, nedtelling for oppgavene, fullskjerm, klokke, neste side i
  notatene, og lenken for å bli med på skjermen i rommet. Ordsky, quiz med
  poengtavle og svart skjerm er ikke tatt med. Det kurset trenger, finnes
  allerede i veggene og avstemningene.
- **Ta alle hit.** Presentøren ser hvor mange som blar selv og kan hente dem
  med ett trykk. Det fantes ikke før, selv om det kunne virke sånn: å starte
  presentasjonen på nytt hentet alle, men nullstilte tidtakeren.
- **Bare fanen som startet presentasjonen, styrer den.** Før styrte alle faner
  med presentørlenken, så en medhjelper som bladde, ville flyttet hele rommet.
- **En ny innlasting holder deg der du var.** Deltakere som blar selv, blir
  stående. Skjermen i rommet blir stående på siste side når presentasjonen
  stoppes, i stedet for å hoppe til startsiden.
- **Lokalt kobler siden aldri til produksjonsrommet.** En test mot produksjon
  forstyrret folk som var koblet til. Siden kobler nå til den lokale tjenesten
  når den kjøres fra localhost, og tester mot produksjon kjøres bare når
  rommet er tomt.

## 2026-10-06

- **Runde 3: hele kurset gått gjennom side for side, i alle visningene.** Det
  som ble endret:
  - Gjetningen på neste ord-siden var avslørt av tittelen og kapittelnavnet.
    Nå spør siden «Hvorfor ble svarene forskjellige?», kapittelet heter
    «Første samtale», og tittelen bytter til «Den gjetter neste ord» først når
    presentøren viser svaret. Simulatoren kommer etter svaret.
  - Ingen står fast bak en gjetning. Svaret vises også når presentøren går
    videre uten å vise det, og for den som blar selv uten presentasjon, når
    hen har svart.
  - Skjermen i rommet bruker hele bredden. Veggen, stilprompten og memen står i
    en egen kolonne, og bare steget flertallet står på, er åpent. Da får det
    viktigste plass uten å rulle.
  - Startsiden teller hvor mange som er med, og finalen har fått et sjette
    tall som en tørr callback til åpningen.
  - Tilgjengelighet: axe på alle sider i fem visninger, lyst og mørkt. Falmede
    svar og steg hadde for lav kontrast. Rettet, nå null brudd.

- **Versjon 3: kurset bygget for å være gøy, stilig og holde tiden.** Planen
  ble gjennomgått i tre runder før byggingen. Det som kom inn:
  - «Ekte eller Claude?» som krok mens folk kommer: én setning fra Grunnloven og
    to fra Claude, med fasit og meme etterpå. Poenget er at overbevisende ikke
    er det samme som sant.
  - «Velg stilen» som pause: alle stemmer, presentøren kjører vinneren live.
    Poenget er at rolle og format styrer svaret.
  - «Dagens tall» som finale, med applaus.
  - Kapittelkart i toppen, mørke sider for pausene, og en glidebryter for
    tilfeldighet i neste ord-simulatoren.
  - Presentøren kan vise fasit, sende applaus, løfte fram innlegg fra veggen,
    og har tidtaker mot planen.
  - Juksearket, med eksempler fra deltakerens fagfelt og planen deltakeren
    skrev.
- **Tidsplanen er kortet til rundt 35 minutter.** En gjennomkjøring med målte
  svartider (10 til 76 sekunder per prompt) viste at den forrige planen gikk
  over 45 minutter. Intervjuet er én runde, modellsiden ett minutt, og
  sparringen har lim inn og kritikk i samme steg.
- **Årsrapport-eksempelet er byttet ut** med en tabell over DDoS-angrepene.
  Årsrapporten for 2025 finnes bare som en PDF på 24 MB, og både henting og
  vedlegg feilet i test. Den nye prompten virket.

- **Tre grep er tatt fra DFØ-kurset «Introduksjon til generativ KI»:** et
  eksempel på det du vil ha (E-en i KORE) som ekstrasteg på hoppkanten,
  skilletegn rundt innlimt tekst i sparringen, og et KI-minutt på
  avdelingsmøtene til slutt. Resten er grunnlag og ansvarlig bruk, som det
  lenkes til.

- **Research på presentasjonsteknikk er flettet inn**
  ([rapporten](2026-10-06-presentasjonsteknikk.html)). Det som ble endret:
  - Alle gjetter før forklaringen av hvorfor svarene spriker.
  - Kildesjekken er et steg i DDoS-oppgaven, med svarene synlige for alle.
  - Første oppgave er at Claude intervjuer deg om jobben din, som virker for
    alle fagfelt.
  - Modellvalget prøver alle selv.
  - Veggen viser de andres svar først når du har delt ditt eget.
  - Slutten er en plan på formen «når jeg …, ber jeg Claude om å …», og
    spørsmålene tas før den.
  - Presentørnotatene har grepene der de skal brukes.
- **Satire-åpningen og «tre setninger» kommer ikke tilbake,** selv om researchen
  anbefalte dem. De ble tatt ut fordi de var abstrakte, og prinsippet bak
  (spørsmål før forklaring) er brukt andre steder.
- **Ingen egen side om hva man kan lime inn.** Det står i steget der man limer
  inn egen tekst. Ansvarlig bruk dekkes av DFØ-kurset «Introduksjon til
  generativ KI», som det lenkes til fra siste side sammen med Anthropics «AI
  Fluency».

- Kurset er bygget om rundt ett grep per side, med modusene Se, Gjør og Del.
  Hvorfor: første versjon hadde opptil seks prompter per side og ble for tett.
- Oppgavene er steg der bare det aktive er åpent, og presentøren ser hvor
  mange som er ferdige med hvert steg. Hvorfor: presentøren må kunne se når
  rommet er klart til å gå videre.
- Deltakerne velger fagfelt selv i starten og får eksempler fra sitt felt.
  Hvorfor: blandet publikum, og eksempler fra egen hverdag er lettere å bruke.
  Fagfeltene slås ikke opp på forhånd, av hensyn til personvern.
- Ekstrasteg for dem som blir raskt ferdige. Hvorfor: ulikt erfaringsnivå i
  rommet, uten at noen må vente passivt.
- Anonym vegg og avstemninger der svarene vises for alle. Bare presentøren ser
  navn og fremdrift per person. Hvorfor: alle kan bidra, også de på Teams,
  uten å bli hengt ut.
- Skjermvisning (`?skjerm`) for møterommet. Hvorfor: kurset holdes i møterom og
  på Teams samtidig.
- Satiresiden, «tre setninger» og regelsiden er tatt ut. Hvorfor: de var
  abstrakte eller normative. Poengene vises i stedet gjennom oppgavene.
- Memer laget med memegen.link ligger i repoet og kommer som belønning når
  stegene er gjort. Hvorfor: humor som hører til poenget, uten å avbryte.

## 2026-09-23

- Live-laget er en Cloudflare Worker med én Durable Object på en privat
  gratiskonto, ikke Supabase og ikke en jobbkonto. Hvorfor: alt kunne settes
  opp uten nye kontoer, og navn kan sjekkes mot hverandre på ett sted.
- Deltakerne logger ikke inn. De skriver et navn, som må være ledig. Hvorfor:
  lavest mulig terskel.
- Designet bruker paletten og skriftene fra ki.norge.no.
- «Til Claude»-knappen er fjernet. Hvorfor: den virker bare inne i claude.ai.
