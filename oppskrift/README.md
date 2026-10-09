# Oppskriften

Slik lager du et interaktivt kurs som «Introduksjon til Claude», om et annet
tema. Mappa er skrevet for to lesere: folk som vil lage sitt eget kurs, og
KI-agenter som skal gjøre jobben.

**Les den som nettside:** https://larsekhansen.github.io/claude-kurs-101/oppskrift/
Den er åpen for alle med lenken, uten GitHub-konto.

## Tre veier

1. **Bare nettleseren.** Lim inn prompten fra [`prompter.md`](prompter.md) i
   claude.ai. Claude lager kurssiden som et artefakt.
2. **Claude Code og denne malen.** Be agenten lage et nytt kurs med dette
   repoet som mal, og gi den [`for-agenten.md`](for-agenten.md).
3. **Få hjelp.** Skriv innholdet med prompten, og få noen til å legge det inn
   i malen. Innholdet står samlet i `SLIDES` øverst i `index.html`.

## Filene

| Fil | Hva den er |
|---|---|
| [`index.html`](index.html) | Nettsiden for folk flest |
| [`for-agenten.md`](for-agenten.md) | Arbeidsgangen for en agent, med porter og alt som må tilpasses |
| [`spesifikasjon.md`](spesifikasjon.md) | Roller, funksjoner, feltene på en side, personvern og tilgjengelighet |
| [`design.md`](design.md) | Farger, skrift, komponenter, skjermen i rommet, illustrasjoner og memer |
| [`presentasjonsteknikk.md`](presentasjonsteknikk.md) | Kravene til et godt kurs og grepene med begrunnelse |
| [`prosessen.md`](prosessen.md) | Slik ble kurset laget, steg for steg, med lærdommer |
| [`prompter.md`](prompter.md) | Prompter du kan kopiere |
| [`prosjektinstruksjoner.md`](prosjektinstruksjoner.md) | Instruksjoner til ditt eget prosjekt i Claude, så den jobber mer effektivt |
| [`sjekklister.md`](sjekklister.md) | Før, under og etter |

Drift og protokoll står i [`../docs/oppsett.md`](../docs/oppsett.md), innholdet
i [`../docs/kurs.md`](../docs/kurs.md), og beslutningene i
[`../docs/rapporter/beslutningslogg.md`](../docs/rapporter/beslutningslogg.md).
