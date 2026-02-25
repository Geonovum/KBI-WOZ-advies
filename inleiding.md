# Inleiding

Binnen de Nederlandse overheid zijn diverse basisregistraties voor hun gegevensuitwisseling
gebaseerd op [ebMS2](#def-ebms2) en [StUF](#def-stuf). Beide standaarden worden niet langer
doorontwikkeld. De transitie naar moderne alternatieven speelt daarmee niet alleen bij de WOZ, maar
bij elke registratie die op deze standaarden leunt. Dit document analyseert die transitie aan de
hand van één concrete keten: de WOZ. De combinatie van hoog volume, complexe bitemporele semantiek,
een breed intermediairlandschap en seizoensgebonden piekbelasting maakt dat de knelpunten hier in
geconcentreerde vorm zichtbaar worden. De analyse en ontwerpuitgangspunten zijn echter breder
toepasbaar.

De [LV-WOZ](#def-lv-woz) vormt de centrale schakel in de WOZ-keten. Gemeenten leveren als
bronhouders hun WOZ-gegevens aan deze voorziening, waarna deze gegevens centraal beschikbaar worden
gesteld aan landelijke afnemers zoals de Belastingdienst, waterschappen en het Kadaster. De
voorziening wordt beheerd door het Kadaster en valt onder toezicht van de Waarderingskamer.

De huidige inrichting van de LV-WOZ is gebaseerd op de [StUF-standaard](#def-stuf) en het
[ebMS2-protocol](#def-ebms2) [[DK-EBMS2]]. Deze architectuur heeft jarenlang betrouwbaar
gefunctioneerd en biedt een solide technische basis, maar sluit niet langer goed aan bij de eisen
van de moderne digitale overheid. Ontwikkelingen zoals het [Federatief Datastelsel (FDS)](#def-fds),
de [Common Ground](#def-common-ground)-beweging en de inzet van moderne webtechnologieën vragen om
een flexibelere en toekomstvaste inrichting van het berichtenverkeer.

De ebMS2-standaard wordt niet langer doorontwikkeld; ebMS3 met het AS4-profiel is de actief
onderhouden opvolger en maakt onderdeel uit van de EU eDelivery-standaard. Ook StUF als
berichtenstandaard wordt niet langer doorontwikkeld. De functie die StUF vervult (het definiëren van
dataformaat en semantiek voor gegevensuitwisseling) wordt geleidelijk overgenomen door
informatiemodellen conform [MIM](#def-mim), API-specificaties in OpenAPI-formaat, en JSON als
uitwisselingsformaat. De marktkennis van ebMS2 en StUF neemt af, waardoor de onderhoudbaarheid en
innovatiekracht van de voorziening op termijn onder druk staan.

Tegen deze achtergrond is het project _Kennisborging en implementatieondersteuning_ van Geonovum, in
opdracht van het Ministerie van BZK, gevraagd om een ontwerpverkenning uit te voeren en advies op te
stellen over de modernisering van de gegevensaanlevering aan de LV-WOZ. Dit advies richt zich
specifiek op het koppelvlak tussen gemeenten en de landelijke voorziening: het deel van de keten
waar gemeenten als bronhouders verantwoordelijk voor zijn.

## Scope en afbakening

Dit advies behandelt de inrichting van het koppelvlak voor gegevensaanlevering door gemeenten aan de
LV-WOZ, met als doel de inzet van een modern alternatief (REST API's) voor StUF/ebMS2. De focus ligt
op de technische en architecturale keuzes die gemeenten en hun softwareleveranciers raken. Binnen de
scope vallen:

- de architectuurprincipes en ontwerpkeuzes voor het berichtenverkeer en de gegevensuitwisseling
- de randvoorwaarden voor interoperabiliteit, authenticatie, beveiliging en governance
- de transitiestrategie voor de overgang van StUF/ebMS naar REST-gebaseerde koppelingen
- de aansluiting op generieke kaders zoals de [NL API Strategie](#def-nl-api-strategie)
  [[NL-API-STRATEGIE]], [NORA](#def-nora) [[NORA]] en [GEMMA](#def-gemma) [[GEMMA]]

Buiten de scope vallen:

- het interne ontwerp en de implementatie van de LV-WOZ zelf
- de inrichting van gemeentelijke bronsystemen of interne processen bij bronhouders
- de koppelvlakken tussen de LV-WOZ en landelijke afnemers

Het advies is verkennend van aard. Het formuleert ontwerpuitgangspunten en aanbevelingen die als
input kunnen dienen voor vervolgtrajecten.
