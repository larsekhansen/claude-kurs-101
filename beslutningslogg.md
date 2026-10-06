# Beslutningslogg

Nyeste øverst. Ett punkt per beslutning, med hvorfor. Detaljene står i
`docs/kurs.md` og `docs/oppsett.md`.

## 2026-10-06

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
