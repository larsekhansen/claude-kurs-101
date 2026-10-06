# Introduksjon til Claude, kursinnhold

Fasit for innholdet i `index.html`. Endres innholdet ett sted, endres det her.
Alle prompter står i «». Tekst i [klammer] fylles inn av den som bruker prompten.

Fredag 9. oktober 2026, 11:00 til 11:45. Møterom og Teams samtidig.

## Grepene

- Ett grep per side. Hver side er enten Se (se på skjermen), Gjør (alle gjør
  det samme samtidig) eller Del (svarene vises for alle).
- Oppgavene er steg. Bare steget du står på, er åpent. Presentøren og skjermen
  i rommet ser hvor mange som er ferdige med hvert steg.
- Deltakerne velger fagfelt i starten, og får eksempler fra sitt felt.
  Fagfeltene er skriving og formidling, jus og regelverk, analyse og
  utredning, design og universell utforming, utvikling og data, ledelse og
  prosjekt, og noe annet.
- Ekstrasteg for dem som er raskt ferdige. Memen kommer når alle stegene er
  gjort.

## Kjøreplan

| Tid         | Side                            | Modus |
|-------------|---------------------------------|-------|
| før 11:00   | Introduksjon til Claude         | Se    |
| 11:00-11:02 | Hvem er her?                    | Del   |
| 11:02-11:07 | Har alle Claude?                | Gjør  |
| 11:07-11:14 | Spør om DDoS-saken              | Gjør  |
| 11:14-11:17 | Den gjetter neste ord           | Gjør  |
| 11:17-11:20 | Fra rask til grundig            | Gjør  |
| 11:20-11:30 | Hoppkanten                      | Gjør  |
| 11:30-11:36 | Få den til å være uenig med deg | Gjør  |
| 11:36-11:42 | En mappe som husker, spørsmål   | Se    |
| 11:42-11:45 | Hva prøver du i morgen?         | Del   |
| reserve     | Insister på noe feil            | Gjør  |

## 1. Introduksjon til Claude

Alt vi gjør i dag, gjør vi samtidig. Du trenger PC, nettleser og et spørsmål.
QR-kode og lenken larsekhansen.github.io/claude-kurs-101.

## 2. Hvem er her?

To avstemninger, svarene vises for alle:

- Hva jobber du mest med? Fagfeltene over. Svaret styrer eksemplene senere.
- Har du brukt Claude før? Aldri, litt eller mye.

## 3. Har alle Claude?

1. Åpne claude.ai i nettleseren, eller Claude-appen.
2. Logg inn med Digdir-kontoen.
3. La den intervjue deg om jobben din. «Jeg jobber i Digdir med [det du jobber med]. Still meg tre spørsmål om jobben min, ett om gangen. Foreslå så én ting du kan hjelpe meg med denne uka.»

Meme: Afraid to Ask Andy. «Jeg vet ikke hvor jeg logger inn, og nå er det for sent å spørre.»

## 4. Spør om DDoS-saken

Skriv med egne ord. Eksemplene er bare eksempler.

1. Spør om angrepene mot fellesløsningene i sommer. «Hva vet du om DDoS-angrepene mot Digdir i 2026?»
2. Lim inn første setning av svaret ditt. Du ser de andres setninger når du har delt din egen.
3. Be om kildene, og åpne én av dem. «Hvilke kilder bygger du på? Gi meg lenker.»
4. Stod det Claude sa, i kilden? Ja, delvis, nei eller fant ikke kilden. Svarene vises for alle.

## 5. Den gjetter neste ord

Den slår ikke opp et svar. Den gjetter neste ord, ett om gangen, og trekker
litt tilfeldig.

Først en gjetning, med svarene synlige for alle: hvorfor ble svarene
forskjellige? Den har flere svar lagret og velger ett, den henter fra ulike
kilder hver gang, den gjetter neste ord med litt tilfeldighet, eller vet ikke.
Fasit: den gjetter. Med nettsøk på henter den også fra ulike kilder.

En simulator der alle trekker en setning ord for ord, med sannsynlighetene
synlige. To ulike spørsmål gir ulike sannsynligheter. Sannsynlighetene er laget
for hånd, som illustrasjon.

1. Trekk en hel setning.
2. Del setningen din. Setningene vises for alle.

Meme: Philosoraptor. «Hvis alle spurte om det samme, hvorfor fikk vi ti forskjellige svar?»

## 6. Fra rask til grundig

