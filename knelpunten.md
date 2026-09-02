# Knelpunten

De [functionele eisen](#functionele-kaders) waaraan de WOZ-keten moet voldoen, worden in de
[huidige inrichting](#huidige-situatie) op basis van StUF en ebMS2 voor het merendeel ingevuld. Dit
hoofdstuk beschrijft waar die invulling in de uitvoering spanning oplevert. De basis is gevormd door
gesprekken met stakeholders (Kadaster, VNG, Waarderingskamer, afnemers) en analyse van de bestaande
specificaties en evaluaties.

Bij het lezen van dit hoofdstuk zijn twee dingen van belang.

Ten eerste komen de beschreven knelpunten uit drie verschillende hoeken, en dat maakt uit voor wat
een andere standaardkeuze eraan verandert:

- Knelpunten die samenhangen met de **standaard**, zoals de MSH-architectuur en het CPA-beheer. Deze
  kunnen met een andere standaard anders uitpakken.
- Knelpunten die samenhangen met de **functionele eisen** zelf. Bitemporele historie,
  correctiesemantiek en consistentiebewaking zijn inhoudelijk complex, ongeacht in welke standaard
  zij worden uitgedrukt. Deze verdwijnen niet bij een standaardwissel.
- Knelpunten die samenhangen met **ontwerpkeuzes in de keteninrichting**, zoals de vraag wiens
  formele historie de LV bijhoudt. Deze staan los van de standaard en kunnen ook zonder
  standaardwissel worden herzien.

De [conclusie](#conclusie) van dit hoofdstuk sorteert de belangrijkste knelpunten langs deze drie
lijnen. Dat onderscheid is bepalend voor de beoordeling van de alternatieven in de volgende
hoofdstukken: een standaardwissel adresseert alleen de eerste categorie.

Ten tweede waarderen niet alle stakeholders elke observatie op dezelfde manier. Wat voor de ene
partij een knelpunt is, kan voor een andere partij een aanvaardbaar gevolg zijn van het voldoen aan
een functionele eis. De observaties staan hier zodat ze kunnen worden meegewogen bij het beoordelen
van alternatieven, en zijn beschreven zoals zij zich in de uitvoering voordoen, zonder ze zwaarder
aan te zetten dan ze zijn.

## De standaarden

### ebMS2: lifecycle en specialistische kennis

Het correct implementeren van ebMS2 vereist diepgaande kennis van de standaard. De
ebMS-functionaliteit is te complex om te integreren in standaard applicaties, waardoor een aparte
MSH-adapter noodzakelijk is. Dit component moet worden voorzien, geconfigureerd en beheerd, wat
substantiële investeringen vergt in middleware en specialistische kennis.

Het bilaterale karakter van CPA's creëert een coördinatievraagstuk. Elke combinatie van twee
partijen die berichten willen uitwisselen heeft een eigen CPA nodig. Bij certificaatvernieuwing
moeten alle CPA's opnieuw worden gegenereerd en gedistribueerd naar alle ketenpartners. Wanneer één
partij een nieuwe CPA inlaadt terwijl de andere partij nog de oude versie gebruikt, faalt de
communicatie.

ebMS2 is gebaseerd op technologie uit het begin van deze eeuw, met SOAP en XML als fundament. De
IT-sector is grotendeels overgestapt naar RESTful API's met JSON als dataformaat. De tooling en
frameworks die moderne ontwikkelaars gewend zijn te gebruiken, ondersteunen ebMS niet of nauwelijks.
De softwareleveranciers die WOZ-systemen bouwen hebben ontwikkelaars die het WOZ-domein kennen, maar
onvoldoende ervaring met ebMS om dit zelf te implementeren. Veel bronhouders kiezen er daarom voor
het MSH-beheer uit te besteden.

### StUF-WOZ: complexiteit en specialistische kennis

De functionele eisen van de WOZ-keten (bitemporele historie, correctiesemantiek,
gebeurtenisgebaseerde aanlevering) brengen inherente complexiteit met zich mee. StUF
[[STUF-ONDERLAAG]] is de standaard die deze complexiteit adresseert. Het is gelaagd opgebouwd: een
generieke onderlaag (StUF 03.01), horizontale sectormodellen (StUF-BG), verticale sectormodellen
(StUF-WOZ) en specifieke koppelvlakken (LV-WOZ). StUF biedt gestandaardiseerde mutatiesoorten,
bitemporele elementen en kennisgevingspatronen. Ten tijde van de oorspronkelijke ontwerpkeuze was
StUF de enige standaard die aan deze functionele eisen kon voldoen.

De keerzijde van deze uitgebreidheid is dat correct implementeren diepgaande kennis vereist van de
generieke onderlaag, het specifieke sectormodel, het koppelvlak, de XML-schema's en namespaces, én
de interactie met ebMS. De evaluatie van Forum Standaardisatie [[FORUM-STUF-EVAL]] concludeert:
"StUF is een complexe standaard. De complexiteit, verschillen in interpretatie en incompatibele
implementaties komen de interoperabiliteit niet ten goede." De evaluatie stelt vast dat het
"moeilijk is om specialisten te vinden" en dat er een "lange inwerktijd voor ontwikkelaars" is.
Dezelfde evaluatie constateert dat bij StUF-implementaties in de praktijk vaak sub-standaarden
ontstaan waarbij een subset van het volledige model wordt geïmplementeerd. Voor het
LV-WOZ-koppelvlak is dit minder direct van toepassing omdat de XSD conformiteit afdwingt, maar de
complexiteit manifesteert zich hier in de vorm van implementatieproblemen en het hoge aantal
foutmeldingen.

Zoals beschreven in [Status van de standaarden](#status-van-de-standaarden) wordt StUF wel
onderhouden maar niet doorontwikkeld.

## Het berichtenverkeer

### De MSH als gescheiden component

[Betrouwbare aflevering](#betrouwbare-aflevering) vereist dat berichten niet verloren gaan en dat de
bronhouder zekerheid heeft over de verwerkingsstatus. De ebMS-architectuur vereist een MSH (Message
Service Handler) als apart component dat de protocollogica afhandelt. Dit component is gescheiden
van de WOZ-applicaties en kan intern worden beheerd of uitbesteed aan een externe partij. De
architecturele consequenties zijn in beide gevallen vergelijkbaar.

De scheiding tussen de WOZ-applicaties en de MSH heeft gevolgen voor de end-to-end ketenbeheersing.
De betrouwbaarheidsgarantie van ebMS geldt tussen MSH's, niet tussen applicaties. De WOZ-applicaties
ontvangen van de MSH geen protocolniveau zekerheid dat een bericht de LV-WOZ heeft bereikt en daar
is verwerkt.

Technische fouten (TLS-handshakes, SOAP-validatie, MSH-verwerking) en functionele fouten
(StUF-schemavalidatie, business rules) volgen verschillende paden. Tussen de MSH en de
WOZ-applicaties moeten ebMS-fouten worden vertaald; een specifieke MSH-foutcode wordt daarbij vaak
een generieke foutmelding.

De LV-WOZ genereert maandelijks tussen de 100.000 en 200.000 foutmeldingen. Wanneer de MSH door een
externe partij wordt beheerd, gaan deze foutmeldingen naar die partij en niet rechtstreeks naar de
bronhouder. In de praktijk komen foutmeldingen regelmatig niet op de juiste plek terecht. Het komt
voor dat gemeenten niet doorhebben dat zij niet meer aan de LV leveren, omdat het contact met de
LV-WOZ volledig via de MSH-beheerder verloopt.

### Asynchrone communicatie

De Digikoppeling Koppelvlakstandaard ebMS2 [[DK-EBMS2]] schrijft asynchrone communicatie voor. De
acknowledgement-uitwisseling verloopt via aparte berichten in gescheiden sessies, wat bij hoog
volume aanzienlijke overhead oplevert. Een MSH-acknowledgement bevestigt alleen technische
ontvangst, niet functionele verwerking. Er is geen expliciete bevestiging van succesvolle
verwerking; het uitblijven van een foutmelding geldt als bewijs dat het bericht correct is verwerkt.
Dit maakt de verwerkingsstatus impliciet en daarmee onzeker: de bronhouder kan niet onderscheiden
tussen "succesvol verwerkt" en "foutmelding niet aangekomen", en moet de maximale termijn voor
foutmeldingen afwachten voordat zekerheid bestaat, ook wanneer het bericht vrijwel direct succesvol
is verwerkt.

Foutmeldingen komen asynchroon terug en kunnen uren na verzending binnenkomen. De bronhouder moet
deze asynchrone foutmeldingen correleren aan eerder verzonden berichten, op een moment dat de
oorspronkelijke context mogelijk niet meer beschikbaar is. De combinatie van het grote aantal
acknowledgement-berichten en de asynchrone foutafhandeling kan tot een behoorlijke operationele last
leiden.

### Piekbelasting en berichtgranulariteit

De WOZ-keten kent een sterk seizoenspatroon dat eisen stelt aan de doorvoercapaciteit (zie
[Verwerking bij piekbelasting](#verwerking-bij-piekbelasting)). De huidige architectuur verwerkt
elke gebeurtenis als afzonderlijk dienstbericht. In de beschikkingsperiode betekent dit circa 10
miljoen individuele dienstberichten in 8 weken. Elk dienstbericht doorloopt het volledige
verwerkingsproces: ebMS-handshake, MSH-verwerking, StUF-parsing, validatie van de ingesloten
kennisgevingen, en opslag.

De huidige standaarden ondersteunen geen gestandaardiseerde batch-aanlevering; elk dienstbericht
bevat de kennisgevingen voor één gebeurtenis. Een voordeel hiervan is dat bij foutmeldingen
eenduidige koppeling van individuele foutberichten aan individuele dienstberichten kan plaatsvinden.
De keerzijde is dat elk van de 10 miljoen berichten de volledige protocol-overhead doorloopt.

Bovendien biedt ebMS2 geen mechanisme om vooraf te controleren of de ontvanger beschikbaar is. Bij
onbeschikbaarheid van de LV-WOZ (bijvoorbeeld tijdens gepland onderhoud) gaat elk individueel
bericht in retry, wat bij hoog volume leidt tot grote aantallen identieke foutmeldingen.

### Recovery en ketenrisico

In een asynchrone berichtenketen bevinden zich altijd gegevens in transit. Bij een recovery-scenario
is de ketentoestand verdeeld over meerdere systemen die niet op hetzelfde moment hun backup maken.
Berichten die na de backup zijn verzonden maar voor een storing aankwamen, zitten niet in de backup
van de verzender maar mogelijk wel bij de ontvanger. De MSH-administratie kan inconsistent zijn na
herstel.

## De berichtsemantiek

### Toestandsoverdracht en volgorde-afhankelijkheid

De WOZ-keten is georganiseerd rondom gebeurtenissen die zowel de transactiescope als de aanleiding
voor afnemers definiëren (zie [Gebeurtenisgedreven karakter](#gebeurtenisgedreven-karakter)). De
aanlevering aan de LV-WOZ verloopt via dienstberichten: containers die kennisgevingen bundelen rond
een WOZ-gebeurtenis. Deze gelaagdheid combineert twee niveaus:

| Aspect            | Gebeurtenis-laag (dienstbericht) | Toestand-laag (kennisgeving) |
| ----------------- | -------------------------------- | ---------------------------- |
| **Semantiek**     | Wat er is gebeurd                | Hoe de registratie wijzigt   |
| **Granulariteit** | Eén gebeurtenis                  | Meerdere objectmutaties      |
| **Verwerking**    | Samenhangvalidatie               | Validatie en opslag          |

De LV-WOZ gebruikt het type dienstbericht voor samenhangvalidatie: gegeven het type gebeurtenis
wordt gecontroleerd of de combinatie van ingesloten kennisgevingen een zinvolle interpretatie heeft.
De validatie tegen de huidige toestand vindt plaats op het niveau van de individuele kennisgevingen,
maar de gebeurtenis wordt altijd als geheel verwerkt: als één kennisgeving niet verwerkt kan worden,
wordt het gehele dienstbericht afgewezen.

De kennisgevingen binnen een dienstbericht zijn technisch gezien _state transfer messages_. Een
wijzigkennisgeving bevat zowel de oude situatie als de nieuwe situatie. De standaard biedt de
ontvanger daarmee de mogelijkheid te valideren dat de oude situatie overeenkomt met zijn huidige
toestand; zij schrijft dat niet voor. Het LV-WOZ-koppelvlak maakt van die mogelijkheid gebruik: de
LV valideert de oude situatie, past de wijziging toe, en genereert een foutbericht wanneer de
validatie faalt.

Het invoegen en verschuiven van entries op de materiële tijdlijn is complex in de implementatie en
wordt door betrokkenen aangemerkt als een belangrijke bron van implementatieproblemen. Dit is geen
bijkomend probleem van de standaard, maar de uitwerking van een functionele eis: de
[correctiesemantiek](#correctiesemantiek) en de [bitemporele historie](#bitemporele-historie) vragen
dat historische perioden kunnen worden bijgesteld. Elke standaard die deze eis invult moet hiervoor
een mechanisme bieden. Wat per standaard verschilt, is hoeveel van die complexiteit bij de
bronhouder terechtkomt.

Dit patroon heeft specifieke eigenschappen. Berichten moeten in exacte volgorde worden verwerkt; als
bericht B arriveert vóór bericht A, faalt de validatie. In de praktijk wordt dit probleem
gemitigeerd doordat berichten worden geclusterd binnen gebeurtenissen: een dienstbericht bevat alle
kennisgevingen die bij één gebeurtenis horen. Volgordeproblemen spelen daardoor vooral wanneer
meerdere gebeurtenissen voor hetzelfde object in zeer korte tijd plaatsvinden, bijvoorbeeld bij
"flitsbezwaren" waarbij bezwaar en afhandeling op dezelfde dag worden verwerkt, of bij meerdere
eigenaarswisselingen in korte tijd. Bij een storing kan de wachtrij bovendien zijn volgorde
verliezen, waardoor na herstel berichten in de verkeerde volgorde worden aangeboden. Het tweemaal
verwerken van dezelfde kennisgeving is terecht onmogelijk, omdat de oude situatie niet meer klopt.
ebMS2 biedt duplicaat-eliminatie op transportniveau (de MSH houdt ontvangen MessageIds bij), maar op
applicatieniveau zijn StUF-berichten niet idempotent. Zender en ontvanger moeten exact dezelfde
toestand hebben; divergentie blokkeert verdere verwerking. Dit sluit aan bij de functionele eis dat
de gegevens in de LV-WOZ een conforme kopie zijn van de gegevens in de Basisregistratie WOZ.

De StUF-standaard erkent dit: "StUF ondersteunt niet het gericht corrigeren van een enkel foutief
historisch gegeven." Het huidige koppelvlak kent geen eigen gebeurtenistypen voor correcties; die
zijn ooit gespecificeerd maar nooit geïmplementeerd. Voor het corrigeren van historische gegevens
resteert daarom alleen het synchronisatiebericht: de volledige toestand opnieuw aanleveren. Dit
adresseert de directe inconsistentie, maar niet de onderliggende oorzaak van de divergentie.

### Synchronisatieberichten

StUF voorziet in synchronisatieberichten (Sh-berichten). Zij vervullen in de WOZ-keten twee
verschillende rollen.

De eerste is regulier gebruik op initiatief van de bronhouder. Correcties op historische gegevens
kunnen in het huidige koppelvlak uitsluitend via een synchronisatiebericht worden aangeleverd (zie
[Technische inrichting](#technische-inrichting)). Het merendeel van de synchronisatieberichten wordt
dan ook door de bronhouder verstuurd zonder dat de LV daarom heeft gevraagd. Veelal constateert de
bronhouder zelf, bijvoorbeeld bij de analyse van een foutbericht, dat historische gegevens in de
LV-WOZ niet kloppen, en kan hij dat alleen met een synchronisatiebericht herstellen.

De tweede is herstel na divergentie, waarbij de LV expliciet om een volledig beeld vraagt. Het
Sectormodel beschrijft wanneer de LV-WOZ om synchronisatie vraagt: "als in een dienstbericht een
toevoegkennisgeving of de oude situatie in een wijzigkennisgeving niet overeenkomt met de huidige
situatie in de LV WOZ." De LV-WOZ valideert de kennisgevingen binnen elk aangeleverd dienstbericht
tegen haar eigen toestand, en vraagt om synchronisatie wanneer die toestand niet aansluit.

In beide rollen brengt de implementatie complexiteit met zich mee. Synchronisatieberichten hebben
een geneste structuur met strikte sorteervereisten: alle historische registraties moeten oplopend
gesorteerd zijn op `tijdstipRegistratie`, en binnen één tijdstipRegistratie oplopend op
`beginGeldigheid`. De bronhouder moet de volledige historie kunnen reconstrueren in StUF-formaat,
inclusief de juiste volgorde van registraties. In de praktijk is dit voor veel bronhouders niet
haalbaar; niet alle WOZ-systemen zijn hierop ingericht.

Synchronisatie als herstelmechanisme blijkt vaker nodig dan het ontwerp veronderstelt. De WOZ-keten
opereert daarmee in een hybride model: berichten worden asynchroon verwerkt, maar het protocol
verwacht dat verzender en ontvanger dezelfde toestand hebben. De bronhouder heeft geen mechanisme om
te verifiëren of en wanneer verwerking is voltooid. Wanneer de consistentie-verwachting niet wordt
waargemaakt, valt het systeem terug op volledige synchronisatie.

### De interpretatielast

StUF definieert hoe de bronhouder een bericht moet formuleren bij een bepaalde intentie, maar niet
hoe de ontvanger de intentie moet reconstrueren uit het bericht. Aan de ontvangende kant is de taak
omgedraaid: gegeven een geformuleerd bericht, wat was de intentie? Deze asymmetrie tussen formuleren
en interpreteren is een structureel kenmerk van de standaard.

Het dienstbericht bevat weliswaar een gebeurtenis-indicatie (een van de WOZ-gebeurtenistypen), maar
de feitelijke verwerking bij zowel de LV-WOZ als afnemers vindt plaats op het niveau van de
individuele kennisgevingen: toestandsovergangen per object. Wanneer de relatie tussen de gebeurtenis
op dienstberichtniveau en de kennisgevingen daarbinnen niet eenduidig is, moet de ontvanger zelf
afleiden wat er is gebeurd. Dit speelt vooral bij synchronisatieberichten, waarin de gebeurtenis die
tot de mutatie leidde niet wordt meegegeven.

Daarnaast laat de XSD-validatie op de dienstberichten meer toe dan functioneel is bedoeld. Bij
berichttypen die alleen mogen toevoegen, zoals de nieuwe beschikking, speelt dit niet. Maar de
schema's sluiten correctiekennisgevingen (mutatiesoort F) niet in het algemeen uit, en in de
praktijk sturen bronhouders die ook mee in dienstberichten voor reguliere gebeurtenissen. De
attributen die per dienstbericht zijn toegestaan, zijn gekozen op basis van de gebeurtenis en niet
op basis van een correctie; het bericht drukt dan niet uit wat er functioneel is gebeurd. Het
bedoelde gebruik van de gebeurtenistypen is met het huidige schema niet afdwingbaar.

Ontvangers leiden vervolgens zelf af wat de datamutaties betekenen. Dat elke afnemer daarbij eigen
keuzes maakt is inherent aan de keten: iedere afnemer verwerkt de gegevens voor het eigen
werkproces, en die werkprocessen verschillen. Een nieuwe beschikking kan bij de ene afnemer tot een
nieuwe aanslag leiden, bij de andere tot herziening van een bestaande aanslag, en bij een derde
alleen tot vastlegging voor later gebruik. Uniforme interpretatie is dus geen doel op zich.

Wat wel opvalt, is dat de afleiding die daaraan voorafgaat, namelijk vaststellen wát er is gebeurd,
door iedere ketenpartner opnieuw wordt gedaan. Het dienstbericht draagt de gebeurtenis wel als type
mee, maar de koppeling tussen dat type en de afzonderlijke kennisgevingen daarbinnen is niet
eenduidig; die relatie moet uit de mutaties worden gereconstrueerd. Het probleem wordt versterkt bij
hersynchronisatie: het verschil tussen de vorige aanlevering en een synchronisatiebericht kan het
gevolg zijn van meerdere gebeurtenissen die eerder niet zijn verwerkt. De ontvanger kan dan niet
meer herleiden welke afzonderlijke gebeurtenissen de mutatie hebben veroorzaakt. De
interpretatielast wordt vermenigvuldigd over alle ketenpartners, zonder garantie op consistente
uitkomsten.

## De keteninrichting

### Formele historie

De WOZ-keten vereist [bitemporele historie](#bitemporele-historie); StUF biedt hiervoor een adequate
implementatie. In de inrichting van de keten levert de formele historie echter spanning op.

Bij de inrichting van de LV-WOZ bestond de verwachting dat het moment van registratie in de
Basisregistratie WOZ en registratie in de LV-WOZ slechts marginaal van elkaar zouden verschillen.
Daarom is geen onderscheid gemaakt tussen de formele tijdlijn in de Basisregistratie WOZ en in de
LV-WOZ. De huidige architectuur probeert de formele historie van de bronhouder over te nemen in de
LV-WOZ. Dit vereist dat bronhouders de sequentie van historische registraties kunnen reconstrueren
en in de juiste volgorde versturen. In de praktijk is dit voor veel bronhouders niet haalbaar; niet
alle WOZ-systemen zijn hierop ingericht.

Tegelijkertijd houdt de LV-WOZ geen eigen formele tijdlijn bij. Wat zij uitlevert als "formele
historie" is een reconstructie uit StUF-berichten, niet een registratie van wanneer gegevens bij de
LV beschikbaar kwamen. De kernvraag van afnemers, "Wat wist de LV vier weken geleden?", kan niet
worden beantwoord.

Uit gesprekken met afnemers blijkt dat zij behoefte hebben aan materiële historie (welke gegevens
golden voor een bepaalde periode?) en aan LV-formele historie (wanneer was dit in de LV
beschikbaar?). De eis van formele historie staat daarmee niet ter discussie; de vraag is van wélke
registratie de formele tijdlijn wordt bijgehouden. De formele historie van de bronhouder wordt aan
afnemers doorgeleverd, maar zij kunnen daarmee hun eigen vraag niet beantwoorden: die gaat over het
moment waarop een gegeven voor hén beschikbaar was. De Belastingdienst heeft expliciet behoefte aan
LV-formele historie om de vraag te kunnen beantwoorden: "als ik dit vier weken geleden had
opgevraagd, had ik dit dan ook gezien?" Omdat de LV die vraag op dit moment niet kan beantwoorden,
reconstrueert de Belastingdienst zelf een registratietijdlijn door herhaaldelijk de materiële
historie op te halen en eerdere ophaalresultaten te bewaren. Daarnaast haalt de Belastingdienst
minstens eenmaal per jaar de volledige dataset op om te controleren dat hun kopie overeenkomt met de
LV. De architectuur investeert daarmee in het reconstrueren van een tijdlijn waarmee afnemers hun
eigen vraag niet kunnen beantwoorden, terwijl de tijdlijn die zij daarvoor nodig hebben niet wordt
bijgehouden.

Dat de LV-formele historie voor afnemers zwaarder weegt dan de formele historie bij gemeenten is
geen nieuw inzicht. Het is vastgelegd in het voorstel voor implementatie van het IMWOZ-model dat in
2021 met de ketenpartijen is besproken, maar waarvan de vaststelling destijds is uitgesteld.

### Identificatie van subjecten en relaties

Het koppelvlak vereist eenduidige, persistente identificatie van objecten, subjecten en relaties
(zie [Identificatie en verwijzing](#identificatie-en-verwijzing)).

Het koppelvlak kent meerdere identificatoren voor subjecten naast elkaar: de legacy-combinatie
_sofinummer_ en _aanvulling sofinummer_ (daterend uit de jaren 90, juridisch niet meer bestaand),
moderne identificatoren (BSN, RSIN, vestigingsnummer). Daarnaast zijn er subjecten die niet in een
basisregistratie voorkomen (zoals buitenlandse eigenaren van Nederlands onroerend goed) en waarvoor
geen gestandaardiseerde identificator beschikbaar is. Het ontbreken van één eenduidige identificator
maakt de matching foutgevoelig en genereert tienduizenden foutmeldingen per maand. Een voorbeeld:
een sofinummer-combinatie die jarenlang in gebruik is bij een niet-natuurlijk persoon kan
binnengemeentelijk worden gekoppeld aan een vestiging, terwijl de combinatie zelf ongewijzigd
blijft. De LV-WOZ en afnemers zien dan een typewijziging die niet verklaarbaar is uit de
identificatie. Er lagen voorstellen om tot één identificatiesysteem te komen via een gewijzigd
informatiemodel, maar de vaststelling en implementatie hiervan is in 2021 uitgesteld.

Relaties worden geïdentificeerd door een samengestelde sleutel: de identificatie van het WOZ-object,
de identificatie van het gerelateerde subject, én de `beginRelatie`. Deze identificatie is niet
persistent: een correctie op `beginRelatie` wijzigt de sleutel zelf. Dat is vooral bezwaarlijk
wanneer dezelfde combinatie van object en subject meerdere keren in de tijd voorkomt, bijvoorbeeld
wanneer iemand eigenaar is van 2001 tot 2004 en opnieuw vanaf 2015. Bij een correctie is dan niet
altijd eenduidig welke relatie-instantie wordt bedoeld.

### Kopiegegevens en synchronisatielast

Het koppelvlak draagt naast identificatoren ook kopiegegevens over van authentieke bronregistraties
(naam en adres uit de BRP, vestigingsgegevens uit het Handelsregister), naast gegevens die eigen
zijn aan de WOZ (zoals het correspondentieadres voor een specifiek WOZ-object). De aanwezigheid van
kopiegegevens brengt operationele last met zich mee: wanneer gegevens in een bronregistratie
wijzigen, is het de verantwoordelijkheid van de bronhouder om de kopiegegevens in de LV-WOZ bij te
werken. Tegenover die last staat een functioneel voordeel: doordat naamgegevens in de LV aanwezig
zijn, is zoeken op de naam van een subject mogelijk zonder bevraging van een andere registratie. De
LV-WOZ houdt subjectgegevens per bronhouder bij; er vindt geen de-duplicatie over bronhouders heen
plaats. Dezelfde persoon kan daardoor door meerdere gemeenten met verschillende gegevens zijn
geregistreerd. Voor niet-ingezetenen is de WOZ soms de enige plek waar deze gegevens zijn
vastgelegd, waardoor de kopiegegevens daar niet redundant zijn.

### Terugmeldingen

De LV-WOZ beschikt over een terugmeldfaciliteit op basis van het DMKS-protocol (Digikoppeling,
XML-gebaseerd). Er is geen gebruikersinterface aan de LV-kant; alle gebruikersinterfaces moeten bij
de gemeente worden gebouwd. Er is ook geen aansluiting op de Digimelding Dienst van Logius. Dit
betekent dat de terugmeldfaciliteit in de praktijk beperkt wordt gebruikt.

### Positie van de Landelijke Voorziening

De LV-WOZ ontvangt berichten van honderden bronhouders, elk met eigen systemen, processen en
interpretaties. De verantwoordelijkheid voor de kwaliteit van die gegevens ligt bij de bronhouder,
zoals bij alle decentrale basisregistraties. Kenmerkend voor de LV-WOZ is dat daarbovenop diverse
ingangscontroles zijn gedefinieerd, juist om de kwaliteit voor afnemers te optimaliseren.

Die controles hebben wel een grens. De LV toetst wat in het bericht zichtbaar is, tegen de
specificatie en tegen haar eigen vastlegging, maar kan niet vaststellen of een aangeleverd gegeven
met de werkelijkheid overeenkomt. Ook de volgorde waarin berichten binnenkomen ligt buiten haar
invloed, en de mogelijkheden om terug te communiceren zijn beperkt tot foutberichten en de
terugmeldfaciliteit. Wanneer een bronhouder geen sluitende formele historie aanlevert, kan de LV die
niet aanvullen.

### Validatie versus divergentie

[Consistentievalidatie](#consistentievalidatie) is een functionele eis: gegevens die de LV-WOZ
doorlevert moeten intern consistent zijn. Tegelijkertijd is elke validatie die de LV doet potentieel
een oorzaak van een verschil tussen de LV en de gemeentelijke registratie. De gemeente heeft immers
al besloten dat de data correct is. Wanneer de LV vervolgens afkeurt, ontstaat er een verschil dat
kan groeien als er vervolgberichten worden verstuurd die uitgaan van succesvolle verwerking.

Hier spelen twee conflicterende principes. Enerzijds verhoogt validatie de kwaliteit voor afnemers,
met name ook vanuit de afnemers is er de wens om meer te valideren. Anderzijds vergroot validatie
het risico op afwijkingen tussen LV en bron, wanneer de bron onvoldoende reageert op de
foutberichten die de validaties genereren.

In het WOZ-domein leiden gegevens bij afnemers tot processen met directe financiële gevolgen voor
belastingplichtigen. Afnemers hechten daarom grote betekenis aan consistentievalidatie van gegevens
op basis van de gebeurtenissen.

### Doorlevering aan afnemers

De keten moet afnemers tijdig informeren over wijzigingen (zie
[Notificatie van afnemers](#notificatie-van-afnemers)) en daarbij per afnemer bepalen welke gegevens
worden verstrekt (zie [Autorisatie op attribuutniveau](#autorisatie-op-attribuutniveau)). De LV-WOZ
stuurt via Digilevering [[DIGILEVERING-WOZ]] in de LV-WOZ verwerkte berichten door naar afnemers,
met filtering per afnemertype. De LV-WOZ voegt geen informatie toe, maar vervult wel een actieve
mediërende rol tussen bronhouders en afnemers.

De LV-WOZ investeert aanzienlijk in het correct interpreteren van inkomende berichten: pattern
matching op datamutaties, reconstructie van formele historie, samenhangvalidatie op
dienstberichtniveau. De huidige architectuur voorziet er echter niet in om het resultaat van deze
interpretatie door te geven aan afnemers; in plaats daarvan wordt het oorspronkelijke bronbericht
doorgestuurd. Elke afnemer moet daardoor opnieuw uit de mutaties afleiden wat er is gebeurd, voordat
de eigen verwerking kan beginnen. Dat afnemers die verwerking verschillend inrichten is inherent aan
hun uiteenlopende werkprocessen; dat zij allemaal dezelfde afleiding vooraf moeten doen, is dat
niet.

Digilevering biedt filtering op postcodegebied of gemeente, maar geen inhoudelijke filtering op wat
er is gewijzigd. Bij herstelacties ontvangen afnemers grote aantallen berichten waarin voor hen geen
nieuwe informatie staat. De Belastingdienst geeft aan soms gegevens te ontvangen die zij niet wil
hebben: data ouder dan zes jaar (buiten de belastingtermijn) wordt actief opgeschoond, maar via
informatierijke notificaties wordt deze ongewenst opnieuw aangeleverd. Een wijziging in het
aanleveringsformaat vereist gelijktijdige aanpassingen bij alle afnemers; elke verandering heeft een
domino-effect door de hele keten.

## Conclusie

De beschreven knelpunten hangen samen en zijn voor een groot deel niet uniek voor de WOZ. Ze vloeien
voort uit een spanningsveld dat speelt bij elke registratie die op ebMS2 en StUF is gebaseerd: de
standaarden bieden functionaliteit, maar de complexiteit leidt ertoe dat organisaties constructies
kiezen waarbij die functionaliteit deels verloren gaat.

De transportlaag (ebMS2) vereist een MSH als gescheiden component, waardoor end-to-end zicht op
afleveringsstatus en verwerking niet volledig wordt gerealiseerd. De inhoudslaag (StUF-WOZ) biedt
een adequate implementatie van de functionele eisen, maar de complexiteit van de standaard en de
afnemende beschikbaarheid van specialistische kennis zetten de onderhoudbaarheid onder druk.

De keteninrichting kent spanningen op het vlak van formele historie (de LV reconstrueert
bronhouder-historie waarmee afnemers hun eigen vraag niet kunnen beantwoorden), identificatie
(meerdere identificatiesystemen naast elkaar) en doorlevering aan afnemers (interpretatielast wordt
vermenigvuldigd door de keten).

Langs de drie lijnen uit de inleiding van dit hoofdstuk vallen de knelpunten als volgt uiteen:

- **Aan de standaard gebonden**: de MSH-architectuur, het CPA-beheer, de asynchrone foutafhandeling,
  het ontbreken van gestandaardiseerde batchaanlevering en de afnemende beschikbaarheid van
  specialistische kennis. Deze kunnen met een andere standaardkeuze anders uitpakken.
- **Aan de functionele eisen gebonden**: het bijstellen van historische perioden, het onderscheid
  tussen wijziging en correctie, de samenhangbewaking over mutaties binnen één gebeurtenis en de
  eenduidige identificatie van objecten, subjecten en relaties. Deze blijven bestaan en moeten in
  elke inrichting worden uitgewerkt.
- **Aan ontwerpkeuzes in de keteninrichting gebonden**: welke formele tijdlijn de LV bijhoudt, of de
  LV haar interpretatie meegeeft aan afnemers, waar de grens van afkeuring ligt, welke kopiegegevens
  worden meegestuurd en hoe de terugmeldfaciliteit is ingericht. Deze staan los van de standaard en
  kunnen ook zonder standaardwissel worden herzien.

Deze indeling is bepalend voor de beoordeling van de alternatieven: een standaardwissel adresseert
de eerste categorie en laat de tweede onaangeroerd. De derde categorie vraagt om afspraken in de
keten, niet om een andere standaard.

Het volgende hoofdstuk analyseert of de transitie naar ebMS3/AS4 de aan de standaard gebonden
knelpunten kan adresseren.
