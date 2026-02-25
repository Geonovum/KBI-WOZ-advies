Diverse basisregistraties bij de Nederlandse overheid zijn voor hun gegevensuitwisseling gebaseerd
op [StUF](#def-stuf) en [ebMS2](#def-ebms2). Beide standaarden worden niet langer doorontwikkeld:
ebMS2 is op internationaal niveau (OASIS) vervangen door ebMS3/AS4 als actief onderhouden opvolger,
en de doorontwikkeling van StUF is stopgezet door VNG Realisatie. De transitie weg van deze
standaarden is daarmee een vraagstuk dat breed speelt.

Dit adviesdocument analyseert die transitie aan de hand van de WOZ-keten: de gegevensaanlevering
door gemeenten aan de [LV-WOZ](#def-lv-woz). De WOZ-keten combineert hoog volume, complexe
bitemporele semantiek, een breed intermediairlandschap en een sterk seizoensgebonden karakter,
waarmee zij de uitdagingen in geconcentreerde vorm zichtbaar maakt. De focus ligt op het koppelvlak
tussen gemeenten (als bronhouders) en de landelijke voorziening: het deel van de keten waar
gemeenten verantwoordelijk voor zijn en waar de keuze voor een modern alternatief voor StUF/ebMS2 de
meeste impact heeft.

De analyse laat zien dat de complexiteit van ebMS2 en StUF heeft geleid tot een ketenconfiguratie
waarin intermediairs een centrale rol spelen. Deze constructie lost het complexiteitsprobleem voor
bronhouders op, maar ondermijnt de voordelen waarvoor deze standaarden oorspronkelijk zijn
ontworpen: end-to-end betrouwbaarheid, cryptografische bewijskracht en volledige bitemporele
historie. Dit patroon is herkenbaar bij elke registratie waar de complexiteit van ebMS en StUF tot
uitbesteding leidt.

Het project _Kennisborging en implementatieondersteuning_ van Geonovum, in opdracht van het
Ministerie van BZK, verkent daarom de mogelijkheden voor een REST-gebaseerde architectuur, waarbij
eenvoud, herbruikbaarheid en consistentie met generieke kaders (zoals de
[NL API Strategie](#def-nl-api-strategie), [NORA](#def-nora) en [GEMMA](#def-gemma)) centraal staan.
Het document beschrijft de analyse van de huidige situatie, identificeert structurele knelpunten, en
formuleert ontwerpuitgangspunten en aanbevelingen. Hoewel de concrete analyse de WOZ-keten betreft,
zijn de bevindingen en ontwerpuitgangspunten breder toepasbaar op registraties die dezelfde
transitie doormaken.
