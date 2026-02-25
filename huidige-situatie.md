# Huidige situatie

## Technische inrichting

De gegevensuitwisseling tussen bronhouders en de [LV-WOZ](#def-lv-woz) is gebaseerd op twee
standaarden: [ebMS2](#def-ebms2) als transportprotocol en [StUF](#def-stuf) als berichtenstandaard.
Deze combinatie is onderdeel van het Digikoppeling-stelsel en is ontworpen om betrouwbare,
beveiligde en onweerlegbare gegevensuitwisseling mogelijk te maken.

Beide standaarden staan op de 'Pas toe of leg uit'-lijst van
[Forum Standaardisatie](https://www.forumstandaardisatie.nl/). Dit betekent dat
overheidsorganisaties verplicht zijn deze standaarden te gebruiken tenzij zij kunnen uitleggen
waarom een alternatief beter past. StUF staat sinds 2008 op deze lijst en wordt beheerd door VNG
Realisatie [[FORUM-STUF]]. Digikoppeling, waarvan de koppelvlakstandaard ebMS2 een onderdeel is,
heeft eveneens de status 'Pas toe of leg uit' en wordt beheerd door Logius.

### ebMS2 als transportprotocol

Het ebMS2-protocol biedt functionaliteit die standaard HTTP en eenvoudige SOAP-webservices niet
bieden:

- **Exactly-once delivery**: Via acknowledgements, retries en duplicaat-eliminatie wordt
  gegarandeerd dat berichten precies één keer worden verwerkt (_once-and-once-only_).
- **Beveiliging op berichtniveau**: Ondersteuning voor ondertekening en versleuteling van berichten.
- **Asynchrone communicatie**: Het Digikoppeling ebMS2 profiel hanteert asynchrone communicatie als
  default, waarbij verzenden en ontvangen van acknowledgements in gescheiden sessies gebeurt. De
  motivatie is schaalbaarheid: asynchrone verwerking ondersteunt scenario's waarin systemen niet
  24x7 beschikbaar zijn en berichten op eigen tempo kunnen verwerken [[DK-EBMS2]]. Sinds versie 3.3
  van het profiel is de SyncReply-optie toegestaan als uitzondering voor hoog-volume scenario's
  waarin de overhead van asynchrone acknowledgements problematisch wordt. Bij SyncReply wordt de
  acknowledgement in dezelfde HTTP-sessie teruggegeven, maar de business response blijft asynchroon.

De implementatie van deze functionaliteit vereist een Message Service Handler (MSH) die de
protocollogica afhandelt. De MSH moet stateful zijn: er wordt een administratie bijgehouden van
verzonden berichten die wachten op acknowledgement en van ontvangen berichten waarvoor
duplicaat-eliminatie moet worden toegepast.

#### Collaboration Protocol Agreements

De ebMS-communicatie tussen twee partijen wordt geregeld via een Collaboration Protocol Agreement
(CPA). Een CPA specificeert:

- De identiteit van beide partijen (via hun OIN)
- De berichttypen die uitgewisseld mogen worden
- De beveiligingsprofielen die van toepassing zijn
- De endpoints waar berichten naartoe gestuurd moeten worden
- De parameters voor retry-gedrag en time-outs

CPA's zijn gekoppeld aan de geldigheid van PKIoverheid-certificaten. Wanneer een certificaat wordt
vernieuwd, moeten alle CPA's waarin dat certificaat wordt gebruikt opnieuw worden gegenereerd en aan
beide kanten worden ingeladen.

### StUF als berichtenstandaard

StUF-WOZ is de sectorspecifieke invulling van de StUF-standaard voor WOZ-gegevens. De standaard
definieert een gedetailleerd objectmodel voor WOZ-objecten, belanghebbenden, waarden en hun
onderlinge relaties. StUF ondersteunt:

- **Mutatieberichten**: Voor het doorgeven van wijzigingen aan registraties
- **Correctieberichten**: Voor het corrigeren van eerder geregistreerde gegevens
- **Bitemporele historie**: De combinatie van materiële historie (wanneer iets in de werkelijkheid
  geldig was) en formele historie (wanneer iets in de registratie is vastgelegd)

De aanlevering aan de LV-WOZ verloopt via [dienstberichten](#def-dienstbericht): StUF-berichten die
fungeren als container voor één of meer kennisgevingen. Er zijn 21 dienstberichten gedefinieerd, elk
gekoppeld aan een WOZ-gebeurtenis uit de Catalogus WOZ-gegevens (zoals "WOZ-object ontstaan",
"Waarde vastgesteld" of "Bezwaar afgehandeld"). Het dienstbericht vervult twee functies: het
definieert de transactiescope (welke kennisgevingen atomair verwerkt moeten worden) en het geeft de
aanleiding voor de datamutaties mee. Het dienstbericht is de eenheid die de LV-WOZ accepteert; losse
kennisgevingsberichten worden niet aangeboden.

### Schaal en seizoenspatroon

De WOZ-keten kent een sterk seizoensgebonden karakter. Na 1 januari ontvangen circa 10 miljoen
huishoudens en rechtspersonen een WOZ-beschikking. Van elk van deze beschikkingen wordt een digitaal
afschrift aangeleverd aan de LV-WOZ, zodat afnemers zoals de Belastingdienst, waterschappen en het
CBS deze gegevens kunnen gebruiken. De wettelijke termijn voor aanlevering is 8 weken na 1 januari.

Dit betekent dat in januari en februari het berichtenvolume een veelvoud is van de rest van het
jaar. De huidige architectuur wordt in deze piekperiode dan ook zwaar belast. De keuze voor
asynchrone verwerking is mede ingegeven door deze volumepieken: synchrone verwerking zou vereisen
dat zowel de LV-WOZ als alle bronhouders de piekbelasting real-time kunnen verwerken.

### De rol van intermediairs

De complexiteit van ebMS2 en StUF leidt ertoe dat een substantieel deel van de bronhouders de
implementatie uitbesteedt aan intermediairs. De LV-WOZ onderhoudt momenteel circa 340
ebMS-verbindingen met gemeenten en samenwerkingsverbanden. In veel gevallen communiceert de
bronhouder via een eenvoudiger koppelvlak (doorgaans een REST-API) met de intermediair, die
vervolgens de vertaling naar ebMS/StUF verzorgt.

De Digikoppeling-architectuur onderscheidt twee typen intermediairs:

- **Transparante intermediairs**: Routeren berichten zonder ze te bewerken. Het bericht blijft
  intact en de communicatie loopt end-to-end tussen de oorspronkelijke verzender en ontvanger.
- **Niet-transparante intermediairs**: Bewerken berichten en zijn daarmee een eindpunt in de
  Digikoppeling-keten. Dit is het gangbare model bij uitbesteding.

Een bijzondere variant is het belastingsamenwerkingsverband: een organisatie die namens meerdere
gemeenten de WOZ-taken uitvoert. In deze constructie kan de gemeente zelf geen directe inzage hebben
in wat er wordt aangeleverd aan de LV-WOZ, wat de verantwoordingsrelatie compliceert.

## Verdiensten van de huidige inrichting

Voordat de knelpunten worden besproken, is het relevant om vast te stellen dat de huidige inrichting
gedurende vele jaren heeft gefunctioneerd en bepaalde doelen heeft bereikt.

### Betrouwbare basisfunctionaliteit

De LV-WOZ verwerkt jaarlijks miljoenen berichten van honderden bronhouders. De combinatie van ebMS2
en StUF heeft een niveau van betrouwbaarheid geboden dat de basisfunctionaliteit waarborgt. Afnemers
zoals de Belastingdienst, waterschappen en het CBS kunnen de WOZ-gegevens gebruiken voor hun
wettelijke taken. De Waarderingskamer constateert in de Staat van de WOZ 2025 [[STAAT-WOZ-2025]] dat
de verwerking van berichten in de LV-WOZ in het algemeen met minder fouten verliep dan voorheen, wat
wijst op een volwassen wordende keten.

### Gestandaardiseerde semantiek

StUF-WOZ biedt een gedetailleerd en gestandaardiseerd objectmodel voor WOZ-gegevens. Dit model
definieert eenduidig hoe WOZ-objecten, belanghebbenden, waarden en hun onderlinge relaties worden
gerepresenteerd. Deze semantische standaardisatie heeft bijgedragen aan interoperabiliteit binnen de
keten, ook al is de implementatie complex.

### Bitemporele historie

De ondersteuning voor bitemporele historie in StUF is functioneel waardevol voor een registratie als
de WOZ, waarin zowel de materiële werkelijkheid als de registratiegeschiedenis relevant zijn voor
bezwaar, beroep en verantwoording.

### Bewezen governance

Het stelsel van Digikoppeling, CPA-beheer en conformiteitstoetsen heeft een governance-structuur
gecreëerd die partijen dwingt tot interoperabiliteit. Ondanks de complexiteit biedt deze structuur
zekerheid over de technische compatibiliteit tussen aangesloten partijen.

De vraag die voorligt is niet of de huidige inrichting volledig faalt, maar of de balans tussen
baten en lasten nog houdbaar is gegeven de ontwikkelingen in de markt, de beschikbaarheid van
alternatieven, en de eisen die de moderne digitale overheid stelt aan wendbaarheid en
toegankelijkheid.

## Status van de standaarden

De technische standaarden waarop de huidige keten is gebaseerd, bevinden zich in verschillende fasen
van hun levenscyclus:

- **ebMS2** wordt niet langer doorontwikkeld. Logius bereidt een transitie voor naar
  [ebMS3/AS4](#def-ebms3) [[DK-ROADMAP]]. De analyse van dit moderniseringspad en wat het in
  potentie wel en niet oplost voor de WOZ-keten wordt behandeld in het hoofdstuk
  [Het ebMS3/AS4-perspectief](#het-ebms3as4-perspectief).

- **StUF** is eveneens in onderhoudsmodus; VNG Realisatie heeft de doorontwikkeling stopgezet. Forum
  Standaardisatie heeft in evaluaties vastgesteld dat de huidige scope niet langer passend is
  [[FORUM-STUF-EVAL]]. De knelpunten die voortvloeien uit StUF worden geanalyseerd in het hoofdstuk
  [Knelpunten](#knelpunten).

De dubbele transitie, van ebMS2 naar ebMS3/AS4 én van StUF naar API's, speelt niet alleen bij de WOZ
maar bij elke registratie die op deze standaarden is gebaseerd. Het is een gelegenheid om aan te
sluiten bij de modernisering van de gehele overheidsbrede gegevensinfrastructuur.
