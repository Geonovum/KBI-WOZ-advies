# Bestuurlijke samenvatting: Implementatie-advies modernisering gegevensaanlevering LV-WOZ

## Inleiding

Het advies over de modernisering van de gegevensaanlevering aan de Landelijke Voorziening WOZ beschrijft een vraagstuk dat breder is dan alleen de WOZ-keten. Binnen de Nederlandse overheid zijn meerdere basisregistraties voor gegevensuitwisseling gebaseerd op de standaarden StUF en ebMS2. ebMS2 wordt internationaal niet langer doorontwikkeld en heeft met ebMS3/AS4 een actief onderhouden opvolger; StUF wordt nog wel onderhouden, maar niet doorontwikkeld.

Daarmee ontstaat voor registraties die op deze standaarden steunen een gezamenlijke opgave: hoe blijven betrouwbaarheid, consistentie, historie en wettelijke verplichtingen geborgd, terwijl de technische inrichting aansluit op actuele overheidskaders voor gegevensdeling.

De WOZ-keten wordt in het advies gebruikt als concrete casus, omdat daar verschillende kenmerken samenkomen: veel berichtenverkeer, bitemporele historie, seizoenspieken, intermediairs en afhankelijkheden tussen bronhouders, landelijke voorziening en afnemers. Dit advies legt daarbij de focus op de aanlevering vanuit bronhouders naar de landelijke voorziening.

## Huidige situatie

De huidige inrichting van de LV-WOZ heeft een duidelijke functie in het stelsel. Gemeenten leveren als bronhouders WOZ-gegevens aan de landelijke voorziening, waarna deze gegevens beschikbaar komen voor afnemers zoals de Belastingdienst en waterschappen. De voorziening wordt beheerd door het Kadaster en staat onder toezicht van de Waarderingskamer.

De huidige gegevensuitwisseling is gebaseerd op StUF-WOZ en ebMS2. Volgens het advies heeft deze combinatie jarenlang invulling gegeven aan de functionele eisen van de keten, waaronder betrouwbare aflevering, gestandaardiseerde semantiek en ondersteuning voor bitemporele historie. De analyse stelt dus niet dat de bestaande inrichting niet functioneert, maar dat de houdbaarheid ervan onder druk komt te staan doordat de onderliggende standaarden niet verder worden ontwikkeld en de benodigde kennis in de markt afneemt.

## Functionele kaders

Het bestuurlijke belang ligt vooral in de continuïteit van de gegevensvoorziening. De WOZ-keten ondersteunt processen met wettelijke en financiële doorwerking. Afnemers moeten kunnen vertrouwen op tijdige, consistente en herleidbare gegevens.

Daarom kan modernisering niet worden benaderd als een zuiver technische vervanging van transportprotocol of berichtformaat. Het advies formuleert eerst functionele kaders waaraan elke oplossingsrichting moet voldoen. Daarbij gaat het onder meer om:

- wettelijke basis;
- aanlevering en registratie;
- bitemporele historie;
- herhaalbaarheid op een beschouwingsmoment;
- gebeurtenisgedreven verwerking;
- correctiesemantiek;
- consistentievalidatie;
- betrouwbare aflevering;
- verwerking bij piekbelasting;
- notificatie van afnemers;
- traceerbaarheid;
- identificatie.

Deze eisen vormen het toetsingskader voor zowel de bestaande inrichting als mogelijke alternatieven.

## Knelpunten

Een belangrijk inzicht uit het advies is dat een deel van de complexiteit niet voortkomt uit de gekozen techniek, maar uit de inhoudelijke eisen van de WOZ-keten zelf. De registratie moet kunnen laten zien wat op een bepaald moment materieel geldig was én wat op een bepaald moment formeel geregistreerd was. Ook moeten correcties en mutaties op een eenduidige manier doorwerken, inclusief de gevolgen voor afnemers en herstelprocessen.

StUF-WOZ biedt hiervoor gestandaardiseerde patronen, maar de toepassing vraagt kennis van:

- de generieke StUF-onderlaag;
- het WOZ-sectormodel;
- de specifieke koppelvlakken;
- XML-schema’s;
- namespaces;
- de interactie met ebMS.

In de praktijk wordt een deel van die technische implementatie daarom uitgevoerd door intermediairs. Intermediairs zijn derde partijen buiten de bronhouders en landelijke voorziening; dit kunnen samenwerkingsverbanden zijn, maar ook commerciële (cloud)leveranciers. Dat heeft effect op de verdeling van regie, verantwoordelijkheid en ketenbeheersing.

