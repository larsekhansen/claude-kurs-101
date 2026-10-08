# Spesifikasjon

Hva kurssiden gjør, for hvem, og hvordan innholdet er bygd opp. Protokollen
mellom siden og live-tjenesten står i `../docs/oppsett.md`.

## Rammer

- Én HTML-fil, uten rammeverk og uten byggesteg. Den ligger på GitHub Pages.
- En liten live-tjeneste: en Cloudflare Worker med én Durable Object.
- Ingen innlogging for deltakerne. De skriver et navn, som må være ledig blant
  dem som er koblet til.
- Får siden ikke kontakt med tjenesten, virker den i solo-modus: alle blar
  selv, og fasiten vises når du har svart.

## Roller

| Rolle | Slik kommer man inn | Hva rollen kan |
|---|---|---|
| Presentør | Lenken med `#presenter=<token>` | Starte og stoppe presentasjonen. Bare fanen som startet, styrer. Ser navn, fagfelt og fremdrift, og har verktøyene under. |
| Medhjelper | Samme lenke i en annen fane eller på en annen PC | Ser det samme som presentøren, men blar fritt uten å flytte noen. Kan ta over med «Styr herfra». |
| Deltaker | Den vanlige lenken | Følger presentøren, slipper fri når hen blar selv, og kan hente seg inn igjen. Rekker opp hånda, reagerer, gjør steg, stemmer, deler og spør. |
| Skjerm | Lenken med `?skjerm` | Stor tekst for møterommet. Følger presentøren, telles ikke, har ingen knapper. |

## Funksjoner

For alle:

- Én side om gangen, med egen lenke (`#/side-id`). Piltaster, oversikt med
  kort for hver side, lys og mørk modus, mobil.
- Kopier-knapp på hver prompt. Prompter vises som snakkebobler.
- «N her» i toppen: hvem som er her, med hendene først i køen.
- Spørsmål fra salen: anonyme, og alle kan stemme på dem.
- En nedtelling når presentøren starter en.

For deltakerne:

- Velg fagfelt i starten, og få eksempler fra ditt felt.
- Steg i oppgavene, der bare det aktive er åpent.
- Avstemninger. Veggen viser de andres svar først når du har delt ditt eget.
- Hånd, 👍 og 😂.
- Juksearket til slutt, med eksempler fra ditt fagfelt og planen du skrev.

For presentøren:

- Notater øverst på siden, med neste side nederst.
- Tidtaker mot planen, og hvilke sider som kan kuttes hvis det går tregt.
- Vis svaret, applaus med konfetti, løft fram et innlegg eller et spørsmål på
  alle skjermer.
- Ta alle hit, med antallet som blar selv. Ta ned hender, når det trengs.
- Nedtelling på oppgavesidene, fullskjerm og klokke.
- Oversikten: skru sider av og på for alle, med planlagt tid regnet om og tall
  fra rommet på hvert kort.

For skjermen i rommet:

- På brede skjermer står veggen, stilprompten, memen og noen illustrasjoner i
  en egen kolonne, så det viktigste får plass uten å rulle.
- Bare steget flertallet står på, er åpent.
- Lenken for å bli med står i toppen på alle sider unntatt startsiden.
- Feirer når alle er ferdige med stegene.

## Innholdet: feltene på en side

Alt innhold ligger i `SLIDES` i `index.html`. Hver side er et objekt.

| Felt | Betyr |
|---|---|
| `id` | Unik id, små bokstaver, tall og bindestrek. Brukes i lenken. |
| `ch` | Kapittelet i toppen. Må stå i `CHAPTERS`. |
| `mode` | `se`, `gjor` eller `del`. |
| `min` | Planlagte minutter. `0.5` er 30 sekunder. |
| `kicker`, `title`, `lead` | Liten overtittel, tittel og ingress. |
| `dark` | Mørk side, brukt til pauser med humor. |
| `qr` | QR-kode, lenke og telleren for hvor mange som er med. |
| `polls` | Avstemninger: `id`, `q`, `options`, og eventuelt `answer` og `explain`. |
| `gate` | Resten av siden kommer først når fasiten er vist. |
| `steps` | Stegene: `text`, og eventuelt `say` (prompt), `wall`, `poll`, `auto`, `bonus`, `key`. |
| `say` | En tekst, eller ett objekt med én tekst per fagfelt, der `_` er standard. |
| `track` | Viser velgeren for fagfelt under stegene. |
| `wall` | En vegg for hele siden: `id`, `placeholder`. |
| `styleprompt` | En prompt som følger det alternativet som leder i en avstemning. |
| `stats` | «Dagens tall». |
| `cheat` | Knappen «Ta med juksearket». |
| `blocks`, `after` | Enkle blokker: avsnitt, liste, lenker, modeller. |
| `art`, `artAfter`, `artAside` | En illustrasjon fra `artHtml`, eventuelt holdt igjen til flertallet er ferdig med et steg, og eventuelt i kolonnen på skjermen. |
| `meme` | Memen. På Gjør-sider kommer den når stegene er gjort. |
| `notes` | Notatene, bare for presentøren. |
| `cut`, `reserve`, `backstage` | Kan kuttes. Ekstra, ikke med i planen. Bare for presentøren. |

## Personvern

- Navnet vises for alle i kurset. Det står i dialogen der man skriver det.
- Fagfelt, fremdrift og svar per person ser bare presentøren.
- Veggen og spørsmålene er anonyme. Tjenesten lagrer bare teksten. For
  stemmene husker den hvem som har stemt, men sender bare antallet.
- Ingen informasjonskapsler og ingen sporing. Siden husker navn, svar og steg
  i nettleseren til deltakeren.
- Oppgavene ber deltakerne bruke offentlig, oppdiktet eller ufarlig tekst.

## Tilgjengelighet

- Null brudd i axe for WCAG 2.2 AA, på alle sider og i alle visninger, lyst og
  mørkt.
- Alt virker med tastatur. Synlig fokus. Dialoger holder resten av siden
  inaktiv.
- Redusert bevegelse respekteres: ingen konfetti og ingen animasjoner.
- Illustrasjonene er tekst, ikke bilder, og memene har alt-tekst.

## Robusthet

- Mister siden kontakten, kobler den til igjen og sender det den vet.
- En ny innlasting holder deg der du var. Presentøren styrer videre.
- Går presentøren videre uten å vise svaret på en gjetning, vises det likevel.
- Fra localhost kobler siden til den lokale tjenesten, aldri til produksjon.

## Grenser

- 240 tegn per innlegg og spørsmål. 80 innlegg per vegg, 60 spørsmål.
- Tre spørsmål per 30 sekunder per fane, og struping av reaksjoner.
- 400 forbindelser. Forbindelser uten livstegn i 2,5 minutter lukkes.
- Nedtelling på inntil en time.
