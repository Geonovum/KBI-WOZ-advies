Diverse basisregistraties bij de Nederlandse overheid zijn voor hun gegevensuitwisseling gebaseerd
op [StUF](#def-stuf) en [ebMS2](#def-ebms2). Beide standaarden worden niet langer doorontwikkeld:
ebMS2 is op internationaal niveau (OASIS) vervangen door ebMS3/AS4 als actief onderhouden opvolger,
en StUF wordt wel onderhouden maar niet doorontwikkeld. De transitie weg van deze standaarden is
daarmee een vraagstuk dat breed speelt.

Dit adviesdocument analyseert die transitie aan de hand van de WOZ-keten: de gegevensaanlevering
door gemeenten aan de [LV-WOZ](#def-lv-woz), het actief leveren van gegevens door de LV-WOZ aan
afnemers en het ophalen van gegevens uit de LV-WOZ door afnemers. De WOZ-keten combineert hoog
volume, complexe bitemporele semantiek, een breed intermediairlandschap en een sterk
seizoensgebonden karakter, waarmee zij de uitdagingen in geconcentreerde vorm zichtbaar maakt. De
focus ligt op het koppelvlak tussen gemeenten (als bronhouders) en de landelijke voorziening: het
deel van de keten waar gemeenten verantwoordelijk voor zijn. Uitgangspunt is dat aan de functionele
eisen van alle ketenpartners moet worden voldaan, inclusief de eisen die afnemers stellen aan
betrouwbaarheid, consistentie en tijdige beschikbaarheid van gegevens.

De WOZ-keten stelt functionele eisen aan betrouwbaarheid, bitemporele historie en consistentie die
inherent complex zijn. De huidige standaarden implementeren deze eisen, maar vereisen
specialistische kennis die schaars is. In de praktijk besteden veel bronhouders de technische
implementatie uit aan intermediairs. De consequenties van deze ketenarchitectuur voor de end-to-end
beheersing worden in het document geanalyseerd.

Het project _Kennisborging en implementatieondersteuning_ van Geonovum, in opdracht van het
Ministerie van BZK, verkent daarom de mogelijkheden voor een REST-gebaseerde architectuur, waarbij
eenvoud, herbruikbaarheid en consistentie met generieke kaders (zoals de
[NL API Strategie](#def-nl-api-strategie), [NORA](#def-nora) en [GEMMA](#def-gemma)) centraal staan.
Het document beschrijft de analyse van de huidige situatie, identificeert structurele knelpunten, en
formuleert ontwerpuitgangspunten en aanbevelingen. Hoewel de concrete analyse de WOZ-keten betreft,
zijn de bevindingen en ontwerpuitgangspunten breder toepasbaar op registraties die dezelfde
transitie doormaken.