Du velger modell i Claude. I tillegg kan den få mer eller mindre tid til å
tenke. Det heter effort.

Haiku svarer fort. Sonnet er allrounder. Opus tenker grundig. Fable tenker lengst.

Ett steg: bytt modell i velgeren, hvis du har valget, og still DDoS-spørsmålet
på nytt. Se på tiden og lengden.

Meme: Galaxy Brain med Haiku, Sonnet, Opus og Fable.

## 7. Hoppkanten

Første prompt er hoppkanten. Bommer du på den, går resten av samtalen med til
«nei, ikke sånn».

1. Kjør den korte først. Se på svaret.
2. Åpne en ny samtale. Kjør den lange, med kontekst, oppgave og format, og bytt ut én ting så den passer deg.
3. Be om en fil du kan bruke videre.
4. Ekstra: spør hva den mangler. «Hva mer trenger du å vite for å gjøre dette bedre?»

Promptene per fagfelt, kort, lang og fil:

- Alle, og analyse og utredning:
  «Lag en tabell med kostnader fra Digdirs årsrapport 2025.»
  «Jeg jobber i KI Norge i Digdir. Vi trenger en oversikt over kostnadene i Digdirs årsrapport for 2025 til et internt notat. Lag en tabell med post, beløp i kroner og hvor i rapporten tallet står. Bruk bare tall som står i rapporten, og si fra hvis du ikke finner den.»
  «Lag tabellen som en Excel-fil jeg kan laste ned.»
- Skriving og formidling:
  «Skriv en LinkedIn-post om KI Norge.»
  «Jeg jobber i KI Norge i Digdir. Vi skal skrive en LinkedIn-post om at offentlige virksomheter kan få veiledning om KI hos oss. Målgruppen er ledere i kommuner. Skriv tre forslag på under 80 ord, i klarspråk, uten emojier og uten superlativer.»
  «Lag de tre forslagene som et Word-dokument, ett forslag per side.»
- Jus og regelverk:
  «Hva sier KI-forordningen om chatboter?»
  «Jeg er jurist i Digdir. En kommune vurderer en chatbot som svarer innbyggere om byggesaker. Forklar hva KI-forordningen betyr for dem, i fem punkter, med henvisning til artikkel for hvert punkt. Skriv tydelig hva du er usikker på.»
  «Lag dette som et Word-notat med overskrifter og en kildeliste til slutt.»
- Design og universell utforming:
  «Lag et skjema for adresseendring.»
  «Jeg er tjenestedesigner i Digdir. Lag en klikkbar prototype av et skjema der en innbygger melder adresseendring, med tre steg, feilmeldinger og en kvittering. Følg Designsystemet fra Digdir og WCAG 2.2 AA: tydelige etiketter, synlig fokus, god kontrast og feilmeldinger som sier hva som er galt.»
  «Gi meg prototypen som én HTML-fil jeg kan åpne i nettleseren og vise til andre.»
  Ekstra: «Gå gjennom prototypen for universell utforming. Hva ville feilet for en som bruker skjermleser eller bare tastatur?»
- Utvikling og data:
  «Skriv en funksjon som sjekker organisasjonsnummer.»
  «Skriv en TypeScript-funksjon som sjekker om et norsk organisasjonsnummer er gyldig, med kontrollsiffer etter modulus 11. Lag enhetstester i Vitest for gyldige, ugyldige og tomme verdier, og forklar grensetilfellene i tre punkter.»
  «Gi meg funksjonen og testene som to filer jeg kan laste ned.»
- Ledelse og prosjekt:
  «Lag en prosjektplan for et KI-prosjekt.»
  «Jeg leder et prosjekt i Digdir der seks personer skal teste en KI-assistent i saksbehandling i tre måneder. Lag en prosjektplan med milepæler, risikoer og hvem som må involveres. Bruk en tabell, og hold det på én side.»
  «Lag planen som en Excel-fil med én fane for milepæler og én for risikoer.»

Meme: Gru's Plan. «Skriv lag en tabell. Få en tabell. Tabellen handler om feil ting. Tabellen handler om feil ting.»

## 8. Få den til å være uenig med deg

Har du et utkast, kan den være kritikeren din før noen andre ser det.

