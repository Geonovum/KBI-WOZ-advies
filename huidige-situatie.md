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
- **Vraag-/antwoordberichten**: Voor het formuleren en beantwoorden van bevragingen
- **Synchronisatieberichten**: Voor het synchroniseren van actuele en historische gegevens tussen
  applicaties
- **Bitemporele historie**: De combinatie van materiële historie (wanneer iets in de werkelijkheid
  geldig was) en formele historie (wanneer iets in de registratie is vastgelegd)

De aanlevering aan de LV-WOZ verloopt primair via dienstberichten: StUF-berichten die één op één
overeenkomen met de functioneel gedefinieerde gebeurtenissen en die exact afbakenen welke gegevens
relevant zijn voor het communiceren van een gebeurtenis. Daarmee fungeren deze dienstberichten als
container voor één of meer samenhangende kennisgevingen. Er zijn 25 dienstberichten gedefinieerd,
elk gekoppeld aan een WOZ-gebeurtenis uit de Catalogus WOZ-gegevens (zoals "Ontstaan WOZ-object",
"Nemen van een WOZ-beschikking" of "Doen van uitspraak bezwaar en beroep"). Het dienstbericht
vervult twee functies: het definieert de transactiescope (welke kennisgevingen atomair verwerkt
moeten worden) en het geeft de aanleiding voor de datamutaties mee. Het dienstbericht is de eenheid
die de LV-WOZ accepteert; losse kennisgevingsberichten worden niet aangeboden.

Naast de gebeurtenisgebaseerde dienstberichten verwerkt de LV-WOZ ook synchronisatieberichten
(inclusief historie). Synchronisatieberichten zijn noodzakelijk voor historische correcties die in
de WOZ-keten van grote juridische betekenis kunnen zijn.

### Schaal en seizoenspatroon

De WOZ-keten kent een sterk seizoensgebonden karakter. Na 1 januari ontvangen circa 10 miljoen
huishoudens en rechtspersonen een WOZ-beschikking. Van elk van deze beschikkingen wordt een digitaal
afschrift aangeleverd aan de LV-WOZ, zodat afnemers zoals de Belastingdienst, waterschappen en het
CBS deze gegevens kunnen gebruiken. De wettelijke termijn voor het nemen van de WOZ-beschikking is 8
weken na 1 januari.

Dit betekent dat in januari en februari het berichtenvolume een veelvoud is van de rest van het
jaar. De huidige architectuur wordt in deze piekperiode dan ook zwaar belast. De keuze voor
asynchrone verwerking is mede ingegeven door deze volumepieken: synchrone verwerking zou vereisen
dat zowel de LV-WOZ als alle bronhouders de piekbelasting real-time kunnen verwerken.

### De ketenarchitectuur

De applicaties voor het beheer van de WOZ-administratie bij de bronhouder zijn verantwoordelijk voor
het vormen van de StUF-berichten; dit is de enige plek waar de functionele context beschikbaar is om
betekenisvolle gebeurtenisberichten samen te stellen. In de praktijk is het WOZ-informatiecomponent
bij de LV zeer beperkt ten opzichte van wat er bij de gemeente leeft. Het taxatieproces is veel
omvangrijker; de basisregistratie is daarvan een marginaal onderdeel dat bestaat omdat het
vervolgens naar de afnemers moet. Er is doorgaans geen apart systeem waarvan een extract wordt
gemaakt voor de LV; de werkprocessystemen sturen gegevens naar de LV wanneer dat nodig is. Wat de
bronhouder aanlevert is een selectie uit een veel groter geheel, niet een extract uit een apart
ingericht basisregistratiesysteem.

Een substantieel deel van de bronhouders heeft het beheer van de Digikoppelingsadapter (MSH)
uitbesteed aan een externe partij. Deze uitbesteding kan een afzonderlijke uitbesteding zijn, maar
kan ook onderdeel zijn van de volledige outsourcing van de ICT-voorzieningen die de bronhouder
gebruikt voor het beheer van de WOZ-administratie en de communicatie met de LV-WOZ. De LV-WOZ
onderhoudt momenteel circa 340 ebMS-verbindingen met gemeenten en samenwerkingsverbanden.

