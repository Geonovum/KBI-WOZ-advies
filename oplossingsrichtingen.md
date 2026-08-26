# Oplossingsrichtingen

De oplossingsrichtingen in dit hoofdstuk zijn verkennend.
[Leveren en overeenstemmen](#leveren-en-overeenstemmen) en
[Synchroon aanleveren en verwerken](#synchroon-aanleveren-en-verwerken) zijn verder uitgewerkt; de
overige secties schetsen alleen de afweging.

Beide uitgewerkte richtingen staan los van elkaar. Het historiemodel werkt met de huidige asynchrone
keten; het synchrone koppelvlak werkt met het huidige historiemodel. XML of REST bepaalt niet de
inhoud van het historiemodel. De richtingen zijn daarmee afzonderlijk te beoordelen en gefaseerd in
te voeren.

## Leveren en overeenstemmen

De LV-WOZ kan worden ingericht rond de wettelijke begrippen leveren en overeenstemmen, in plaats van
rond het strengere uitgangspunt "conforme kopie" van het huidige ontwerp. De functionele eisen, in
het bijzonder die voor afnemers, blijven het [toetsingskader](#functionele-kaders); wat verandert,
is hoe de LV ze invult.

### Aanleiding

De huidige inrichting hanteert [conforme kopie als uitgangspunt](#conforme-kopie-als-uitgangspunt)
voor het gegevensbeheer: de gegevens in de LV-WOZ moeten een volledige kopie zijn van de gegevens in
de gemeentelijke administratie. Dit uitgangspunt staat op gespannen voet met twee aspecten van de
huidige praktijk.

- De LV-WOZ legt geen 1-op-1 spiegel vast van de gemeentelijke registratie. Zij reconstrueert
  formele historie uit binnenkomende mutaties en leidt afgeleide tijdlijnwaarden af zoals begin- en
  eindgeldigheden. Daar komt bij dat niet alle bronhouders in staat zijn om historische registraties
  in de juiste sequentie aan te leveren; de LV kan in die gevallen geen sluitende reconstructie
  opbouwen (zie [Formele historie](#formele-historie)).
- Validatie en afkeuring door de LV zijn onderdeel van het bestaande ontwerp. Elk afgekeurd bericht
  creëert per definitie een verschil tussen wat de gemeente heeft geregistreerd en wat de LV heeft
  vastgelegd (zie [Validatie versus divergentie](#validatie-versus-divergentie)).

Beide observaties wijzen op een onderliggend spanningsveld: een conforme kopie en strikte validatie
kunnen niet beide volledig worden gerealiseerd. Validatie creëert verschillen waar zij afkeurt;
reconstructie creëert een vastlegging die structureel verschilt van de bronregistratie.

Een herformulering van het ontwerpuitgangspunt adresseert dit spanningsveld zonder de eisen voor
afnemers te wijzigen.

### Wettelijke basis

De [wettekst](#wettelijk-kader) spreekt van leveren en overeenstemmen, niet van een identieke
vastlegging of een 1-op-1 kopie. Een [conforme kopie](#conforme-kopie-als-uitgangspunt) tussen LV en
bronhouder is daarmee een ontwerpinvulling, geen wettelijke eis.

De Wet WOZ ontstond vóór de invoering van de LV; de LV is later in een zo beperkt mogelijke
wetswijziging toegevoegd. De wet is daarmee niet vanaf de grond op het LV-concept geschreven, wat
mede verklaart dat zij de rol van de LV niet uitputtend uitwerkt. Een herformulering van het
ontwerpuitgangspunt vraagt geen wetswijziging.

### Voorgesteld model: leveren, vastleggen, overeenstemmen

Het voorstel bouwt de invulling van "leveren" en "overeenstemmen" op uit drie samenhangende
ontwerpkeuzes: leveren als gebeurtenis met enkel de nieuwe toestand, vastleggen als stapel
leveringen, en overeenstemmen via projecties. Het historiemodel volgt uit het stapelpatroon, en het
stapelpatroon werkt alleen als de gemeente gebeurtenis-gestuurd aanlevert.

#### 1. Leveren als gebeurtenis met enkel de nieuwe toestand

Het huidige koppelvlak is al gestructureerd rond [gebeurtenissen](#gebeurtenisgedreven-karakter).
Een dienstbericht bundelt kennisgevingen rond één WOZ-gebeurtenis: nieuwe beschikking, uitspraak op
bezwaar, opvoeren of beëindigen van een WOZ-object. De huidige schema's zijn echter generiek; ze
laten kennisgevingen toe die geen relatie hebben met de functionele intentie van de gebeurtenis. Het
voorstel sluit deze ruimte: gebeurtenistypen worden strakker afgebakend, en kennisgevingen dragen
enkel de nieuwe toestand. Het strakker definiëren van de gebeurtenistypen, zodanig dat
kennisgevingen niet langer kunnen meelopen die niets met de gebeurtenis te maken hebben, moet nog
worden uitgewerkt.

- Een levering bestaat uit één gebeurtenis omvattende één of meer kennisgevingen. Elke kennisgeving
  draagt een feit over een specifiek object met een eigen materiële periode. Kennisgevingen kunnen
  alleen binnen een gebeurtenis bestaan; deze samenhang is randvoorwaardelijk voor
  consistentiebewaking.
- Een gebeurtenis is atomair. Zij wordt in haar geheel verwerkt of in haar geheel afgewezen, ook als
  slechts één van de kennisgevingen niet verwerkbaar is. Dit uitgangspunt bewaakt dat afnemers nooit
  op een onvolledig samengesteld feitenblok bouwen.
- Een kennisgeving draagt enkel de nieuwe toestand voor de betreffende periode, geen oud-nieuw paar.
  De gemeente levert wat zij wil zeggen ("dit is de waarheid voor periode X"), niet hoe haar
  registratie van toestand A naar toestand B is overgegaan.
- Een correctie wordt als eigen gebeurtenistype gemodelleerd; het onderscheid tussen wijziging en
  [correctie](#correctiesemantiek) is daarmee expliciet, niet langer iets wat afnemers uit patronen
  in datamutaties moeten afleiden.

"Oud" betekent niet hetzelfde bij gemeente, LV en afnemer; elke partij voert een eigen registratie
met eigen interpretatie-logica. Verschillen in een meegestuurd oud-nieuw paar leiden tot afkeur of
tot interpretatieonzekerheid bij afnemers. Door alleen de nieuwe toestand te leveren, vervalt deze
divergentie-bron. De juistheid van de materiële historie wordt daarmee niet langer impliciet via het
oud-nieuw paar bewaakt; die borging verschuift naar de bronhouder en naar terugmelding achteraf.

#### 2. Vastleggen als stapel leveringen

De gemeente levert wat materieel geldt voor een periode; de LV legt vast wanneer welke levering is
verwerkt en beschikbaar gemaakt, en bouwt daaruit een eigen registratietijdlijn op. Het bestand
groeit aan; eerdere uitspraken worden niet overschreven of verwijderd.

De vastlegging vormt niet één doorlopende stapel, maar is opgedeeld per beschikkingsjaar: het
belastingjaar waarvoor een WOZ-waarde geldt. Elk beschikkingsjaar heeft een eigen waardepeildatum
en daarmee een eigen stapel leveringen met een eigen registratietijdlijn. Elke levering hoort bij
een specifiek beschikkingsjaar; de regel "meest recente uitspraak telt" en de projecties (zie
hierna) werken binnen die partitie.

- Elke levering krijgt een tijdstip waarop zij door de LV is verwerkt en beschikbaar gemaakt voor
  bevraging. Deze reeks vormt een eigen registratietijdlijn (formele tijdlijn) van de LV, los van de
  formele tijdlijn van de bronhouder. De materiële tijdlijn (geldigheidstijdlijn) blijft bij de
  bronhouder en wordt aangeleverd aan de LV. Zie ook [Bitemporele historie](#bitemporele-historie)
  en [Formele historie](#formele-historie).
- Bij overlap in materiële geldigheid telt de meest recente uitspraak van de gemeente. De LV
  manipuleert geen eindgeldigheden of tijdlijnposities; zij legt het feit van de uitspraak vast.
- Een vervangende gebeurtenis vervangt eerdere uitspraken voor dezelfde materiële periode en
  hetzelfde feit, zonder dat de gemeente naar een specifieke eerdere uitspraak hoeft te verwijzen.
  De LV-formele timestamp bepaalt de volgorde: de meest recent vastgelegde uitspraak telt voor de
  betreffende combinatie van periode en feit.
- De gemeente kan binnen geldende termijnen met een nieuwe levering bijsturen. Zij hoeft historische
  registraties niet te reconstrueren in een specifieke sequentie (geen synchronisatie).
- De LV reconstrueert de bronhouder-formele tijdlijn niet. De Belastingdienst heeft expliciet
  behoefte aan LV-formele historie ("wanneer wist de LV iets?") en reconstrueert die op dit moment
  zelf, omdat de LV deze niet bijhoudt (zie [Formele historie](#formele-historie)).
- Formele-tijdlijngegevens van de bronhouder kunnen wel worden meegeleverd en door de LV als
  doorgeefluik aan afnemers worden doorgeleverd. De LV reconstrueert die tijdlijn echter niet en
  bewaakt haar niet (voor zover dat al mogelijk zou zijn).

Het bestaan van de leveringenstapels en de ordening daarop (welke uitspraak telt) is een
ketenafspraak; hoe het Kadaster die stapels fysiek opslaat en bevraagbaar maakt (datamodel,
indexering, performance) is een implementatiekeuze waarover geen ketenafspraken nodig zijn. Dit
wat/hoe-onderscheid keert terug bij de projecties hieronder.

#### 3. Overeenstemmen via projecties

Verstrekkingen aan afnemers worden afgeleid uit de leveringenstapel via projecties. De huidige
LV-bevragingen (peildatum materieel, peildatum formeel) zijn al projecties op een onderliggende
vastlegging; wat verandert is de structuur waaruit de projectie wordt afgeleid (een leveringenstapel
in plaats van een gereconstrueerde toestandsregistratie). Voor afnemers blijft het
vraag-antwoord-patroon hetzelfde.

- Een projectie beantwoordt een specifieke vraag (wat was de waarde op peildatum P? wat wist de LV
  op tijdstip T?) op basis van dezelfde basisfeiten.
- Verschillende afnemers krijgen verschillende projecties, afgestemd op hun informatiebehoefte,
  zonder dat zij de onderliggende leveringen zelf hoeven te interpreteren.
- Een [beschouwingsmoment](#herhaalbaarheid-en-beschouwingsmoment) op de projectie maakt herhaalbare
  bevraging mogelijk: dezelfde vraag met hetzelfde beschouwingsmoment levert hetzelfde antwoord op.
  Een beschouwingsmoment omvat naast een tijdstip ook de versie van de bevragingssoftware; een
  tussentijdse softwarewijziging die de afleiding raakt kan anders alsnog tot een ander antwoord
  leiden. De operationele invulling van versiebepaling (welke softwarecomponenten meetellen, hoe
  versies traceerbaar blijven) vraagt nadere uitwerking.

De "wat" van projecties (welke projecties beschikbaar zijn, welke informatie zij dragen, welke
toezeggingen rond herhaalbaarheid gelden) is een ketenkeuze die met afnemers wordt afgesproken. De
"hoe" van de afleiding (hoe de LV een projectie materialiseert, cachet of in real-time berekent) is
een implementatiekeuze van het Kadaster.

Het verschil met "conforme kopie" zit in het loskoppelen van inhoudelijke overeenstemming en een
1-op-1 technische vastlegging.

### Verantwoordelijkheid en uitvoering van kwaliteitscontrole

De wettelijke verantwoordelijkheid voor de juistheid van WOZ-gegevens ligt bij de bronhouder. In de
huidige inrichting voert de LV daarvan echter een deel namens de keten uit: in de
uitwissel-standaard fungeert oud-nieuw als impliciete kwaliteitscheck, en de LV-validatie keurt
berichten af bij functionele afwijkingen. Verantwoordelijkheid en uitvoering liggen daarmee niet op
dezelfde plek.

Het voorgestelde model brengt beide weer bij elkaar bij de bronhouder. De LV beperkt zich tot afkeur
waar zij haar verstrekkingstaak niet kan uitvoeren; functionele afwijkingen verschuiven van "afkeur
vooraf via een gedeelde standaard" naar "terugmelding achteraf via een gerichte faciliteit", gericht
aan de partij die ze kan oplossen. De LV-rol beperkt zich daarmee tot registratie en verstrekking;
kwaliteitsbewaking namens de keten valt weg.

Voor afnemers is deze verschuiving alleen acceptabel als de terugmeldfaciliteit op die rol berekend
is; zie ook [Validatiestrategie](#validatiestrategie).

### Welke knelpunten dit (deels) oplost

Het model raakt de volgende [knelpunten](#knelpunten) (indicatief; sommige verschuiven of
verminderen, niet alle verdwijnen):

- **[Toestandsoverdracht en volgorde-afhankelijkheid](#toestandsoverdracht-en-volgorde-afhankelijkheid)**:
  een levering bevat de nieuwe toestand voor een periode, niet de combinatie oud-nieuw. De validatie
  tegen een meegestuurde "oude situatie" vervalt, en daarmee een belangrijke bron van
  afkeurmeldingen die ontstaat wanneer de LV-toestand afwijkt van wat de bronhouder veronderstelt.
- **[Synchronisatieberichten als herstelmechanisme](#synchronisatieberichten-als-herstelmechanisme)**:
  in de huidige inrichting fungeren synchronisatieberichten als noodgreep voor divergentie en als
  terugvaloptie voor correcties op historische gegevens. In het voorgestelde model is een nieuwe
  levering het normale mechanisme om een eerdere uitspraak bij te stellen. Een gebeurtenistype dat
  de volledige materiële tijdlijn bevat zou daarmee gebruikt kunnen worden om divergentie op te
  lossen.
- **[Interpretatielast](#de-interpretatielast)**: drie mechanismen verminderen de afleidingstaak in
  de keten. (1) De gebeurtenis wordt expliciet bij elke levering meegegeven; pattern-matching op
  datamutaties om af te leiden wat er is gebeurd, vervalt. (2) Correcties krijgen een eigen
  gebeurtenistype, zodat afnemers in een "nieuwe beschikking"-bericht niet meer hoeven te scannen op
  meegekomen correcties die een herziening (in plaats van een nieuwe aanslag) vereisen. (3) De LV
  doet de afleiding eenmalig en levert het resultaat als projectie; de noodzaak voor elke afnemer om
  dezelfde afleiding zelfstandig uit te voeren vervalt, en daarmee ook het risico op afwijkende
  interpretaties tussen ketenpartners.
- **[Formele historie](#formele-historie)**: de LV bouwt een eigen formele historie ("wanneer was
  een uitspraak verwerkt en beschikbaar in de LV") in plaats van de bronhouder-formele historie te
  reconstrueren. Dit beantwoordt de behoefte van afnemers zoals de Belastingdienst en neemt de eis
  weg dat bronhouders historische registraties in een specifieke sequentie aanleveren.
- **[Positie van de Landelijke Voorziening](#positie-van-de-landelijke-voorziening)**: de LV-rol
  wordt scherper afgebakend. De LV legt vast wat geleverd is en levert projecties aan afnemers, in
  plaats van een 1-op-1 spiegel van honderden bronhouders te onderhouden. De controle op
  gebruikbaarheid (de LV accepteert geen aanlevering waar afnemers niets mee kunnen) blijft staan.
- **[Validatie versus divergentie](#validatie-versus-divergentie)**: door afkeuring te beperken tot
  gevallen waarin de LV haar verstrekkingstaak niet kan uitvoeren, neemt het aantal momenten af
  waarop validatie zelf divergentie creëert. Functionele afwijkingen die voorheen tot afkeur
  leidden, verschuiven naar terugmelding achteraf; zie
  [Verantwoordelijkheid en uitvoering van kwaliteitscontrole](#verantwoordelijkheid-en-uitvoering-van-kwaliteitscontrole)
  en [Validatiestrategie](#validatiestrategie). Het netto-effect op het afkeurvolume voor afnemers
  blijft beperkt: de huidige afkeurgronden zijn overwegend gebaseerd op de nieuwe helft van het
  oud-nieuw paar, niet op de oude.
- **[Doorlevering aan afnemers](#doorlevering-aan-afnemers)**: het patroon waarin de LV
  bronberichten doorstuurt en afnemers dezelfde interpretatie opnieuw uitvoeren, kan vervallen zodra
  afnemers projecties afnemen. Inhoudelijke filtering die in de huidige Digilevering ontbreekt
  (bijvoorbeeld op leeftijd of op gewijzigde attributen) wordt mogelijk via afnemerspecifieke
  projecties. Notificatie aan afnemers (het patroon van Digilevering) is een afzonderlijk vraagstuk
  dat losstaat van de bevraging via projecties.
- **[Correctiesemantiek](#correctiesemantiek)**: doordat correcties een eigen gebeurtenistype
  krijgen, is het onderscheid tussen wijziging en correctie niet langer iets wat afnemers uit
  patronen in datamutaties moeten afleiden.

## Synchroon aanleveren en verwerken

De uitwisseling tussen bronhouder en LV-WOZ kan worden teruggebracht tot één synchrone interactie.
Dit voorstel is op zichzelf inzetbaar; het werkt zowel met de huidige asynchrone leveringen als met
het [model voor leveren en overeenstemmen](#leveren-en-overeenstemmen) (waarin een levering bestaat
uit één gebeurtenis met één of meer kennisgevingen).

### Aanleiding

In de huidige inrichting verloopt aanlevering via een keten van asynchrone componenten:
WOZ-applicatie, MSH bij de bronhouder, MSH bij de LV, LV-applicatie. De Digikoppeling
Koppelvlakstandaard ebMS2 schrijft [asynchrone communicatie](#asynchrone-communicatie) voor.
Ontvangstbevestiging en verwerkingsresultaat lopen via gescheiden berichten in afzonderlijke
sessies.

Dit patroon kent een aantal terugkerende knelpunten:

- **Bevestiging dekt geen functionele verwerking.** Een MSH-acknowledgement bevestigt technische
  ontvangst, niet verwerking; de WOZ-applicatie ontvangt geen protocolniveau zekerheid dat het
  bericht de LV heeft bereikt en daar verwerkt is. Het uitblijven van een foutmelding geldt als
  impliciet bewijs van succes, met een wachttermijn tot zekerheid bestaat (zie
  [De MSH als gescheiden component](#de-msh-als-gescheiden-component)).
- **Asynchrone foutafhandeling met identificatie-onzekerheid.** Foutmeldingen kunnen uren na
  verzending binnenkomen. ebMS-Message-ID's en StUF-referentienummers worden in de praktijk niet
  altijd consistent gekoppeld; correlatie met het oorspronkelijke bericht is daardoor moeizaam,
  zeker als de context bij de bronhouder niet meer beschikbaar is.
- **Geen mechanisme voor beschikbaarheid vooraf.** ebMS2 controleert niet of de LV bereikbaar is
  voordat een bericht wordt verstuurd. Bij netwerkstoringen of LV-onbeschikbaarheid leidt dit tot
  retries op individuele berichten, vooral in piekperiodes (zie
  [Piekbelasting en berichtgranulariteit](#piekbelasting-en-berichtgranulariteit)).

### Voorgesteld model: één synchrone uitwisseling

De interactie tussen bronhouder en LV bestaat uit één HTTP-aanroep waarbij levering en
verwerkingsresultaat samenvallen. Het model bouwt op drie samenhangende ontwerpkeuzes.

#### 1. Eén uitwisseling, één antwoord

- De bronhouder verzendt een levering via een HTTP-aanroep aan de LV.
- De LV verwerkt de levering binnen die aanroep en geeft het verwerkingsresultaat als respons.
- Een HTTP 2xx-respons betekent dat de levering is geaccepteerd en in de LV-stapel is vastgelegd.
  Zichtbaarheid in projecties volgt uit de afspraken rond projectie-materialisatie. Een 4xx-respons
  geeft aan dat het bericht in deze vorm niet geaccepteerd is (validatie, conflict of autorisatie),
  met reden. Een 5xx-respons of uitblijvend antwoord betekent dat de verwerkingsstatus onbepaald is;
  de bronhouder kan opnieuw aanbieden met dezelfde `Idempotency-Key`.

Het onderscheid tussen ontvangstbevestiging en verwerkingsresultaat vervalt. De bronhouder krijgt
direct zekerheid over de verwerkingsstatus; wachten op een afzonderlijk asynchroon foutbericht is
niet meer nodig.

Aan de zijde van de LV vervalt de noodzaak om een endpoint bij de bronhouder te kennen. Voor het
leveringkanaal verloopt de communicatie eenrichting: de bronhouder vraagt, de LV antwoordt.
Terugmelding van afnemerssignalen naar bronhouders verloopt via de aparte terugmeldfaciliteit.

#### 2. Asynchroniteit bij de bronhouder

Asynchroniteit verdwijnt niet uit de keten; zij komt onder de bronhouder te liggen.
Onbeschikbaarheid van de LV, retry-strategieën en piekplanning vallen daarmee onder de bronhouder,
en aanlevering aan de LV is niet blokkerend voor gemeentelijke werkprocessen. De invulling (lokale
buffer, periodieke verzending, batchverwerking, wachtrij) is een implementatiekeuze.

Voor kleine bronhouders en hun leveranciers is dit een wezenlijke verschuiving: lokale buffering,
retry-logica en piekplanning komen onder eigen beheer, in plaats van bij de MSH.

#### 3. Idempotentie

Bij netwerkonzekerheid of timeouts kan een bronhouder twijfelen of een levering is aangekomen. Het
koppelvlak is daarom idempotent ingericht.

- Elke HTTP-aanroep wordt voorzien van een `Idempotency-Key`-header met een unieke waarde van de
  bronhouder. Het opnieuw aanbieden met dezelfde sleutel levert hetzelfde antwoord op, zonder
  dubbele verwerking.
- Elke levering houdt daarnaast haar eigen identificatie ten behoeve van tracering en correlatie met
  de respons.
- Bij een uitgebleven respons kan de bronhouder via een GET-bevraging vaststellen wat de LV heeft
  vastgelegd.
- Een 2xx-respons betekent dat bron en LV voor de geleverde gebeurtenis inhoudelijk overeenstemmen.
  Divergentie ontstaat niet door uitwissel-onzekerheid; alleen afkeur of softwarefout kan haar
  veroorzaken.

### Capaciteitsbeheersing

De LV beheerst capaciteit via standaard HTTP-mechanismen.

- Limieten worden per aansluiting gedefinieerd en gecommuniceerd via HTTP-headers, conform de NL API
  Design Rules [[ADR]] en de geldende RFC's voor rate limiting.
- Bij overschrijding wordt het bericht afgewezen met statuscode `429 Too Many Requests`. Bij
  geplande onbeschikbaarheid kan de LV een `503 Service Unavailable` retourneren met een
  `Retry-After`-header.
- De bronhouder gebruikt de respons-headers om het verzendtempo te dempen, in plaats van blind te
  herhalen na een netwerkfout.

Dit past binnen het Digikoppeling REST-profiel [[DK-RESTAPI]] en vervangt WOZ-specifieke afspraken
over piekverwerking door breed toegepaste standaarden.

### Verantwoordelijkheid en herstel

De verantwoordelijkheidsverdeling is in dit model expliciet:

- **Bij de bronhouder.** Tijdige en volledige aanlevering, bestand zijn tegen LV-onbeschikbaarheid,
  capaciteitslimieten respecteren, en het afleverbewijs ontlenen aan de HTTP-respons.
- **Bij de LV.** Beschikbaarheid binnen het overeengekomen serviceniveau, behoud van iedere
  bevestigde levering ook bij incidenten, recovery via backups en replica's, en heldere
  capaciteitscommunicatie.

Op het moment dat een transactie met een HTTP 2xx-respons is bevestigd, ligt de verantwoordelijkheid
voor het behoud van die data bij de LV. Hoe de LV dit invult (replicatie, persistente buffer voor
herverwerking, point-in-time recovery) is een interne implementatiekeuze.

### Batchaanlevering als optimalisatie

Het basismodel hanteert één levering per HTTP-aanroep. Bij piekbelasting (circa 10 miljoen berichten
in 8 weken) leidt dit tot een groot aantal individuele aanroepen, elk met eigen TLS- en
HTTP-overhead, en bij de LV tot evenveel afzonderlijke transacties. Batchaanlevering bundelt
meerdere zelfstandige leveringen in één HTTP-aanroep en kan zowel de transportoverhead als het
aantal LV-transacties reduceren.

Voor de verhouding met de overige keuzes in dit model geldt:

- **Idempotentie op aanroepniveau.** De `Idempotency-Key`-header geldt voor de batch als geheel; de
  levering-identificaties dienen alleen om respons-uitkomsten aan individuele leveringen te
  koppelen.
- **Verwerkingsresultaten op leveringsniveau.** De respons rapporteert per levering een uitkomst
  (geaccepteerd, afgewezen met reden, of fout). De HTTP-statuscode op batch-niveau geeft de uitkomst
  van de batchverwerking als geheel.
- **Geordende transportbundel.** De batch is geen transactie; elke levering wordt afzonderlijk
  verwerkt en krijgt een eigen uitkomst. De volgorde binnen de batch is wel significant: de LV
  verwerkt leveringen in payload-volgorde, zodat onderling afhankelijke leveringen (bijvoorbeeld een
  opvoer-gebeurtenis gevolgd door een beschikking voor hetzelfde object, of een beschikking gevolgd
  door een correctie daarop) in één batch kunnen worden meegestuurd.

De keuze om de batch geen transactie te laten zijn rust op drie samenhangende overwegingen.

- **Referentiële integriteit dwingt causale samenhang al af.** Een beschikking die verwijst naar een
  nog niet bestaand object faalt automatisch, zodat expliciete rollback voor afhankelijke gevallen
  niets toevoegt.
- **Atomair gedrag zit op gebeurtenisniveau, niet op batchniveau.** Groepen die wel als één geheel
  verwerkt moeten worden, passen binnen één levering: het
  [voorgestelde model](#leveren-en-overeenstemmen) laat meerdere kennisgevingen per gebeurtenis toe,
  zodat een fusie van WOZ-objecten één levering is in plaats van drie leveringen die transactioneel
  gekoppeld moeten worden.
- **Foutmarge in piekperiode maakt rollback ongewenst.** Bij een baseline-foutmarge van enkele
  procenten in piekperiode zou transactionele rollback regelmatig leiden tot het terugdraaien van
  overwegend valide leveringen.

Hier staat een toename in complexiteit van foutafhandeling tegenover. De huidige granulariteit (één
bericht, één foutmelding) maakt foutkoppeling eenvoudig (zie
[Piekbelasting en berichtgranulariteit](#piekbelasting-en-berichtgranulariteit)). Bij batches moet
de respons per levering worden geïnterpreteerd, en moet de bronhouder retries kunnen toepassen op
het deelresultaat in plaats van op het geheel. Partial-success-semantiek vraagt expliciete afspraken
over wat een batch "geaccepteerd" maakt: alle leveringen succesvol, een minimumaandeel, of altijd
een 2xx met fouten in de respons.

Een bijkomend aspect is het sneeuwbaleffect van de volgorde-afhankelijkheid: faalt een vroege
levering in een keten, dan falen de afhankelijke leveringen mee. Of bronhouders een batch daarom
liever als één transactie (alles-of-niets) behandelen, is een open afweging tegenover de drie
hierboven genoemde overwegingen tegen transactioneel gedrag.

Een synchroon koppelvlak werkt zowel met als zonder batch; batchondersteuning is een uitbreiding
boven op het basismodel. Open punten zijn de afweging tussen transportoverhead en
foutafhandelingsgemak, de semantiek van partial success, de behandeling van een herziene batch met
dezelfde `Idempotency-Key`, en de vraag of een batch voor bronhouders transactioneel zou moeten
zijn.

### Welke knelpunten dit (deels) oplost

- **[De MSH als gescheiden component](#de-msh-als-gescheiden-component)**: in een synchroon
  HTTP-koppelvlak vervalt de noodzaak voor een aparte MSH met eigen levenscyclus en eigen
  betrouwbaarheidsgaranties. De afleveringsstatus volgt direct uit de HTTP-respons. Daarmee
  verdwijnt ook de identificatiemismatch tussen ebMS-Message-ID en StUF-referentienummer die in de
  huidige keten lastig te koppelen is; één identificatie per levering, doorgegeven en teruggekoppeld
  in HTTP-headers, volstaat.
- **[Asynchrone communicatie](#asynchrone-communicatie)**: ontvangstbevestiging en
  verwerkingsresultaat worden samengevoegd. De maximale wachttermijn voor het uitblijven van
  foutmeldingen vervalt; de keten kent geen impliciete acceptatie meer.
- **[Piekbelasting en berichtgranulariteit](#piekbelasting-en-berichtgranulariteit)**: standaard
  rate limiting biedt vooraf zicht op verwerkingscapaciteit. Retries worden gestuurd door
  HTTP-headers in plaats van door blinde herhaling.
- **[Recovery en ketenrisico](#recovery-en-ketenrisico)**: de hoeveelheid gegevens-in-transit neemt
  af doordat ontvangstbevestiging en verwerking samenvallen. Het herstelvraagstuk concentreert zich
  aan één zijde van de keten in plaats van verdeeld over MSH-administraties bij meerdere partijen.

## Validatiestrategie

Het [voorgestelde model](#leveren-en-overeenstemmen) hanteert een richting in de omgang met
validatie: afkeuring beperkt zich tot situaties waarin de LV haar verstrekkingstaak niet kan
uitvoeren; functionele afwijkingen worden teruggemeld in plaats van afgewezen. Deze sectie plaatst
die richting in het spectrum aan benaderingen, bepaalt waar de grens precies ligt, en gaat in op wat
dit betekent voor de terugmeldfaciliteit.

### Spectrum: afkeuren versus signaleren

**Strikt valideren en afkeuren.** Het huidige model bij de WOZ. Berichten die niet aan de
validatieregels voldoen worden afgewezen. Berichten waarmee de gemeente eerdere fouten probeert
recht te zetten lopen het risico op hun beurt te worden afgewezen, met oplopende divergentie tot
gevolg.

**Signaleren en informeren.** Berichten die technisch verwerkt kunnen worden, worden geaccepteerd;
functionele fouten worden teruggemeld. Alleen berichten die technisch niet verantwoord verwerkt
kunnen worden (bijvoorbeeld een corrupte tijdlijn) worden afgekeurd. De grens ligt bij technische
integriteit, niet bij functionele correctheid.

### Waar ligt de grens

Vanuit de richting uit het voorgestelde model zijn drie reacties op een afwijkende aanlevering te
onderscheiden:

- **Afkeuren** waar de LV haar taak niet meer kan uitvoeren. Bijvoorbeeld een aanlevering waarin de
  gemeente binnen dezelfde periode dezelfde relatie conflicterend opvoert (een pand gekoppeld aan
  twee WOZ-objecten tegelijk); een consistente verstrekking is dan onmogelijk. In het
  [synchrone koppelvlak](#synchroon-aanleveren-en-verwerken) komt dit neer op een HTTP 4xx-respons
  met de afkeuringsreden.
- **Tolereren** waar de aanlevering inhoudelijk afwijkt maar technisch verwerkbaar is. De levering
  wordt vastgelegd; de afwijking blokkeert geen verstrekking.
- **Terugmelden** waar het signaal zinvol is zonder de levering te blokkeren. De bronhouder kan
  corrigeren via een nieuwe levering.

### Doorwerking naar terugmelden

Naarmate de validatiegrens verschuift van afkeuren naar signaleren, neemt het belang van een
werkende terugmeldfaciliteit toe. De kwaliteitsborging die in het huidige model via afkeuring wordt
geadresseerd, verschuift naar het terugmeldmechanisme. De huidige
[terugmeldfaciliteit](#terugmeldingen) bij de LV is hiervoor onvoldoende uitgerust; versterking is
een randvoorwaarde voor een verschuiving in deze richting.

## Notificatiestrategie

Bij de inrichting van een notificatiedienst is een fundamentele keuze of notificaties informatierijk
of informatiearm zijn. Bij informatiearme notificaties (het notify-pull patroon) ontvangen afnemers
alleen een signaal dat er iets is gewijzigd en halen vervolgens zelf de actuele gegevens op via een
bevraging. Bij informatierijke notificaties bevat het bericht zelf de relevante gegevens, zoals in
de huidige WOZ-keten het geval is.

Het notify-pull patroon past bij de principes van "data bij de bron" en federatief databeheer, en
wordt breed aanbevolen in de context van Common Ground en het Federatief Datastelsel. In combinatie
met het projectiemodel uit [Leveren en overeenstemmen](#leveren-en-overeenstemmen) vormt het een
coherent geheel: de notificatie geeft het signaal, de afnemer haalt vervolgens een afnemerspecifieke
projectie op. Beide patronen hebben echter specifieke consequenties voor de WOZ-keten.

Het volume van de WOZ-keten maakt de keuze niet triviaal. In de piekperiode worden circa 10 miljoen
dienstberichten aangeleverd. Bij puur informatiearme notificaties zou elke notificatie leiden tot
een of meer bevragingsverzoeken van afnemers. Dit verveelvoudigt de belasting op de LV-WOZ, zeker
wanneer meerdere afnemers in dezelfde periode hun gegevens ophalen. Daar staat tegenover dat
informatierijk notificeren een eigen complexiteit kent: de interpretatielast wordt vermenigvuldigd
over alle ketenpartners.

De praktijk laat zien dat de informatiebehoefte per afnemer sterk verschilt en dat afnemers al
uiteenlopende strategieën hanteren. De Belastingdienst verwerkt de informatie uit de informatierijke
notificaties (gebeurtenissen), maar haalt in aanvulling daarop de data via bevraging op in een
gestandaardiseerd formaat; minstens eenmaal per jaar halen zij de volledige dataset op ter controle.
Waterschappen hebben daarentegen behoefte aan gegevens die specifiek voor hen relevant zijn, zoals
de aanduiding gebouwd/ongebouwd en sluimerende WOZ-objecten, die in de huidige levering per
afnemertype worden gefilterd.

Dit wijst erop dat de vraag niet zozeer "informatierijk of informatiearm" is, maar welk patroon bij
welke afnemer past. De keuze heeft directe gevolgen voor het ontwerp van de notificatiedienst en
moet vroeg in het ontwerpproces worden gemaakt.

Een mogelijk transitiepad is dat afnemers beginnen met informatiearm interpreteren: zij ontvangen
nog steeds de volledige notificatie maar halen er uitsluitend de identificatie uit. Dit geeft ruimte
om later ook alleen notificaties met identificatie te sturen, zonder dat dit een verandering vergt
aan de kant van de afnemer.

## Kopiegegevens en verwijzingen

Het knelpunt rond [kopiegegevens en synchronisatielast](#kopiegegevens-en-synchronisatielast) raakt
zowel het informatiemodel als het koppelvlak. De ontwerpvraag is of subjectgegevens (BRP,
Handelsregister) als referentie naar de bronregistratie worden meegestuurd in plaats van als kopie.
Voor niet-ingezetenen, waarvoor de WOZ soms de enige plek is waar subjectgegevens zijn vastgelegd,
blijft kopie-vastlegging vooralsnog noodzakelijk.

De keuzes hangen samen met identificatie-vraagstukken (vervanging van sofinummer door BSN/RSIN,
modellering van "communiceert via") en zijn in deze basis nog niet uitgewerkt.
