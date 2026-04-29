# Het ebMS3/AS4-perspectief

Dit hoofdstuk richt zich op de transportlaag: de overgang van ebMS2 naar ebMS3 met het AS4-profiel.
De analyse beschrijft wat deze transitie zou betekenen voor ketens die op ebMS2 zijn gebaseerd,
welke problemen het oplost en welke niet.

## Achtergrond en besluitvorming

De discussie over vervanging van ebMS2 loopt al jaren binnen de Digikoppeling-governance. De
tijdlijn van onderzoeken en besluiten illustreert de zorgvuldige maar trage voortgang:

| Jaar      | Ontwikkeling                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 2018      | Logius laat onderzoeken of vervanging van ebMS2 door ebMS3 zinvol is. Conclusie: geen directe aanleiding voor actieve vervanging |
| 2020      | Technisch Overleg besluit ebMS2 nog niet te vervangen, maar marktondersteuning te monitoren en ebMS3-profielen te verkennen      |
| 2021-2022 | Binnen het TO wordt aangegeven dat actieve vervanging wenselijk is gezien de teruglopende ondersteuning van ebMS2 in de markt    |
| 2023      | MIDO start een impact-analyse voor de transitie naar ebMS3/AS4                                                                   |
| 2024-2025 | Opname van ebMS3/AS4-profiel in Digikoppeling-standaarddocumentatie; ondersteuning van organisaties bij migratie                 |

Het eDelivery ebMS3/AS4-profiel [[EDELIVERY-AS4]] is bij de verkenning geschikt bevonden als basis
voor een Digikoppeling-profiel. Dit profiel is tevens de Europese standaard voor
grensoverschrijdende gegevensuitwisseling [[DK-ROADMAP]].

## Wat is ebMS3/AS4?

AS4 (Applicability Statement 4) [[AS4-PROFILE]] is een profiel van de OASIS ebMS 3.0-specificatie.
Het werd in 2013 een OASIS-standaard en in 2020 een ISO-standaard. AS4 is ontworpen als een
vereenvoudigd, praktisch toepasbaar profiel dat de complexiteit van de volledige ebMS
3.0-specificatie reduceert.

### Evolutie van de standaard

| Jaar | Standaard         | Focus                                         |
| ---- | ----------------- | --------------------------------------------- |
| 2002 | ebMS 2.0          | Protocol-neutrale berichtuitwisseling         |
| 2007 | ebMS 3.0 Core     | Uitgebreide packaging- en routeringsopties    |
| 2010 | ebMS 3.0 Advanced | Multi-hop messaging, bundling                 |
| 2013 | AS4-profiel       | Vereenvoudigd, praktisch profiel van ebMS 3.0 |

AS4 past het _just enough_-principe toe: het selecteert uit de rijke ebMS 3.0-specificatie alleen de
functionaliteit die nodig is voor betrouwbare B2B-communicatie, zonder de volledige complexiteit van
alle opties.

### MSH-architectuur

Net als bij ebMS2 vereist ebMS3/AS4 een Message Service Handler (MSH) die de protocollogica
afhandelt. De MSH ontvangt berichten van de business-applicatie, verpakt ze conform de specificatie,
verzendt ze naar de MSH van de ontvanger, en verwerkt acknowledgements en fouten. Er zijn diverse
MSH-implementaties beschikbaar, open-source en in de markt.

## Wat ebMS3/AS4 oplost

### Actief onderhouden standaard

Het meest fundamentele probleem dat ebMS3/AS4 oplost, is het gebrek aan doorontwikkeling van ebMS2.
De ebMS3-specificatie wordt actief onderhouden door OASIS, en het AS4-profiel is onderdeel van de EU
eDelivery building block. Dit betekent:

- Actieve community en doorontwikkeling
- Regelmatige updates en bugfixes
- Betere aansluiting bij moderne beveiligingsstandaarden

### Verbeterde marktondersteuning

De ebMS2-markt is krimpend; leveranciers investeren niet meer in nieuwe functionaliteit. Voor
ebMS3/AS4 is de situatie anders:

- Meer MSH-leveranciers met actieve productontwikkeling
- Open source opties beschikbaar
- Betere integratie in moderne integratieplatforms

### EU eDelivery-compliance

