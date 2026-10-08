# Slik ble kurset laget

Kurset ble laget av én person sammen med Claude, over noen dager i september
og oktober 2026. Planleggingen skjedde i claude.ai, resten i Claude Code mot
dette repoet. Her er rekkefølgen, hva som utløste hvert steg, og hva vi lærte.
Beslutningene står i [`../docs/rapporter/beslutningslogg.md`](../docs/rapporter/beslutningslogg.md).

## 1. Planlegging i claude.ai

Innholdet og en første kursside ble laget i en samtale i claude.ai, som et
artefakt. Synkroniseringen mellom presentør og deltakere virket bare inne i
claude.ai. Oppdraget videre var å få siden til å virke fra GitHub Pages, uten
innlogging.

**Lærdom:** Et artefakt i claude.ai er en rask måte å lage og teste innholdet
på, også for den som ikke er teknisk.

## 2. Live-laget

En Cloudflare Worker med én Durable Object erstattet synkroniseringen. Den
ligger på en privat gratiskonto, ikke på en jobbkonto. Deltakerne skriver bare
et navn, som må være ledig. Designet hentet farger og skrift fra ki.norge.no.

**Lærdom:** Én liten tjeneste holder for et kurs. Velg en løsning du kan sette
opp alene, og bruk riktig konto.

## 3. For tett

Første versjon hadde opptil seks prompter per side, en quiz og en abstrakt side
om «tre setninger». Tilbakemeldingen var at det ikke var bra nok: én eller to
prompter per side, mer luft, tørr humor med memer, og ikke moraliserende.

Kurset ble bygget om rundt ett grep per side, med modusene Se, Gjør og Del.
Oppgavene ble steg, deltakerne fikk velge fagfelt, og en anonym vegg viste
svarene.

**Lærdom:** Flere prompter er ikke bedre. Én ting per side.

## 4. Research

Research på presentasjonsteknikk ga 30 funn med kilder og styrke, se
rapporten i `docs/rapporter/`. Et e-læringskurs fra DFØ om generativ KI ble
lest, og tre grep ble tatt med: et eksempel på det du vil ha, skilletegn rundt
innlimt tekst, og et KI-minutt på avdelingsmøtene. Resten var overflødig for
dette kurset.

**Lærdom:** Destiller. Ta med det som er veldig bra, ikke alt som er riktig.

## 5. Gjennomkjøring

Alle prompter ble kjørt med Claude, og tiden ble målt: 10 til 76 sekunder per
prompt. Tidsplanen gikk over 45 minutter og ble kortet til rundt 35. Et
eksempel med en årsrapport feilet, fordi PDF-en var for stor til å hentes, og
ble byttet ut med en tabell over en sak alle kjente.

**Lærdom:** Kjør hver prompt selv, i samme verktøy som deltakerne har.

## 6. Planen for verdensklasse

Bestillingen var et kurs i verdensklasse, håndfast, stilig og gøy, med humor
også i pausene. Planen gikk gjennom tre runder med kritikk før byggingen. Det
som kom inn: en krok mens folk kommer («Ekte eller Claude?»), en pause der salen
velger stil og presentøren kjører den live, et kapittelkart, en finale med
tall og applaus, og et jukseark.

**Lærdom:** Kritiser planen før du bygger. Det er billigere enn å bygge om.

## 7. Faktasjekk

Fasiten i «Ekte eller Claude?» ble sjekket mot rå tekst hos Lovdata. Claude
hadde skrevet «Det skal være ytringsfrihet» som den ekte setningen i
Grunnloven § 100. Den står ikke der. Det står «Ytringsfrihet bør finne sted.»
Historien ble replikken etter avsløringen.

**Lærdom:** Sjekk alle fakta i primærkilden. Også, og særlig, i et kurs om KI.

## 8. Gjennomgang side for side

Hele kurset ble gått gjennom i alle visninger, med skjermbilder. Funnene:
gjetningen var røpet av tittelen og kapittelnavnet, skjermen i rommet brukte
halve bredden, og memen havnet under kanten. axe fant to kontrastfeil. Alt ble
rettet.

**Lærdom:** Se på det ferdige produktet slik publikum ser det.

## 9. Øving med ekte folk

Under øving kom ønskene som bare bruk avdekker: se hvem som er her, ta alle
med tilbake, og håndsopprekning som synes. Dagen før kurset kom spørsmål fra
salen med stemmer, nedtelling, en medhjelper som ikke flytter rommet, og at en
ny innlasting holder deg der du var. En test mot produksjon forstyrret folk som
var koblet til. Siden kobler nå aldri til produksjon fra en lokal maskin.

**Lærdom:** Øv tidlig. Test aldri mot et rom der ekte folk sitter.

## 10. Oversikt og illustrasjoner

En oversikt over sidene som i PowerPoint, der presentøren kan skru sider av
og på. Illustrasjoner som forklarer svarene visuelt: forslagene på mobilen for
neste ord, fargekodede prompter for hoppkanten, og en mappe for Projects.

**Lærdom:** Et bilde av noe folk kjenner fra før, forklarer raskere enn tekst.

## Testene

- Protokolltester mot tjenesten, for alle meldingene: rundt 75 sjekker.
- Ende-til-ende i nettleseren med presentør, to deltakere, skjerm og
  medhjelper: 83 sjekker.
- axe på alle sider i fem visninger, lyst og mørkt, med paneler og oversikten
  åpne.
- Skriptene ligger ikke i repoet, fordi kurssiden skal være én fil uten npm.
  De er beskrevet i `for-agenten.md`.