Een bijzondere variant is het belastingsamenwerkingsverband: een organisatie die namens meerdere
gemeenten de WOZ-taken uitvoert. In deze constructie levert de samenwerking alle gegevens namens de
bronhouder aan. De gemeente zelf kan geen gegevens aanleveren, maar kan wel inzage hebben in welke
gegevens in de LV-WOZ zijn geregistreerd.

## Kenmerken van de huidige inrichting

De huidige inrichting is ontworpen om te voldoen aan de functionele eisen die in
[Functionele kaders](#functionele-kaders) worden beschreven. Hieronder worden de specifieke
kenmerken van de huidige implementatie benoemd.

### Betrouwbare basisfunctionaliteit

De LV-WOZ verwerkt jaarlijks miljoenen berichten van honderden bronhouders. De combinatie van ebMS2
en StUF biedt een niveau van betrouwbaarheid dat de basisfunctionaliteit waarborgt. Afnemers zoals
de Belastingdienst, waterschappen en het CBS kunnen de WOZ-gegevens gebruiken voor hun wettelijke
taken. De Waarderingskamer constateert in de Staat van de WOZ 2025 [[STAAT-WOZ-2025]] dat de
verwerking van berichten in de LV-WOZ in het algemeen met minder fouten verliep dan voorheen, wat
wijst op een volwassen wordende keten.

### Gestandaardiseerde semantiek

StUF-WOZ biedt een gedetailleerd en gestandaardiseerd objectmodel voor WOZ-gegevens. Dit model
definieert eenduidig hoe WOZ-objecten, belanghebbenden, waarden etc. samenhangen en hoe hun
onderlinge relaties in berichten worden gerepresenteerd. Deze semantische standaardisatie draagt bij
aan interoperabiliteit binnen de keten, ook al is de structuur van de gegevens en de samenhang met
andere registraties complex.

### Bitemporele historie

StUF biedt ondersteuning voor [bitemporele historie](#bitemporele-historie): de combinatie van
materiële en formele historie die nodig is voor bezwaar, beroep en verantwoording.

### Bewezen governance

Het stelsel van Digikoppeling, CPA-beheer en conformiteitstoetsen vormt een governance-structuur die
partijen dwingt tot interoperabiliteit. Ondanks de complexiteit biedt deze structuur zekerheid over
de technische compatibiliteit tussen aangesloten partijen. De correcte werking van de keten is
essentieel gezien de grote financiële belangen die samenhangen met het gebruik van WOZ-waarden voor
belastingheffing.

De standaarden waarop de huidige inrichting is gebaseerd worden niet langer doorontwikkeld. De
beschikbaarheid van marktkennis en tooling voor ebMS2 en StUF neemt af, wat de onderhoudbaarheid op
termijn onder druk zet. De vraag is hoe de functionele eisen geborgd blijven wanneer de
onderliggende standaarden worden vervangen door moderne alternatieven.

## Status van de standaarden

De technische standaarden waarop de huidige keten is gebaseerd, bevinden zich in verschillende fasen
van hun levenscyclus:

- **ebMS2** wordt niet langer doorontwikkeld. Logius bereidt een transitie voor naar
  [ebMS3/AS4](#def-ebms3) [[DK-ROADMAP]]. De analyse van dit moderniseringspad en wat het in
  potentie wel en niet oplost voor de WOZ-keten wordt behandeld in het hoofdstuk
  [Het ebMS3/AS4-perspectief](#het-ebms3as4-perspectief).

- **StUF** wordt niet doorontwikkeld, maar wel onderhouden: wetswijzigingen en gevonden fouten
  worden verwerkt, maar er is geen doorontwikkelingsagenda. Forum Standaardisatie heeft in
  evaluaties vastgesteld dat de huidige scope niet langer passend is [[FORUM-STUF-EVAL]].

- **Digilevering**, de dienst van Logius waarop de huidige doorlevering aan afnemers is gebaseerd,
  wordt in de toekomst gestaakt. Forum Standaardisatie heeft CloudEvents als verplichte standaard
  vastgesteld voor notificatiediensten. Dit betekent dat de doorlevering aan afnemers hoe dan ook
  opnieuw moet worden ingericht.

Het onderzoeken van mogelijke alternatieven voor ebMS2 en voor StUF speelt niet alleen bij de WOZ
maar bij elke registratie die op deze standaarden is gebaseerd.
