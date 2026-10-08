# Design

Designet skal få folk til å gjøre én ting om gangen, og være stille nok til
at innholdet og humoren får plass.

## Prinsipper

- **Ett grep per side.** Høyst to prompter synlige om gangen, og luft rundt.
- **Prompter er replikker.** De vises som snakkebobler med en kopier-knapp,
  ikke som kode.
- **Modusen står øverst.** Se, Gjør eller Del, med minutter. Da vet alle hva
  som forventes.
- **Mørke sider er pauser.** De fyller hele scenen med vinrødt og brukes til
  humor og til åpning og slutt.
- **Belønning etter innsats.** Memen kommer når stegene er gjort.
- **Rolig bevegelse.** Små overganger, konfetti bare ved applaus og når alle er
  ferdige, og ingenting når brukeren har bedt om redusert bevegelse.

## Farger

Paletten er hentet fra ki.norge.no: vinrødt og crimson, fersken og korall på
varm papirbakgrunn. Alle farger er tokens i `:root`, med egne verdier for mørk
modus.

| Token | Lys | Mørk | Brukes til |
|---|---|---|---|
| `--paper` | `#F8F3EE` | `#1B1416` | Bakgrunn |
| `--surface` | `#FFFDFB` | `#261B1E` | Kort og paneler |
| `--ink` | `#292C30` | `#F1E8E9` | Brødtekst |
| `--muted` | `#5B5D60` | `#BBAAAD` | Hjelpetekst |
| `--heading` | `#541321` | `#FAD9CF` | Overskrifter |
| `--accent` | `#B42946` | `#EE8A9C` | Knapper, fokus, markering |
| `--bubble` | `#FCDCC6` | `#3D2A21` | Snakkebobler |
| `--coral` | `#F5898D` | `#F5898D` | Hender, oppgave i promptfargene |
| `--blush` | `#F6E4E8` | `#3A2328` | Rolige flater |
| `--ok` | `#056D13` | `#8FD49A` | Riktig svar, ferdig |
| `--dark-bg` | `#541321` | `#3F0E19` | Mørke sider |

Fasiten og ferdig-merkene bruker grønt. Feil svar dempes med farge og stiplet
kant, ikke med gjennomsiktighet. Gjennomsiktighet ga for lav kontrast.

## Skrift

- **PT Serif** til overskrifter, som på ki.norge.no.
- **Instrument Sans** til resten.
- Begge fra Google Fonts, med systemskrift som reserve.
- Titler skalerer med skjermen. På skjermen i rommet skalerer de også med
  høyden, så stegene får plass.

## Komponenter

- **Modus-pille:** Se (rosa), Gjør (crimson), Del (fersken).
- **Snakkeboble med Kopier:** fersken boble, rund kant med ett spisst hjørne.
- **Stegkort:** bare det aktive er åpent. Ferdige steg er stiplet med ✓.
  Presentøren og skjermen ser en måler for hvor mange som er ferdige.
- **Avstemning:** knapper med en fylt stolpe bak, og tallet til høyre.
- **Vegg:** innlegg som kort, nyeste øverst.
- **Chips i toppen:** hvem som er her, spørsmål, nedtelling og fullskjerm. ✋
  blir korallfarget når noen rekker opp hånda.
- **Paneler:** hvem som er her og spørsmål, oppe til høyre.
- **Oversikten:** alle sider som kort, mørke kort for mørke sider, med modus,
  minutter og tall fra rommet.
- **Spotlight:** ett innlegg eller spørsmål stort på alle skjermer.
- **Juksearket:** kan skrives ut eller lagres som PDF.

## Skjermen i rommet

- Stor tekst, ingen knapper.
- På skjermer fra 1200 piksler står det sosiale i en egen kolonne: veggen,
  stilprompten, memen, og illustrasjoner som hører til et steg.
- Når en illustrasjon er selve svaret, får den hovedplassen, og avstemningen
  står ved siden av.
- Bare steget flertallet står på, er åpent.
- Simulatoren vises ikke der. Den er for egne hender.
- Lenken for å bli med står i toppen, så de som kommer sent finner fram.

## Illustrasjoner

Illustrasjonene er tegnet i HTML og CSS, ikke lagt inn som bilder. Da følger de
fargene og mørk modus, skalerer til mobil, kan leses av skjermlesere og har
ingen spørsmål om rettigheter.

Slik lager du en ny:

1. Velg ett poeng som mange har vondt for å forstå.
2. Finn et bilde folk kjenner fra før. For språkmodeller er det forslagene
   over tastaturet på mobilen.
3. Bruk et konkret eksempel fra kurset, ikke et generelt.
4. Del det i høyst tre ruter, med en kort tekst under hver.
5. Vis det etter at folk har gjettet eller prøvd, ikke før.

## Memer

- Laget med memegen.link, lagret som komprimert JPEG i `memer/`.
- Norsk tekst, kjente maler, og tørr humor som hører til poenget.
- Alt-tekst som beskriver både bildet og teksten.

## Tilgjengelighet

- Kontrast etter WCAG 2.2 AA, sjekket med axe i alle visninger.
- Synlig fokus på alt som kan trykkes.
- Knapper med tydelige navn for skjermleser, også de med bare symboler.
- Dialoger gjør resten av siden inaktiv, og Esc lukker.
