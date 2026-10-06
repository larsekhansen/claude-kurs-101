# Handoff: kontekst fra planleggingen

Skrevet 23. september 2026, oppsummert fra planleggingssamtalen i claude.ai.
Alt under er beslutninger som er tatt. Ikke gjenåpne dem uten grunn.

## Situasjonen

- Lars Hansen, KI Norge (Digdir, AI Lab), holder «Introduksjon til Claude»
  for kolleger. Invitasjonen er sendt av Alex: «For alle som har fått nye
  lisenser eller bare er interessert.» Teams-møte. 45 minutter.
- Publikum er blandet: teknologer og ikke, nybegynnere og ikke. Kurset er
  primært for ikke-teknologene. Teknologene vet hvordan det virker.
- Alle demoer bruker offentlig materiale, så ingenting sensitivt limes inn.
- Deltakerne skal kunne bli med på egne maskiner uten å logge inn, siden ikke
  alle har samme e-post eller vil logge inn. Derfor GitHub Pages, ikke
  claude.ai-artefakt.

## Pedagogiske grep, og hvorfor

- Felles kjerne for alle, oppgaver i to nivåer. Si det høyt i starten:
  «Første halvdel er for alle, de siste minuttene er for de tekniske.»
- Vis, ikke forklar. Nytt på nytt-innslaget om Digdir (sesongpremieren
  fredag 18. september 2026, program 750) åpner kurset og viser de tre
  setningene i praksis: den vet ikke hva som skjedde på fredag, satire er
  komprimert kritikk, eksempler slår instruksjoner. Selve innslaget ble ikke
  funnet på nett, Lars har klippet.
- Hoveddemoen er DDoS-saken mot fellesløsningene, med to kilder i samme
  samtale, fordi det viser sammenligning og ikke bare oppsummering.
- Kjørereglene vises gjennom tre demoer: personnummer (den stopper deg ikke,
  grensen er deg), bestevenn (den har ikke meninger, den har instruksjoner,
  og dokumenter utenfra er også instruksjoner), hallusinasjon live (spør om
  noe der du kjenner fasit og rommet kan sjekke, begge utfall er læring).
- Oppgaver etter KI Norges roller, ikke etter navn, så ingen blir pekt på.
  Rollene følger det offentlige mandatet: pådriver, veileder, regulatorisk
  sandkasse med Nkom og Datatilsynet, bindeledd, kunnskapsgrunnlag.
- Ta skjermbilder under testing. Oppfører modellen seg pent live, vis bildet.

## Hva som er bygget

1. Et slidedeck i claude.ai (Slides-artefakt), 14 slides, samme innhold.
   Kan lastes ned som PowerPoint eller PDF derfra. Ikke relevant for repoet.
2. `index.html` i dette repoet: den interaktive versjonen. Publisert først som
   claude.ai-artefakt med presentør-synk via artefakt-runtime (`db`, `room`,
   `user`). Den varianten krever innlogging i Digdirs Claude, og det er
   grunnen til flyttingen hit.

## Etter planleggingen

- Synk-laget er byttet til en Cloudflare Worker med Durable Object på Lars
  sin private gratiskonto, ikke Supabase. Da kunne alt settes opp uten nye
  kontoer, og navn kan sjekkes mot hverandre på ett sted.
- Deltakerne logger ikke inn. De skriver et navn, og navnet må være ledig.
- Designet bruker paletten og skriftene fra ki.norge.no.
- «Til Claude»-knappen er fjernet. Den virker bare inne i claude.ai.

Oppsett og deploy står i `docs/oppsett.md`.

## Preferanser for kommunikasjon med Lars

- Direkte og teknisk. Ingen smiger, ingen overforklaring.
- Norsk bokmål. Ingen tankestreker.
- Kort. Si hva som er gjort og hva som gjenstår.

## Versjon 2, oktober 2026

- Kurset er fredag 9. oktober 2026, 11:00 til 11:45, i et møterom for åtte og
  på Teams samtidig.
- Innspill fra en erfaren, ikke-teknisk bruker: den første prompten er
  hoppkanten, den kan mer enn du tror (spør den om den kan), den er en god
  sparringspartner, og Projects er som mapper.
- En deltaker fra design ønsker eksempler på prototyper og universell
  utforming. Derfor eget fagfelt for design og universell utforming.
- Beslutningene står i `beslutningslogg.md`.

