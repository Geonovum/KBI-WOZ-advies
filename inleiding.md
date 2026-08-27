# Inleiding

Binnen de Nederlandse overheid zijn diverse basisregistraties voor hun gegevensuitwisseling
gebaseerd op [ebMS2](#def-ebms2) en [StUF](#def-stuf). Beide standaarden worden niet langer
doorontwikkeld en recente beleidsbesluiten stellen eisen aan gegevensuitwisseling waaraan de huidige
inrichting niet voldoet. De transitie naar moderne alternatieven speelt daarmee bij elke registratie
die op deze standaarden leunt. Dit document analyseert die transitie aan de hand van één concrete
keten: de WOZ. De combinatie van hoog volume, complexe bitemporele semantiek, een breed
intermediairlandschap en seizoensgebonden piekbelasting maakt dat de knelpunten hier in
geconcentreerde vorm zichtbaar worden. De analyse en ontwerpuitgangspunten zijn echter breder
toepasbaar.

Tegen deze achtergrond is het project _Kennisborging en implementatieondersteuning_ van Geonovum, in
opdracht van het Ministerie van BZK, gevraagd om een ontwerpverkenning uit te voeren en advies op te
stellen over de modernisering van de gegevensaanlevering aan de [LV-WOZ](#def-lv-woz). Dit advies
richt zich specifiek op het koppelvlak tussen gemeenten en de landelijke voorziening: het deel van
de keten waar gemeenten als bronhouders verantwoordelijk voor zijn. Hierbij is ook gekeken naar de
consequenties in de verdere keten, zoals het actief informeren van afnemers en het ondersteunen van
de diverse vraaginteracties vanuit afnemers.

## Scope en afbakening

Dit advies behandelt de inrichting van het koppelvlak voor gegevensaanlevering door gemeenten aan de
LV-WOZ, met als doel het verkennen van alternatieven voor StUF/ebMS2, met behoud van functionele
eisen en wensen van bronhouders en afnemers en behoud van het voldoen aan wettelijke verplichtingen.
De focus ligt op de technische en architecturale keuzes die gemeenten en hun softwareleveranciers
raken. Binnen de scope vallen:

- de architectuurprincipes en ontwerpkeuzes voor het berichtenverkeer en de gegevensuitwisseling
- de randvoorwaarden voor interoperabiliteit, authenticatie, beveiliging en governance
- de transitiestrategie voor de overgang van StUF/ebMS naar REST-gebaseerde koppelingen
- de aansluiting op generieke kaders zoals de [NL API Strategie](#def-nl-api-strategie)
  [[NL-API-STRATEGIE]], [NORA](#def-nora) [[NORA]] en [GEMMA](#def-gemma) [[GEMMA]]

Buiten de scope vallen:

- het interne ontwerp en de implementatie van de LV-WOZ zelf
- de inrichting van gemeentelijke bronsystemen of interne processen bij bronhouders

Het advies is verkennend van aard. Het formuleert ontwerpuitgangspunten en aanbevelingen.
