# Bestuurlijke samenvatting

Dit advies gaat over de modernisering van de gegevensaanlevering aan de LV-WOZ. De analyse is gedaan
aan de hand van de WOZ-keten, maar het vraagstuk is niet WOZ-specifiek. Meerdere landelijke
voorzieningen staan de komende jaren voor dezelfde verbouwing. Het besluit dat hier voorligt gaat
daarom niet over de WOZ zelf, maar over de vraag of alle landelijke voorzieningen dezelfde kant op
bewegen.

## Aanleiding

Veel basisregistraties bij de Nederlandse overheid wisselen gegevens uit via twee standaarden: StUF
voor de inhoud van berichten en ebMS2 voor het transport. Beide bevinden zich aan het einde van hun
levenscyclus. ebMS2 wordt niet langer doorontwikkeld; op internationaal niveau is ebMS3 met het
AS4-profiel de actief onderhouden opvolger. StUF wordt onderhouden, maar kent geen
doorontwikkelingsagenda. De marktkennis van beide neemt af. Daar komen concrete beleidsbesluiten
bij: Forum Standaardisatie heeft de REST API Design Rules en CloudEvents verplicht gesteld, en het
Federatief Datastelsel vereist ontsluiting van registraties via API's. Digilevering, de dienst
waarmee afnemers nu worden beleverd, wordt op termijn gestaakt.

Dit advies analyseert de transitie aan de hand van de WOZ-keten, omdat die keten hoog volume,
bitemporele historie, een breed intermediairlandschap en een sterke seizoenspiek combineert.

## De WOZ-keten in cijfers

Gemeenten leveren als bronhouders hun WOZ-gegevens aan de LV-WOZ. Die voorziening wordt beheerd door
het Kadaster en valt onder toezicht van de Waarderingskamer. Afnemers zijn onder meer de
Belastingdienst, de waterschappen en het CBS. Na 1 januari ontvangen ongeveer 10 miljoen huishoudens
en rechtspersonen een WOZ-beschikking; die gegevens moeten binnen de wettelijke termijn van 8 weken
bij de LV zijn. In januari en februari is het berichtenvolume een veelvoud van de rest van het jaar.
De LV onderhoudt ongeveer 340 ebMS-verbindingen. Een substantieel deel van de bronhouders heeft het
beheer van de technische adapter (de MSH) uitbesteed.

## Wat werkt en wat knelt

De huidige inrichting functioneert betrouwbaar. De Waarderingskamer constateert in de Staat van de
WOZ 2025 dat de verwerking van berichten met minder fouten verliep dan voorheen. Afnemers kunnen de
gegevens gebruiken voor hun wettelijke taken. Er is geen acute noodzaak die om een overhaast besluit
vraagt.

De knelpunten hieronder zijn structureel, niet acuut. Ze zijn zichtbaar in de dagelijkse uitvoering
en kosten daar tijd en herstelwerk, maar ze leggen de keten niet stil. Het punt is dat het fundament
veroudert terwijl de eisen aan registraties toenemen, en dat de kosten van uitstel oplopen.

In het transport vereist ebMS2 een aparte MSH naast de WOZ-applicatie. De betrouwbaarheidsgarantie
geldt tussen die adapters, niet tussen de applicaties. De LV genereert maandelijks tussen de 100.000
en 200.000 foutmeldingen; bij uitbesteed MSH-beheer gaan die naar de tussenpartij en bereiken ze
niet altijd de bronhouder. Het komt voor dat een gemeente niet doorheeft dat zij niet meer aan de LV
levert.

In de verwerking is de communicatie asynchroon. Een ontvangstbevestiging bevestigt technische
ontvangst, geen inhoudelijke verwerking. Foutmeldingen kunnen uren later binnenkomen en moeten
worden gekoppeld aan het oorspronkelijke bericht. De bronhouder heeft geen directe zekerheid over de
verwerkingsstatus.

In de keten is de LV-WOZ ingericht rond het uitgangspunt "conforme kopie": een volledige kopie van
de gemeentelijke administratie. Dat staat op gespannen voet met de praktijk. Elke afkeuring creëert
een verschil tussen LV en gemeente, en het reconstrueren van historie uit berichten levert een
vastlegging op die structureel afwijkt van de bron. De LV houdt geen eigen formele tijdlijn bij,
waardoor de vraag "wat wist de LV vier weken geleden?" niet te beantwoorden is; de Belastingdienst
reconstrueert dit zelf.

