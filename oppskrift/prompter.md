# Prompter du kan kopiere

Bytt ut teksten i [klammer]. Promptene virker i claude.ai og i Claude Code.

## 1. Lag et kurs i claude.ai, uten GitHub

Den enkleste veien. Claude lager kurssiden som et artefakt, og du kan vise den
fra din egen PC eller dele den med en lenke hvis lisensen deres tillater det.

```text
Du skal hjelpe meg å lage et interaktivt kurs som en nettside, i samme stil
som «Introduksjon til Claude» fra KI Norge. Oppskriften står på
larsekhansen.github.io/claude-kurs-101/oppskrift.

Om kurset:
- Tema: [tema]
- Hvem som kommer: [antall, fagfelt og hvor mye de kan fra før]
- Lengde og format: [45 minutter, møterom og Teams]
- Etter kurset skal de kunne: [to eller tre ting]
- En sak eller eksempler alle kjenner: [stikkord]

Gjør det i denne rekkefølgen, og vent på svar fra meg mellom hvert steg:
1. Still meg de spørsmålene du trenger, høyst fem.
2. Foreslå en kjøreplan. Én ting per side, og hver side er Se, Gjør eller Del,
   med minutter. Planlegg rundt 35 av 45 minutter. Start med noe alle gjør,
   og avslutt med at deltakerne skriver hva de skal prøve i morgen.
3. Skriv innholdet. Korte titler, høyst to prompter eller oppgaver per side,
   og notater til meg med replikker. Tørr humor som hører til poenget. Ikke
   moraliser.
4. Lag kurssiden som ett HTML-artefakt: én side om gangen med piltaster,
   kopier-knapp på prompter, avstemninger og en vegg der man ser de andres
   svar når man har delt sitt eget. Lys og mørk modus, mobil og god kontrast.

Sjekk alle fakta mot kilder, og si fra hvis du er usikker.
```

Felles live-funksjoner, som at alle følger presentøren, krever en tjeneste som
holder rommet. Uten den virker siden for én og én, og hver deltaker blar selv.

## 2. Lag et nytt kurs fra denne malen, med Claude Code

```text
Lag et nytt kurs om [tema] med repoet github.com/larsekhansen/claude-kurs-101
som mal. Les oppskrift/for-agenten.md først og følg arbeidsgangen der, med
portene. Kurset er for [publikum], varer [lengde] og holdes [format].
Deltakerne skal kunne [mål] etterpå. Spør meg om det du trenger i én runde,
og lever planen før du bygger.
```

## 3. Research på temaet

```text
Jeg skal holde et kurs om [tema] for [publikum]. Finn de viktigste tingene de
bør kunne, de vanligste misforståelsene, og en sak eller et eksempel alle i
målgruppen kjenner. Oppgi kilde for hver påstand, og si hvor sikker du er.
```

## 4. Kritiser planen

```text
Her er kjøreplanen for et kurs på [lengde]. Vær streng. Er det en krok i
første minutt? Én ting per side? Gjør folk mer enn de ser? Er eksemplene fra
deres hverdag? Er det pauser med humor som hører til poenget? Er slutten en
topp? Holder tiden med rundt ti minutter buffer? Foreslå konkrete endringer.

[lim inn kjøreplanen]
```

## 5. Test en prompt slik deltakerne vil bruke den

```text
Kjør denne prompten slik en deltaker ville gjort, og vurder svaret: Er det
nyttig for [fagfelt]? Hvor lang tid tok det? Får vi den kontrasten vi vil vise
mot den korte versjonen? Hva kan gå galt i kurset?

Kort versjon: [prompt]
Lang versjon: [prompt]
```

## 6. Faktasjekk

```text
Sjekk hver faktapåstand i teksten under mot primærkilden. For lover: rå tekst
hos Lovdata. For tall: den som eier tallet. Lag en tabell med påstand, kilde,
og om den stemmer. Gjett ikke. Skriv «fant ikke» der du ikke finner noe.

[lim inn teksten]
```

## 7. Lag en illustrasjon

```text
Lag en illustrasjon i HTML og CSS som forklarer [poeng] for folk som ikke er
tekniske. Bruk et bilde de kjenner fra hverdagen, et konkret eksempel fra
kurset, høyst tre ruter, og en kort tekst under hver. Den skal virke i lys og
mørk modus, på mobil og med skjermleser.
```