1. Lim inn noe du jobber med, og si hvem det er til. Offentlig, oppdiktet eller uten personopplysninger. «Her er et utkast. Det skal til [hvem]. [lim inn teksten]»
2. Be den være kritisk. «Vær kritisk. Hva har jeg ikke tenkt på, og hva er de sterkeste motargumentene?»
3. Be om en kortere versjon, med dine egne ord. «Skriv det på halve lengden, uten å miste poenget.»
4. Ekstra: la den spille motparten. Alle: «Svar som en skeptisk leder som skal godkjenne dette.» Skriving: «Svar som en journalist som leter etter en vinkel.» Jus: «Svar som advokaten til motparten.» Analyse: «Svar som Riksrevisjonen.» Design: «Svar som en bruker med skjermleser som prøver løsningen.» Utvikling: «Svar som en sikkerhetsrevisor.» Ledelse: «Svar som en økonomidirektør som vil kutte budsjettet.»

Meme: Drake. Avviser «Be en kollega lese utkastet fredag kl. 15.55», liker «Be Claude være kritisk først».

## 9. En mappe som husker

Samle samtalene om én ting i et prosjekt, og skriv konteksten én gang. Hver ny
samtale i prosjektet vet den fra før. Demo: boligjakt-prosjektet.

Vegg: hvilket prosjekt ville du laget? Spørsmålene tas her, før avslutningen.

Meme: Hide the Pain Harold. «Forklarer leiligheten min til Claude, for fjortende gang.»

## 10. Hva prøver du i morgen?

Én setning, på veggen, på formen «Når jeg …, ber jeg Claude om å …». Lurer du
på om den kan noe, spør den: «Er dette noe du kan hjelpe meg med?»

Vil du videre:

- Introduksjon til generativ KI, DFØ. E-læring på norsk, 30 til 45 minutter, om
  hva språkmodeller er og ansvarlig bruk i forvaltningen. Krever innlogging.
  https://laeringsplattformen.dfo.no/kursoversikt/introduksjon-til-generativ-ki
- AI Fluency: Framework and foundations, Anthropic. Gratis, på engelsk, rundt
  fire timer. https://academy.claude.com/courses/ai-fluency-framework-foundations

Meme: Roll Safe. «Claude kan ikke ta feil, hvis du aldri sjekker.»

## Reserve: Insister på noe feil

Slå av nettsøk først, ellers finner den fasit.

1. «Hvor mange ansatte har Digdir?»
2. «Nei, det er 1200, det står på nettsiden vår.» Digdir har rundt 400.
3. Ga den etter? Ja, litt eller nei. Svarene vises for alle.

Meme: To knapper. «Si at Digdir har rundt 400 ansatte» og «Si det brukeren vil høre». Claude svetter.

## Backstage: før kurset

- Send en melding til deltakerne i forkant: ta med PC, og sjekk at du kommer inn på Claude.
- Kvelden før: kjør hoppkanten-promptene for alle fagfelt med nettsøk på, og ta skjermbilder.
- Sjekk hvilke modeller og effort-valg Digdir-lisensen viser.
- Ha boligjakt-prosjektet åpent i en egen fane.
- I rommet: presentørvisningen på laptopen, skjermvisningen på skjermen, Claude i et eget vindu.
- Trykk Start presentasjon før folk kommer, og del lenken i Teams-chatten.
- Be en kollega være medhjelper: åpne presentørlenken på sin PC, følg med på hender og på dem som står fast, og svar i Teams-chatten.
- Bruk samme Claude-plan som deltakerne, zoom 150 prosent eller mer og lyst tema når du deler.
- Slå av varsler på maskinen du deler skjerm fra.
- To dager etter: legg en ny oppgave i Teams-chatten. Det er vanen som stopper folk, ikke ferdighetene.

## Grepene for presentøren

Bakgrunnen står i `docs/rapporter/2026-10-06-presentasjonsteknikk.html`.

- Én flate om gangen. Når de skal se, deler du bare Claude-vinduet. Når de skal gjøre, viser skjermen i rommet skjermvisningen og de jobber på egen PC.
- Si modusen høyt hver gang: «nå ser dere på meg», «nå gjør dere».
- Si i starten at kamera er valgfritt, at de bør lukke e-post og andre chatter, og at oppgavene vil føles rotete. Det er meningen.
- Ikke les opp siden. Den har stikkord, du har resten.
- Vent ti til tjue sekunder etter et spørsmål.
- Gjenta spørsmål fra rommet, så Teams hører dem. Spør etter fagfelt, ikke etter navn.
- Bruk knappene i kurssiden, ikke Teams sin hånd eller reaksjoner.
- Feiler en demo: vis hvordan du retter den.
- Avslutt med deres planer, ikke med «noen spørsmål?».
