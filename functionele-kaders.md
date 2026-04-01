# Functionele kaders

Dit hoofdstuk beschrijft de functionele eisen die de WOZ-keten stelt aan elke oplossingsrichting,
onafhankelijk van de gekozen technologie of standaarden. De eisen zijn afgeleid uit de Wet WOZ
[[WET-WOZ]], de Catalogus Basisregistratie WOZ [[CATALOGUS-WOZ]] en de behoeften van afnemers zoals
die naar voren komen uit de analyse in dit document.

De huidige inrichting op basis van StUF en ebMS2 is ontworpen om aan deze eisen te voldoen. Het doel
van dit hoofdstuk is om een toetsingskader te bieden waartegen zowel de huidige inrichting als
alternatieven kunnen worden beoordeeld. De eisen in dit hoofdstuk betreffen het _wat_; de keuze
_hoe_ deze eisen worden ingevuld zijn architectuurkeuzes die aan bod komen in de
oplossingsrichtingen.

## Aanlevering en registratie

De Wet WOZ (art. 37a-37b) beschrijft twee voorzieningen: de Basisregistratie WOZ bij de gemeente en
de Landelijke Voorziening WOZ bij het Kadaster. Het college van B&W levert waardegegevens met
bijbehorende temporele en meta-kenmerken aan het Kadaster ten behoeve van opname in de LV-WOZ (art.
37b). De LV-WOZ heeft als doel deze gegevens te verstrekken aan afnemers (art. 37aa). De
specificaties voor de aanlevering worden vastgesteld door de Waarderingskamer (Uitvoeringsbesluit
art. 9).

De wet beschrijft een aanleverplicht (art. 37b). De Waarderingskamer hanteert als uitgangspunt voor
het gegevensbeheer dat de gegevens in de LV-WOZ steeds een volledige kopie ("conforme kopie") moeten
zijn van de gegevens in de eigen administratie [[CATALOGUS-WOZ]]. Dit conforme-kopie-principe is
leidend geweest bij het ontwerp van het huidige koppelvlak en wordt in dit document als geldend
uitgangspunt gehanteerd.

De aanleverplicht en het conforme-kopie-principe stellen gezamenlijk eisen aan het koppelvlak:

- De bronhouder moet in staat zijn alle relevante gegevens aan te leveren, inclusief correcties en
  wijzigingen met terugwerkende kracht.
- Wanneer de LV-WOZ en de Basisregistratie WOZ uiteenlopen, moet er een mechanisme zijn om beide
  weer in overeenstemming te brengen.

## Bitemporele historie

De WOZ-keten vereist bitemporele historie: de combinatie van materiële historie (wanneer iets in de
werkelijkheid geldig was) en formele historie (wanneer iets in de registratie is vastgelegd). Beide
dimensies zijn nodig voor bezwaar, beroep en verantwoording.

- **Materiële historie**: Afnemers moeten kunnen vaststellen welke WOZ-waarde gold op een bepaalde
  peildatum. Dit is essentieel voor belastingheffing, waar de waarde op de waardepeildatum bepalend
  is.
- **Formele historie**: De keten moet vastleggen wanneer gegevens zijn geregistreerd en wanneer zij
  beschikbaar kwamen voor afnemers. Het onderscheid tussen de formele historie van de bronhouder
  (wanneer de gemeente iets registreerde) en de formele historie van de LV (wanneer het voor
  afnemers beschikbaar werd) is hierbij relevant.

## Herhaalbaarheid en beschouwingsmoment

Bij bezwaar of beroep moet reconstrueerbaar zijn welke gegevens op het moment van een besluit
beschikbaar waren. Dit vereist herhaalbaarheid: dezelfde vraag met dezelfde parameters moet
hetzelfde antwoord opleveren, ongeacht wanneer de vraag wordt gesteld.

Om herhaalbaarheid mogelijk te maken, moet de LV-WOZ bij bevraging een beschouwingsmoment kunnen
communiceren: het tijdstip waarop het antwoord betrekking heeft. Een afnemer die later dezelfde
vraag stelt met hetzelfde beschouwingsmoment, ontvangt hetzelfde antwoord.

## Gebeurtenisgedreven karakter

De WOZ-keten is georganiseerd rondom gebeurtenissen: nieuwe beschikking, uitspraak op bezwaar,
wijziging of beëindiging van een WOZ-object, en dergelijke. Deze gebeurtenissen vervullen twee
functies:

- **Transactiebegrenzing**: een gebeurtenis definieert welke gegevensmutaties in samenhang moeten
  worden verwerkt.
- **Aanleiding voor afnemers**: het type gebeurtenis bepaalt welke vervolgactie een afnemer moet
  nemen. Een nieuwe beschikking vereist een andere reactie dan een uitspraak op bezwaar.

Het koppelvlak moet het type gebeurtenis dat de aanleiding vormt voor een gegevensmutatie kunnen
communiceren. Afnemers en de LV-WOZ gebruiken deze informatie voor respectievelijk procesbepaling en
validatie.

## Correctiesemantiek

Gemeenten maken fouten in hun registratie en moeten deze kunnen corrigeren. Het koppelvlak moet
onderscheid kunnen maken tussen:

- **Wijzigingen**: er is iets in de werkelijkheid veranderd (bijvoorbeeld een nieuwe eigenaar)
- **Correcties**: de registratie was fout; de werkelijkheid is niet veranderd (bijvoorbeeld een
  verkeerd geregistreerde oppervlakte)

Dit onderscheid is relevant voor afnemers. Een wijziging kan leiden tot een nieuwe aanslag; een
correctie kan leiden tot herziening van een eerder opgelegde aanslag. Afnemers moeten uit de
aangeleverde gegevens kunnen afleiden of het om een wijziging of een correctie gaat, zodat zij de
juiste vervolgactie kunnen bepalen.

