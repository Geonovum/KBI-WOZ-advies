# Bestuurlijke samenvatting: aanlevering van WOZ-gegevens aan de landelijke voorziening

## Inleiding

Dit advies gaat over een vraagstuk dat niet specifiek is voor de WOZ. De Landelijke Voorziening WOZ
(LV-WOZ) en de landelijke voorzieningen van andere basisregistraties zijn destijds ontworpen op
basis van de toen geldende 'pas toe of leg uit'-standaarden van de overheid: StUF voor de inhoud van
berichten en Digikoppeling ebMS2 voor het transport. Die keuze was toen juist. Inmiddels heeft de
overheid nieuwe standaarden verplicht gesteld, gebaseerd op REST API's. Om landelijke voorzieningen
ook in de toekomst te laten aansluiten op actuele overheidsstandaarden zijn ingrijpende verbouwingen
nodig. Die opgave geldt voor elke registratie die op StUF en ebMS2 leunt.

Dit advies analyseert die opgave aan de hand van de WOZ-keten en gaat over de vraag of, en hoe, de
aanlevering van WOZ-gegevens door gemeenten aan de landelijke voorziening wordt vervangen.

## Het probleem

De huidige aanlevering functioneert betrouwbaar. De houdbaarheid staat echter onder druk:

- ebMS2 wordt niet meer doorontwikkeld. StUF wordt wel onderhouden, maar niet doorontwikkeld. De
  kennis van beide standaarden verdwijnt uit de markt. Dat vergroot het risico op uitval en maakt
  problemen lastiger te verhelpen.
- Tussen de gemeentelijke systemen en de landelijke voorziening zit een aparte technische tussenlaag
  (de ebMS-adapter) die berichten vertaalt en verstuurt. Het beheer daarvan is specialistisch werk
  dat gemeenten vaak uitbesteden.
- Een gemeente krijgt geen directe bevestiging dat een levering is aangekomen en goed verwerkt.
  Foutmeldingen komen soms uren later binnen, en bij uitbesteed beheer bij de externe beheerder in
  plaats van bij de gemeente zelf. De landelijke voorziening genereert maandelijks 100.000 tot
  200.000 foutmeldingen. In de praktijk komt het voor dat een gemeente niet doorheeft dat zij niet
  meer levert.

## Waarom dit bestuurlijk relevant is

WOZ-gegevens bepalen belastingaanslagen voor huishoudens, bedrijven en waterschappen. Na 1 januari
gaat het om circa 10 miljoen beschikkingen, die binnen de wettelijke termijn van 8 weken bij de
landelijke voorziening moeten zijn. In precies die periode is het berichtenverkeer een veelvoud van
de rest van het jaar. Een storing die laat wordt opgemerkt, raakt dan direct de tijdige en juiste
belastingheffing, met mogelijke financiële en juridische gevolgen. Dat risico neemt toe naarmate
minder mensen de huidige techniek beheersen.

## Wat het advies voorstelt

Het advies stelt voor de aparte tussenlaag te laten vervallen. Gemeentelijke systemen communiceren
dan rechtstreeks met de landelijke voorziening via REST API's, conform het Digikoppeling REST
API-profiel: de manier van gegevensuitwisseling die de overheid inmiddels als standaard voorschrijft.
Dat levert concreet op:

- de gemeente krijgt direct en automatisch uitsluitsel of een levering is geslaagd;
- er is geen aparte, schaarse technische specialisatie meer nodig om de verbinding te beheren;
- het is helder wat de gemeente heeft geleverd en wat de landelijke voorziening heeft vastgelegd,
  zodat vragen als "wat was er vier weken geleden geregistreerd?" te beantwoorden zijn. Afnemers
  zoals de Belastingdienst hebben daar nu geen antwoord op.

Het advies werkt hiervoor twee richtingen uit die los van elkaar en gefaseerd zijn in te voeren:
*leveren en overeenstemmen* (de landelijke voorziening legt vast wat geleverd is en bouwt een eigen
formele historie op) en *synchroon aanleveren en verwerken* (één aanroep geeft direct het
verwerkingsresultaat terug).

Er is ook een behoudender alternatief: overstappen op ebMS3/AS4, de opvolger van ebMS2. Dat lost het
onderhoudsprobleem op, maar houdt de tussenlaag, de specialistische kennis en de late foutdetectie
in stand. Het is in de kern een onderhoudsspoor, geen modernisering.

## Wat hiervoor nog ontwikkeld moet worden

De nieuwe standaarden bieden nog niet voor alle functionele eisen een uitgewerkte invulling. REST
regelt uit zichzelf geen gegarandeerde aflevering, geen verwerking van de januaripiek, geen
historie en geen correctiesemantiek. Deze eisen blijven onverkort gelden en moeten voor dit domein
expliciet worden ontworpen en gestandaardiseerd. Dat is goed mogelijk; het advies levert daarvoor de
functionele kaders en ontwerpuitgangspunten.

## Waarom dit nu speelt

Het moment van handelen wordt niet vrij gekozen. ebMS2 is aan het einde van zijn levenscyclus en
Digilevering, de dienst waarmee afnemers nu worden beleverd, wordt op termijn gestaakt. Forum
Standaardisatie heeft de REST API Design Rules en CloudEvents verplicht gesteld en het Federatief
Datastelsel vereist ontsluiting van registraties via API's. De voorgestelde richting sluit aan bij
bredere ontwikkelingen zoals Common Ground en Uit Betrouwbare Bron. Wachten maakt de opgave niet
kleiner: de kennis wordt schaarser, terwijl het probleem van late foutdetectie blijft bestaan. De
bevindingen zijn bovendien bruikbaar voor elke registratie die dezelfde overstap moet maken.
