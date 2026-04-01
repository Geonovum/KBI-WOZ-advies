# Terminologie

In deze paragraaf worden de in dit document gebruikte termen en hun betekenis beschreven.

<dfn id="def-ebms2">ebMS2</dfn>

Het ebXML Messaging Service versie 2.0 protocol [[EBXML-MSG]] is een internationale standaard voor
het betrouwbaar en veilig uitwisselen van elektronische berichten tussen organisaties.

<dfn id="def-ebms3">ebMS3/AS4</dfn>

ebMS 3.0 is de opvolger van ebMS2, gepubliceerd door OASIS in 2007. Het AS4-profiel (Applicability
Statement 4) is een vereenvoudigd profiel van ebMS 3.0 dat in 2013 een OASIS-standaard werd en in
2020 een ISO-standaard. AS4 is de basis van de EU eDelivery-standaard voor grensoverschrijdende
gegevensuitwisseling en wordt binnen Digikoppeling voorbereid als opvolger van ebMS2.

<dfn id="def-pmode">PMode</dfn>

Een Processing Mode (PMode) is de configuratie-eenheid in ebMS3/AS4 die bepaalt hoe berichten worden
verwerkt. In tegenstelling tot de bilaterale CPA's in ebMS2 zijn PModes unilateraal: elke partij
configureert zijn eigen verwerkingsparameters.

<dfn id="def-gdi">GDI</dfn>