Dezelfde spanning speelt bij de doorlevering aan afnemers. De LV stuurt de in haar verwerkte
bronberichten door en filtert daarbij per afnemertype, maar geeft de eigen interpretatie van die
berichten niet mee. Elke afnemer voert daardoor dezelfde afleiding opnieuw uit, met eigen logica en
met het risico op afwijkende uitkomsten. Digilevering filtert op gebied of gemeente, niet op wat
inhoudelijk is gewijzigd; bij herstelacties ontvangen afnemers grote aantallen berichten zonder
nieuwe informatie, en de Belastingdienst ontvangt soms gegevens ouder dan zes jaar die buiten haar
belastingtermijn vallen.

## Twee routes voor het transport

Voor de transportlaag zijn er twee routes. ebMS3/AS4 is de actief onderhouden opvolger van ebMS2 en
onderdeel van de Europese eDelivery-standaard. Het lost het onderhoudsprobleem op en verbetert de
marktondersteuning. Het behoudt de MSH-architectuur, de behoefte aan specialistische kennis, en laat
de inhoud van de berichten (StUF) ongemoeid. Het is in de kern een onderhoudstransitie.

Een REST-gebaseerde architectuur neemt de aparte MSH weg; de WOZ-applicatie communiceert
rechtstreeks via HTTP met de LV. Deze route sluit aan op de inmiddels verplichte standaarden. REST
standaardiseert betrouwbaarheid, capaciteitsbeheersing, bitemporele aanlevering en
correctiesemantiek niet uit zichzelf; die moeten per domein worden vastgelegd. Dat is technisch
mogelijk en vraagt om standaardisatie.

De afweging is strategisch: investeren in de MSH-route met de huidige ketenstructuur, of investeren
in een REST-architectuur die de ketenstructuur kan veranderen. Dit advies concludeert dat de
REST-route de juiste is, op voorwaarde dat wat REST zelf niet regelt gezamenlijk wordt
gestandaardiseerd. Die combinatie, REST-koppelvlakken plus gedeelde afspraken, is de lijn die dit
advies schetst.

## Twee uitgewerkte oplossingsrichtingen

Binnen de REST-route werkt dit advies twee oplossingsrichtingen uit. De eerste is inhoudelijk van
aard en heeft ook los van de transportkeuze waarde; de tweede bouwt direct op REST.

De eerste richting is leveren en overeenstemmen. De wettekst spreekt van leveren en overeenstemmen;
"conforme kopie" is een ontwerpinvulling, geen wettelijke eis, en een herformulering vraagt geen
wetswijziging. In dit model draagt een levering alleen de nieuwe toestand voor een periode. De LV
legt leveringen vast als een aangroeiende stapel per beschikkingsjaar en leidt daaruit projecties af
die zijn afgestemd op de behoefte van elke afnemer. De LV bouwt een eigen formele historie op,
precies wat de Belastingdienst nodig heeft. Correcties krijgen een eigen gebeurtenistype, wat de
interpretatielast in de keten verlaagt. De verantwoordelijkheid voor kwaliteit komt terug bij de
bronhouder: de LV keurt alleen af waar zij haar verstrekkingstaak niet kan uitvoeren, en
inhoudelijke afwijkingen worden achteraf teruggemeld. Dit vraagt wel om een sterkere
terugmeldfaciliteit.

De tweede richting is synchroon aanleveren en verwerken. De uitwisseling tussen bronhouder en LV
wordt teruggebracht tot één HTTP-aanroep waarin de levering en het verwerkingsresultaat samenvallen.
De bronhouder krijgt direct zekerheid. Batchaanlevering is bij deze richting een mogelijke
optimalisatie voor de piekperiode. Deze richting neemt de MSH en de bijbehorende
identificatiemismatch weg.

De twee richtingen staan los van elkaar en zijn gefaseerd in te voeren.

## Wat de geschetste lijn niet oplost

Bestuurlijke stukken over informatievoorziening zetten de bestaande problemen vaak zwaar aan en
schetsen daarna een toekomst zonder problemen. Dat beeld past hier niet. De keuze gaat over een
ander soort problemen, niet over de afwezigheid ervan.