ebMS3/AS4 is de basis van de EU eDelivery-standaard voor grensoverschrijdende gegevensuitwisseling.
[RINIS](https://www.rinis.nl/en/edelivery/) fungeert als Nederlands National Access Point en
verzorgt de conversie tussen Digikoppeling en eDelivery. Adoptie van ebMS3/AS4 binnen Digikoppeling
verbetert de aansluiting op dit Europese stelsel.

### Flexibeler configuratiemodel

Een van de operationele lasten bij ebMS2 is het CPA-beheer. ebMS3/AS4 gebruikt een ander model:

| Aspect               | ebMS2                                  | ebMS3/AS4                                     |
| -------------------- | -------------------------------------- | --------------------------------------------- |
| Configuratie         | CPA (Collaboration Protocol Agreement) | PMode (Processing Mode)                       |
| Karakter             | Bilateraal XML-document                | Unilaterale configuratie                      |
| Certificaatwijziging | Alle CPA's vernieuwen                  | Lokale PMode-update                           |
| Standaardisatie      | Volledig gestandaardiseerd schema      | Geen gestandaardiseerd schema; CPPA3 als brug |

PModes vereisen minder bilaterale coördinatie dan CPA's. Het CPPA3-formaat [[CPPA3]] biedt een brug
tussen de CPA-wereld en PModes, wat migratie kan vergemakkelijken.

### Light Client-profiel

ebMS3/AS4 definieert naast het volledige ebHandler-profiel ook een Light Client-profiel. Dit profiel
ondersteunt scenario's met:

- Geen vast IP-adres
- Firewall-beperkingen
- Intermitterende connectiviteit

De Light Client kan berichten _pullen_ van een MSH in plaats van ze te ontvangen via een inkomend
HTTP-verzoek. Dit verlaagt de drempel voor kleinere organisaties.

### Behoud van reliable messaging

De kernfunctionaliteit van ebMS2 (betrouwbare exactly-once aflevering) blijft behouden in ebMS3/AS4.
De mechanismen zijn vergelijkbaar:

- Acknowledgements (MSH-niveau ontvangstbevestiging)
- Retry-mechanismen met configureerbare intervallen
- Duplicaat-eliminatie via message-ID's

Voor ketens die op ebMS2 zijn gebaseerd biedt ebMS3/AS4 dezelfde garanties.

## Wat ebMS3/AS4 niet oplost

### De noodzaak van MSH-middleware

ebMS3/AS4 vereist nog steeds een MSH-component. De complexiteit van deze middleware, met stateful
administratie, retry-logica en certificaatbeheer, blijft bestaan. De investering in
MSH-infrastructuur verschuift van ebMS2 naar ebMS3/AS4, maar verdwijnt niet.

Dit betekent dat de fundamentele reden waarom bronhouders intermediairs inschakelen (de complexiteit
van MSH-implementatie) niet wordt weggenomen. Softwareleveranciers zullen ook voor ebMS3/AS4
specialistische MSH-kennis nodig hebben of de implementatie moeten uitbesteden.

### Competentieschaarste

De marktkennis van ebMS verschuift van versie 2 naar versie 3, maar het blijft een specialistische
standaard. Moderne ontwikkelaars zijn niet opgeleid in MSH-protocollen; zij werken met REST API's,
JSON en lichtgewicht frameworks. De transitie naar ebMS3/AS4 vereist omscholing of inhuur van
specialisten. Dit is hetzelfde probleem als bij ebMS2, zij het met een iets grotere talentenpool.

### MSH-scheiding blijft bestaan

De analyse in [De MSH als gescheiden component](#de-msh-als-gescheiden-component) beschrijft hoe de
scheiding tussen de WOZ-applicaties en de MSH leidt tot verlies van end-to-end zicht op
afleveringsstatus en verwerking. Deze problematiek is niet specifiek voor ebMS2 maar voor de
MSH-architectuur als zodanig, ongeacht of de MSH intern of extern wordt beheerd. Bij ebMS3/AS4
blijft de MSH-architectuur bestaan en daarmee ook dit knelpunt.

### StUF en berichtsemantiek

ebMS3/AS4 is een _transportprotocol_. Het vervangt ebMS2 als transportlaag, maar zegt niets over de
inhoud van berichten. Het al dan niet gebruik van StUF staat los van het transportprotocol.

### Volgordeproblemen

Net als ebMS2 biedt ebMS3/AS4 geen ingebouwde garantie voor volgordelijke aflevering. Het protocol
garandeert dat berichten aankomen, niet in welke volgorde ze worden verwerkt. De
volgorde-problematiek die in de huidige keten speelt, zoals subjects die moeten bestaan voordat
beschikkingen kunnen worden gekoppeld en correcties die verwijzen naar eerdere registraties, blijft
bestaan.

### Foutafhandeling en terugkoppeling

Bij voortzetting van de asynchrone profielkeuze blijft de huidige foutafhandelingsproblematiek
bestaan. Foutmeldingen komen asynchroon terug, en bij een intermediair-constructie is het nog steeds
de vraag of deze meldingen de juiste medewerker bij de bronhouder bereiken. Deze problematiek
verdwijnt niet door een ander transportprotocol, tenzij zou worden gekozen voor de synchrone
variant.

### SyncReply: synchrone acknowledgements

Het Digikoppeling ebMS2 profiel ondersteunt sinds versie 3.3 de SyncReply-optie: het synchroon
teruggeven van de acknowledgement in dezelfde HTTP-sessie [[DK-EBMS2]]. Deze optie is expliciet
bedoeld voor hoog-volume scenario's waarin de overhead van asynchrone acknowledgements problematisch
wordt.

Belangrijk onderscheid: bij SyncReply is alleen de _acknowledgement_ synchroon (bevestiging dat het
bericht is ontvangen), niet de _business response_ (inhoudelijke terugkoppeling over validatie). De
MSH bevestigt direct dat het bericht is aangekomen; de inhoudelijke verwerking en eventuele
foutmeldingen volgen nog steeds asynchroon.

Dit biedt een tussenweg:

- **Snellere transportbevestiging**: De verzender weet direct of het bericht is aangekomen
- **Minder MSH-overhead**: Geen aparte acknowledgement-berichten die terug moeten
- **Behoud van asynchrone verwerking**: De inhoudelijke validatie kan nog steeds in eigen tempo

SyncReply lost echter niet het kernprobleem op: de inhoudelijke foutmeldingen blijven asynchroon en
moeten nog steeds hun weg vinden naar de juiste medewerker bij de bronhouder.

### Volledig synchrone verwerking

Een verdergaande optie is om niet alleen de acknowledgement maar ook de inhoudelijke validatie
synchroon te maken. Zowel ebMS2 als ebMS3/AS4 ondersteunen dit technisch, maar het Digikoppeling
profiel schrijft dit niet voor.

Volledige synchrone verwerking biedt:

- **Directe feedback**: De bronhouder weet onmiddellijk of een bericht is geaccepteerd of afgewezen
- **Eenvoudigere foutafhandeling**: Geen asynchrone correlatie nodig tussen verzonden berichten en
  latere foutmeldingen
- **Betere zichtbaarheid**: Ook bij intermediair-constructies is direct duidelijk of verwerking is
  geslaagd

Hier staan praktische bezwaren tegenover:

- **Capaciteitsvereisten**: Synchrone verwerking vereist dat de LV-WOZ de binnenkomende stroom
  real-time kan verwerken én valideren. In de piekperiode is dit een substantiële capaciteitseis.
- **Beschikbaarheidsafhankelijkheid**: Bij onbeschikbaarheid van de LV-WOZ kan de bronhouder niet
  aanleveren. Asynchrone verwerking met buffering biedt meer veerkracht.
- **Timeout-complexiteit**: Inhoudelijke validatie kan tijd kosten; te korte timeouts leiden tot
  foutieve afwijzingen, te lange timeouts blokkeren de verzender.

De keuze tussen synchroon en asynchroon is een architecturale afweging. De SyncReply-optie biedt een
pragmatische tussenweg die de transportoverhead reduceert zonder de flexibiliteit van asynchrone
inhoudelijke verwerking op te geven.

## De migratielast

Een aspect dat vaak onderschat wordt, is de migratielast zelf. De transitie van ebMS2 naar ebMS3/AS4
vereist:

1. **Vervanging van MSH-software**: Bestaande ebMS2-adapters moeten worden vervangen of geüpgraded
   naar ebMS3/AS4-compatibele versies
2. **Herconfiguratie**: CPA's moeten worden vertaald naar PModes
3. **Parallelle operatie**: Tijdens de transitieperiode moeten beide protocollen worden ondersteund
4. **Ketencoördinatie**: Alle partijen in de keten moeten migreren; de LV-WOZ kan pas volledig
   overstappen als alle bronhouders ebMS3/AS4 ondersteunen

Voor een keten met circa 340 ebMS-verbindingen en honderden bronhouders is dit een substantiële
operatie. De Digikoppeling-roadmap voorziet ondersteuning bij het migratieproces, maar de
daadwerkelijke migratie moet door elke organisatie zelf worden uitgevoerd.

## Samenvatting ebMS3/AS4

ebMS3/AS4 is een logische opvolger van ebMS2 en lost een aantal concrete problemen op: het gebrek
aan doorontwikkeling, de krimpende leveranciersmarkt, en de aansluiting bij Europese standaarden. De
reliable messaging-functionaliteit blijft behouden.

Tegelijkertijd adresseert ebMS3/AS4 niet de fundamentele uitdagingen van ketens die op ebMS2/StUF
zijn gebaseerd:

- De **MSH-architectuur** blijft bestaan, inclusief de scheiding tussen applicatie en MSH en het
  daarmee gepaard gaande verlies van end-to-end zicht
- Het al dan niet gebruik van **StUF** staat los van het transportprotocol
- De **competentieschaarste** verschuift maar verdwijnt niet

De transitie naar ebMS3/AS4 is daarmee primair een _onderhoudstransitie_: het vervangt een niet
langer onderhouden protocol door een actueel equivalent, zonder de architecturale vraagstukken
fundamenteel te veranderen. Voor organisaties die investeren in MSH-infrastructuur is het een
noodzakelijke stap. Voor de bredere vraag hoe ketens als de WOZ eenvoudiger, toegankelijker en
robuuster kunnen worden ingericht, biedt het geen antwoord.

Dit plaatst registraties die op ebMS2 zijn gebaseerd voor een strategische keuze: investeren in de
MSH-route (ebMS3/AS4) met behoud van de huidige ketenstructuur, of investeren in een REST-gebaseerde
architectuur die de ketenstructuur fundamenteel kan veranderen.

Het volgende hoofdstuk analyseert dit REST-alternatief: wat het Digikoppeling REST API profiel wel
en niet biedt, en wat dit betekent voor ketens die de transitie overwegen.