De
[Generieke Digitale Infrastructuur (GDI)](https://www.digitaleoverheid.nl/mido/generieke-digitale-infrastructuur-gdi/)
is de verzameling van afspraken(stelsels), standaarden en voorzieningen die alle publieke
dienstverleners gebruiken voor hun digitale dienstverlening aan burgers en ondernemers.

<dfn id="def-lv-woz">LV-WOZ</dfn>

De Landelijke Voorziening WOZ (LV-WOZ) [[LV-WOZ-KV]] is de centrale voorziening waarin bronhouders
(gemeenten) hun WOZ-gegevens aanleveren, zodat deze gegevens centraal beschikbaar zijn voor
afnemers. De LV-WOZ bevat een kopie van de gegevens die gemeenten bijhouden in de decentrale
Basisregistratie WOZ, aangevuld met enkele gegevens die voor de afnemers ook van belang zijn.

<dfn id="def-stuf">StUF</dfn>

Het [Standaard Uitwisseling Formaat (StUF)](https://standaarden.vng.nl/StUF-standaarden) is een
berichtenstandaard en bevat afspraken over de basisprincipes voor het uitwisselen van gegevens
tussen applicaties in het gemeentelijke veld. StUF bevat zelf geen berichten maar wel bouwstenen en
richtlijnen waarmee berichtenstandaarden kunnen worden samengesteld. StUF wordt wel onderhouden maar
niet doorontwikkeld door VNG Realisatie.

<dfn id="def-stuf-woz">StUF-WOZ</dfn>

StUF-WOZ is het verticale sectormodel binnen de StUF-familie dat specifiek is voor WOZ-gegevens. Het
definieert de berichtstructuren voor de uitwisseling van WOZ-objecten, belanghebbenden, waarden en
beschikkingen. De huidige versie is StUF-WOZ 03.12.

<dfn id="def-cpa">CPA</dfn>

Een Collaboration Protocol Agreement (CPA) is een technisch contract in XML-formaat dat de
ebMS-communicatie tussen twee partijen regelt. Het specificeert de identiteit van beide partijen, de
toegestane berichttypen, beveiligingsprofielen, endpoints en parameters voor retry-gedrag.

<dfn id="def-msh">MSH</dfn>

De Message Service Handler (MSH) is het softwarecomponent dat de ebMS-protocollogica afhandelt. De
MSH verzorgt het verzenden en ontvangen van berichten, het verwerken van acknowledgements, het
uitvoeren van retries en de duplicaat-eliminatie.

<dfn id="def-oin">OIN</dfn>

Het Organisatie-Identificatienummer (OIN) is een uniek nummer waarmee organisaties binnen de
overheid worden geïdentificeerd in het Digikoppeling-stelsel. Het OIN is opgenomen in
PKIoverheid-certificaten en wordt gebruikt in CPA's en berichtheaders.

<dfn id="def-intermediair">Intermediair</dfn>

Een intermediair is een organisatie die namens andere organisaties de Digikoppelingsverbinding
beheert. In de WOZ-keten betreft dit doorgaans het beheer van de MSH-component (de
Digikoppelingsadapter).

<dfn id="def-bitemporeel">Bitemporele historie</dfn>

Een historiemodel dat twee tijdsdimensies combineert: de materiële historie (wanneer was iets geldig
in de werkelijkheid) en de formele historie (wanneer is iets geregistreerd in het systeem). Dit
model maakt het mogelijk om te reconstrueren wat de registratie op elk moment in het verleden
toonde.

<dfn id="def-common-ground">Common Ground</dfn>

[Common Ground](https://commonground.nl/) is een door de VNG geïnitieerde beweging om de
informatievoorziening van gemeenten te moderniseren. Zie het hoofdstuk
[Relevante ontwikkelingen](#relevante-ontwikkelingen) voor een beschrijving van de kernprincipes en
de relevantie voor de WOZ-keten.

<dfn id="def-fds">FDS</dfn>

Het [Federatief Datastelsel (FDS)](https://federatief.datastelsel.nl/) is een initiatief van de
Nederlandse overheid om gegevensuitwisseling tussen overheidsorganisaties te vereenvoudigen. Het
stelsel streeft naar een uniforme manier van gegevens delen waarbij data bij de bron blijft en via
gestandaardiseerde interfaces wordt ontsloten.

<dfn id="def-haal-centraal">Haal Centraal</dfn>

[Haal Centraal](https://vng-realisatie.github.io/Haal-Centraal/) is een programma van VNG Realisatie
dat REST API's ontwikkelt voor het bevragen van basisregistraties. De API's zijn ontworpen volgens
de NL API Strategie en volgen het principe dat afnemers gegevens ophalen bij de bron in plaats van
kopieën te ontvangen via berichtenverkeer.

<dfn id="def-fsc">FSC</dfn>

Federated Service Connectivity (FSC) [[FSC-CORE]] is een standaard voor het veilig en
gestandaardiseerd uitwisselen van gegevens via API's tussen overheidsorganisaties. FSC beschrijft
hoe API's worden ontdekt (via een Directory), hoe toegang wordt geautoriseerd (via digitaal
ondertekende Contracts en Grants), en hoe transacties worden gelogd voor verantwoording. De
standaard is in december 2024 vastgesteld door de Programmeringsraad GDI en is verplicht onderdeel
van het Digikoppeling REST API profiel.

<dfn id="def-nl-api-strategie">NL API Strategie</dfn>

De Nederlandse API Strategie [[NL-API-STRATEGIE]] is een verzameling van richtlijnen en standaarden
voor het ontwerpen van API's bij de Nederlandse overheid. De strategie omvat onder meer de REST API
Design Rules en richtlijnen voor authenticatie, autorisatie en beveiliging van API's.

<dfn id="def-nora">NORA</dfn>

De [Nederlandse Overheid Referentie Architectuur (NORA)](https://www.noraonline.nl/) is het
interoperabiliteitsraamwerk voor de Nederlandse overheid. NORA beschrijft principes, richtlijnen en
standaarden voor de inrichting van de informatievoorziening van de publieke sector.

<dfn id="def-gemma">GEMMA</dfn>

De [Gemeentelijke Model Architectuur (GEMMA)](https://gemmaonline.nl/) is de referentiearchitectuur
voor gemeenten, afgeleid van NORA. GEMMA beschrijft de gewenste inrichting van de
informatievoorziening van gemeenten en biedt richtlijnen voor onder meer gegevensuitwisseling,
zaakgericht werken en het gebruik van gemeentelijke standaarden.

<dfn id="def-adr">REST API Design Rules</dfn>

De REST API Design Rules [[ADR]] zijn een set technische ontwerpregels voor REST API's bij de
Nederlandse overheid. De Design Rules hebben de status 'Pas toe of leg uit' op de lijst van Forum
Standaardisatie en schrijven voor hoe API's moeten worden ontworpen op het gebied van naamgeving,
URL-structuur, HTTP-methoden, foutafhandeling en versionering.

<dfn id="def-mim">MIM</dfn>

Het Metamodel Informatie Modellering (MIM) [[MIM]] is een standaard voor het opstellen van
informatiemodellen binnen de Nederlandse overheid. MIM definieert een gemeenschappelijke taal voor
het beschrijven van concepten, attributen en relaties in informatiemodellen, waardoor deze modellen
onderling vergelijkbaar en uitwisselbaar worden. MIM-conforme modellen kunnen worden gebruikt als
basis voor het genereren van API-specificaties en dataschema's.

<dfn id="def-imwoz">Informatiemodel WOZ</dfn>

De inhoudelijke beschrijving van de WOZ-administratie, beheerd door de Waarderingskamer. Zie het
hoofdstuk [Relevante ontwikkelingen](#relevante-ontwikkelingen) voor de huidige status en de relatie
tot het koppelvlak.

<dfn id="def-logboek">Logboek Dataverwerkingen</dfn>

Het Logboek Dataverwerkingen [[LOGBOEK]] is een standaard in ontwikkeling door Logius voor het
gestandaardiseerd vastleggen van dataverwerkingen binnen de overheid. De standaard definieert
interfaces en gedrag voor het loggen van dataverwerkingsoperaties en het koppelen van gerelateerde
logs over verschillende systemen heen. Dit maakt het mogelijk om achteraf te reconstrueren welke
gegevens wanneer, door wie en voor welk doel zijn verwerkt. De standaard beoogt opname op de lijst
met aanbevolen standaarden van Forum Standaardisatie.

<dfn id="def-pkioverheid">PKIoverheid</dfn>

PKIoverheid is het stelsel van digitale certificaten voor de Nederlandse overheid. Deze certificaten
worden gebruikt voor authenticatie, versleuteling en digitale ondertekening in
Digikoppeling-communicatie. De certificaten zijn gekoppeld aan het OIN van de organisatie en hebben
een beperkte geldigheidsduur.