Complexiteit verdwijnt niet, maar verplaatst. Wat ebMS2 vandaag in de transportlaag afdwingt
(betrouwbare aflevering, volgorde, herhaling), moet in een REST-inrichting expliciet worden
afgesproken en vastgelegd. Die afspraken zijn er nog niet allemaal. Het werk verschuift van
productkeuze naar standaardisatie en governance.

De migratie kost tijd en geld. Bronhouders en LV zullen een periode twee koppelvlakken naast elkaar
in de lucht houden, bij ongeveer 340 verbindingen en bij een aanzienlijk deel van de bronhouders dat
het technisch beheer heeft uitbesteed. De piek in januari en februari beperkt het migratievenster
tot een deel van het jaar.

De grootste veranderingen zijn niet technisch. Kwaliteitsverantwoordelijkheid terugleggen bij de
bronhouder vraagt een sterkere terugmeldfaciliteit. Afnemers die nu hun eigen afleidingslogica
onderhouden, moeten die loslaten en op de interpretatie van de LV gaan vertrouwen. Dat raakt
werkprocessen en afspraken, niet alleen koppelvlakken.

Ook de nieuwe inrichting kent een levenscyclus. Over een reeks jaren ligt er opnieuw een
vernieuwingsvraag. De winst zit niet in een besparing op korte termijn, maar in onderhoudbaarheid,
in aansluiting op de standaarden die inmiddels verplicht zijn, en in minder dubbele interpretatie in
de keten.

## Waarom dit verder reikt dan de WOZ

De knelpunten zijn niet uniek voor de WOZ. De scheiding tussen applicatie en MSH, de asynchrone
terugkoppeling, historie die uit berichten moet worden gereconstrueerd en afnemers die dezelfde
afleiding herhalen: dit patroon komt voor bij elke registratie die op StUF en ebMS2 leunt. De
bevindingen en ontwerpuitgangspunten in dit advies zijn daarmee toepasbaar op elke registratie die
dezelfde transitie doormaakt.

Die vaststelling werkt ook de andere kant op. De LV-WOZ kan deze lijn alleen verantwoord kiezen als
vaststaat dat de andere landelijke voorzieningen die de komende jaren worden verbouwd dezelfde
standaarden en dezelfde uitwerking daarvan kiezen. Ontbreekt die zekerheid, dan loopt de LV-WOZ het
risico dat later een andere invulling generiek wordt verklaard en dat opnieuw moet worden verbouwd.

Dat risico is niet theoretisch en het raakt niet alleen de LV. Bronhouders en afnemers leveren aan
meerdere registraties. Als elke voorziening zelfstandig moderniseert, stapelen verschillende
invullingen zich bij hen op. De uitwisseling wordt dan per registratie moderner, terwijl het
landschap als geheel niet eenvoudiger wordt. Uniformiteit is in dit dossier geen bijvangst, maar de
eigenlijke opbrengst.

## Het gevraagde besluit

Gevraagd wordt geen besluit over de oplossing voor de LV-WOZ. Dat besluit ligt bij de stakeholders
en financiers rond de LV-WOZ: bronhouders, afnemers, de beheerder en de toezichthouder. Zij gaan
over inrichting, tempo en bekostiging van hun eigen keten.

Gevraagd wordt een besluit over de generieke lijn: dat deze op afzienbare termijn wordt toegepast
bij alle landelijke voorzieningen die hun koppelvlakken vernieuwen, onder een "pas toe of leg
uit"-regime en met een tijdpad. REST-gebaseerde koppelvlakken zijn via Forum Standaardisatie al
verplicht; het nieuwe van dit besluit is de gedeelde uitwerking van wat REST zelf niet regelt:
betrouwbare aflevering, capaciteitsbeheersing, historie en correctiesemantiek. Zonder die gedeelde
uitwerking levert "REST" opnieuw uiteenlopende invullingen op en blijft uniformiteit uit.

Dit besluit hoort thuis op stelselniveau, boven de afzonderlijke ketens, omdat geen enkele
afzonderlijke voorziening het risico van vooroplopen alleen kan dragen. Zolang de generieke lijn
niet vaststaat, is uitstel voor elke individuele voorziening de verstandige keuze. Het gevolg
daarvan is dat het stelsel als geheel op verouderende standaarden blijft staan. Een besluit over de
lijn maakt de investeringsbeslissingen in de afzonderlijke ketens, waaronder die van de LV-WOZ, pas
mogelijk.