## Consistentievalidatie

WOZ-gegevens leiden bij afnemers tot financiële besluiten (belastingaanslagen, waterschapslasten).
Fouten in aangeleverde gegevens kunnen leiden tot het moeten terugdraaien van besluiten. Dit stelt
eisen aan de consistentie van doorgeleverde gegevens.

- Gegevens die de LV-WOZ doorlevert aan afnemers moeten intern consistent zijn.
- Het koppelvlak moet validatie mogelijk maken die waarborgt dat aangeleverde gegevens passen bij de
  eerder aangeleverde toestand en bij de gemelde gebeurtenis.
- Wanneer mutaties onderling afhankelijk zijn, moet het koppelvlak de benodigde verwerkingsvolgorde
  kunnen uitdrukken (bijvoorbeeld: een subject moet bekend zijn voordat een relatie met dat subject
  kan worden gelegd).

## Betrouwbare aflevering

Berichten mogen niet verloren gaan in de keten. Wanneer een bronhouder gegevens aanlevert, moet
vaststaan dat deze de LV-WOZ bereiken. Omgekeerd moet de bronhouder zekerheid hebben over de
verwerkingsstatus: is het bericht aangekomen, en zo ja, is het succesvol verwerkt of afgewezen?

Dit vereist:

- Een mechanisme voor ontvangstbevestiging
- Een mechanisme voor terugkoppeling over de verwerkingsstatus (succes of fout, met reden)
- De mogelijkheid om berichten veilig opnieuw aan te bieden zonder dubbele verwerking (idempotentie)

## Verwerking bij piekbelasting

De WOZ-keten kent een sterk seizoenspatroon. Na 1 januari leveren bronhouders circa 10 miljoen
beschikkingen aan in 8 weken. Het koppelvlak moet dit volume aankunnen zonder dat de kwaliteit of
betrouwbaarheid van de verwerking afneemt.

Dit stelt eisen aan:

- **Doorvoercapaciteit**: de keten moet het piekvolume binnen de wettelijke termijn kunnen
  verwerken.
- **Capaciteitsbeheersing**: wanneer de verwerkingscapaciteit van de LV-WOZ het aanlevertempo niet
  kan bijhouden, moet er een mechanisme zijn dat voorkomt dat berichten verloren gaan of dat
  bronhouders worden geblokkeerd zonder terugkoppeling.

## Notificatie van afnemers

Afnemers moeten tijdig worden geinformeerd over wijzigingen in WOZ-gegevens, zodat zij hun processen
kunnen starten. De informatiebehoefte verschilt per afnemer:

- De Belastingdienst heeft behoefte aan zowel gebeurtenisinformatie als de mogelijkheid om gegevens
  in een gestandaardiseerd formaat op te halen.
- Waterschappen hebben behoefte aan specifieke gegevens (zoals het beschikkingsadres) die niet uit
  een standaardbevraging komen.
- Het CBS heeft behoefte aan statistische aggregaties.

Het koppelvlak moet het mogelijk maken dat afnemers de voor hen relevante gegevens ontvangen of
kunnen ophalen, zonder dat zij gegevens ontvangen die buiten hun informatiebehoefte vallen.
Doelbinding is hierbij een randvoorwaarde: het moet controleerbaar en logbaar zijn met welk doel een
afnemer gegevens ontvangt of verwerkt.

## Traceerbaarheid en verantwoording

De keten moet herleidbaar zijn: welke gebeurtenis leidde tot welke datamutatie, wanneer is deze
verwerkt, en aan wie is deze doorgeleverd? Dit is relevant voor:

- **Bezwaar en beroep**: wanneer een belanghebbende bezwaar maakt, moet reconstrueerbaar zijn op
  basis van welke gegevens een beschikking is opgelegd.
- **Ketenverantwoording**: bij fouten in de keten moet vast te stellen zijn waar het misging (bij de
  bronhouder, in het transport, bij de LV, of bij de afnemer).
- **AVG-verantwoording**: welke persoonsgegevens zijn wanneer aan wie verstrekt?

## Identificatie en verwijzing

WOZ-gegevens verwijzen naar objecten en subjecten uit andere basisregistraties (BAG, BRK, BRP,
Handelsregister). Het koppelvlak moet eenduidige, persistente identificatie ondersteunen, zodat
gegevens betrouwbaar kunnen worden gekoppeld. Dit geldt voor:

- **Objecten**: WOZ-objecten en hun relatie met BAG-objecten.
- **Subjecten**: natuurlijke personen, niet-natuurlijke personen en vestigingen, geidentificeerd met
  actuele identificatoren (BSN, RSIN, KvK-nummer).
- **Relaties**: de relatie tussen een subject en een WOZ-object (bijvoorbeeld een belang) moet
  eenduidig identificeerbaar zijn, ook wanneer relaties worden beëindigd of gecorrigeerd.

De keuze welke identificerende gegevens worden meegegeven (alleen verwijzingen, of ook redundante
gegevens zoals naam en adres) is een functioneel-inhoudelijke afweging die samenhangt met de
beschikbaarheid van de gekoppelde registraties en de behoeften van afnemers.

## Afbakening

De bovenstaande eisen betreffen het koppelvlak en de keten tussen bronhouder, LV-WOZ en afnemers. De
volgende zaken vallen buiten scope:

- De inrichting van gemeentelijke WOZ-systemen
- De interne architectuur van de LV-WOZ
- Functioneel-inhoudelijke keuzes binnen het informatiemodel, zoals welke attributen worden
  opgenomen en de granulariteit van tijdregistratie. Deze keuzes zijn relevant, maar betreffen het
  informatiemodel, niet de standaarden- en architectuurkeuze die in dit document centraal staat.