## ebMS3-perspectief

Het advies bespreekt ebMS3/AS4 als één van de mogelijke ontwikkelrichtingen. Deze standaard is de opvolger van ebMS2, sluit aan op EU eDelivery en behoudt functies voor betrouwbare berichtaflevering. Daarmee adresseert ebMS3/AS4 enkele lifecycle- en aansluitingsvragen rond ebMS2.

Tegelijkertijd lost een overstap naar ebMS3/AS4 niet alle knelpunten op. De noodzaak voor intermediairs blijft bestaan, met bijbehorende beperkingen in beheer, verantwoordelijkheid en het constateren en achterhalen van fouten in de berichtafhandeling. Ook blijven de vraagstukken rond StUF, berichtsemantiek, volgorde en inhoudelijke terugkoppeling bestaan.

Bestuurlijk betekent dit dat ebMS3/AS4 vooral een continuïteits- en transportperspectief biedt, maar geen volledige modernisering van de gegevensafhandeling en de interactiepatronen.

## REST API-perspectief

Daartegenover staat het REST-perspectief. Het Digikoppeling REST API-profiel biedt een alternatief dat aansluit op moderne API-kaders binnen de overheid, waaronder:

- de NL API Strategie;
- NORA;
- GEMMA;
- de REST API Design Rules.

REST past bij een inrichting waarin gegevens via gestandaardiseerde API’s worden gedeeld. Het advies benadrukt echter dat REST niet vanzelf alle functionaliteit levert die in de huidige StUF/ebMS-inrichting besloten ligt.

Betrouwbaarheid, capaciteitsbeheersing, asynchrone verwerking, volgorde-afhandeling, correctiesemantiek en bitemporele historie moeten expliciet worden ontworpen en gestandaardiseerd. Een REST-architectuur kan dus alleen een volwaardig alternatief zijn als deze functionele eisen bewust worden ingevuld.

## Relevante ontwikkelingen

Voor bestuurders is vooral relevant dat de modernisering samenhangt met bredere ontwikkelingen in de digitale overheid. Het advies noemt onder meer:

- Uit Betrouwbare Bron;
- Common Ground;
- het Informatiemodel WOZ;
- de Haal Centraal WOZ Bevragen API;
- binnengemeentelijke WOZ-API’s.

Deze ontwikkelingen wijzen in de richting van meer gestandaardiseerde API’s, betere aansluiting op informatiemodellen en een duidelijker scheiding tussen gegevens, diensten en procesinrichting.

Tegelijkertijd laat de bestaande WOZ-praktijk zien dat aanlevering, afnemersvoorziening, historie en terugmeldingen in samenhang moeten worden bekeken. Het moderniseren van één koppelvlak heeft gevolgen voor de rest van de keten.

## Oplossingsrichtingen

Het advies werkt oplossingsrichtingen uit die niet alleen over techniek gaan, maar ook over verantwoordelijkheid en governance.

### Leveren en overeenstemmen

Een centrale gedachte is om de LV-WOZ minder te benaderen als een exacte conforme kopie van gemeentelijke administraties en meer vanuit de wettelijke begrippen *leveren* en *overeenstemmen*.

Gemeenten leveren gebeurtenissen of toestanden aan, de landelijke voorziening legt die vast, en overeenstemming kan worden vastgesteld via projecties en controles. Daarmee kan explicieter worden gemaakt:

- welke gegevens zijn geleverd;
- wat de landelijke voorziening heeft vastgelegd;
- waar eventueel verschillen of signalen ontstaan.

Dit vraagt heldere afspraken over kwaliteitscontrole, validatie, herstel en doorwerking naar afnemers.

### Synchroon aanleveren en verwerken

Een tweede oplossingsrichting betreft synchroon aanleveren en verwerken. Het advies verkent een model waarin één uitwisseling ook één inhoudelijke terugkoppeling oplevert. Dat kan bronhouders sneller duidelijkheid geven over acceptatie of afwijzing van een levering.

Dit vraagt om verdere uitwerking van onderwerpen als:

- idempotentie;
- capaciteitsbeheersing;
- batchaanlevering;
- herstelafspraken.

Synchrone verwerking verplaatst asynchroniteit niet volledig uit de keten, maar maakt de grens tussen aanlevering en inhoudelijke beoordeling explicieter.

Voor bestuurders is dit relevant omdat het effect heeft op verantwoordelijkheden, foutafhandeling en de mate waarin bronhouder en landelijke voorziening op elkaar kunnen sturen.