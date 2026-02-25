# Knelpunten

De gegevensaanlevering aan de LV-WOZ wordt vormgegeven door twee standaarden: ebMS2 voor transport
en StUF-WOZ voor inhoud. Dit hoofdstuk analyseert de knelpunten in de huidige keten: de complexiteit
van de standaarden, het historiemodel, de verhouding tussen event-driven intentie en
synchronisatie-praktijk, de rol van intermediairs, en de architecturele beperkingen.

## Complexiteit van de standaarden

### De transportlaag: ebMS2

Het correct implementeren van ebMS2 vereist diepgaande kennis van de standaard. De
ebMS-functionaliteit is te complex om te integreren in standaard applicaties, waardoor een aparte
MSH-adapter noodzakelijk is. Dit component moet worden voorzien, geconfigureerd en beheerd, wat
substantiële investeringen vergt in middleware en specialistische kennis.

Het bilaterale karakter van CPA's creëert een coördinatievraagstuk. Elke combinatie van twee
partijen die berichten willen uitwisselen heeft een eigen CPA nodig. Bij certificaatvernieuwing
moeten alle CPA's opnieuw worden gegenereerd en gedistribueerd naar alle ketenpartners. Wanneer één
partij een nieuwe CPA inlaadt terwijl de andere partij nog de oude versie gebruikt, faalt de
communicatie.

De Digikoppeling Koppelvlakstandaard ebMS2 [[DK-EBMS2]] schrijft asynchrone communicatie voor. Een
MSH-acknowledgement bevestigt alleen technische ontvangst, niet functionele verwerking. StUF biedt
wel de mogelijkheid voor functionele bevestigingen (Bv03-berichten), maar het koppelvlak LV-WOZ
voorziet hier niet in: de bronhouder hoort alleen iets terug als het fout gaat. Foutmeldingen kunnen
uren na verzending binnenkomen, wanneer de oorspronkelijke context niet meer beschikbaar is. Dit
leidt tot onvoorspelbaarheid: bronhouders hebben geen zicht op de verwerkingsstatus van hun
aanleveringen.

ebMS2 is gebaseerd op technologie uit het begin van deze eeuw, met SOAP en XML als fundament. De
IT-sector is grotendeels overgestapt naar RESTful API's met JSON als dataformaat. De tooling en
frameworks die moderne ontwikkelaars gewend zijn te gebruiken, ondersteunen ebMS niet of nauwelijks.
De softwareleveranciers die WOZ-systemen bouwen hebben ontwikkelaars die het WOZ-domein kennen, maar
onvoldoende ervaring met ebMS om dit zelf te implementeren. Het gevolg is uitbesteding aan
gespecialiseerde MSH-leveranciers of intermediairs.

### De inhoudslaag: StUF-WOZ

StUF (Standaard Uitwisseling Formaat) [[STUF-ONDERLAAG]] is een berichtenstandaard die de inhoud en
semantiek van berichten definieert. StUF is gelaagd: een generieke onderlaag (StUF 03.01),
horizontale sectormodellen (StUF-BG), verticale sectormodellen (StUF-WOZ) en specifieke
koppelvlakken (LV-WOZ).

StUF biedt functionaliteit die verder gaat dan een simpel dataformaat: gestandaardiseerde
mutatiesoorten, bitemporele elementen en kennisgevingspatronen. Maar de evaluatie van Forum
Standaardisatie [[FORUM-STUF-EVAL]] concludeert: "StUF is een complexe standaard. De complexiteit,
verschillen in interpretatie en incompatibele implementaties komen de interoperabiliteit niet ten
goede."

Het correct implementeren van StUF vereist diepgaande kennis van de generieke onderlaag, het
specifieke sectormodel, het koppelvlak, de XML-schema's en namespaces, én de interactie met ebMS. De
evaluatie stelt vast dat het "moeilijk is om specialisten te vinden" en dat er een "lange inwerktijd
voor ontwikkelaars" is.

Zoals beschreven in het hoofdstuk [Huidige situatie](#huidige-situatie) is de doorontwikkeling van
StUF formeel stopgezet. De officiële positie [[STUF-ONDERLAAG]] is dat alleen wetswijzigingen,
wijzigingen in Logische Ontwerpen van Basisregistraties en gevonden fouten aanleiding kunnen zijn
voor nieuwe versies.

### Identificatieproblemen

Bij de aanlevering van subjectgegevens aan de LV-WOZ moeten primaire identificatienummers (BSN,
RSIN, vestigingsnummer) consistent zijn met het legacy-systeem van _sofinummer_ en _aanvulling
sofinummer_. De LV-WOZ valideert deze consistentie en wijst berichten af bij afwijkingen. Dit
genereert tienduizenden foutmeldingen per maand bij gemeenten die historische registraties
aanleveren.

Bij de aanlevering van subjectgegevens wordt naast het primaire identificatienummer (BSN, RSIN) ook
naam- en adresinformatie meegegeven. Voor ingezetenen is deze informatie redundant (beschikbaar via
de BRP), maar voor niet-ingezetenen (bijvoorbeeld een buitenlandse eigenaar van een Nederlands pand)
is dit de enige plek waar deze gegevens zijn vastgelegd. Deze gegevens zijn opgenomen om zoeken te
vergemakkelijken, niet als authentieke bron. In de praktijk is er weinig behoefte om historie van
adressen en personen in de WOZ te dupliceren; bij een nieuw koppelvlak kan worden overwogen om deze
redundantie te verminderen door voor ingezetenen alleen de verwijzing naar de BRP op te nemen.

Relaties in StUF-WOZ hebben een samengestelde sleutel: de identificatie van het WOZ-object, de
identificatie van het gerelateerde subject, én de `beginGeldigheid`. Wanneer dezelfde belanghebbende
meerdere keren eigenaar is van hetzelfde object (met een onderbreking), ontstaan meerdere
relatie-instanties met elk een eigen `beginGeldigheid`. Om een specifieke relatie te corrigeren moet
de verzender de exacte `beginGeldigheid` kennen. Bij correcties ("deze relatie had nooit mogen
bestaan") kan de te corrigeren relatie dezelfde `beginGeldigheid` hebben als een relatie die wel
bestaat, wat het voor de LV-WOZ lastig maakt om te bepalen welke relatie-instantie wordt bedoeld.

## Het historiemodel

### Bitemporele semantiek

StUF ondersteunt bitemporele historie via gestandaardiseerde elementen. Materiële historie (wanneer
iets geldig was in de werkelijkheid) wordt vastgelegd via `beginGeldigheid` en `eindGeldigheid`.
Formele historie (wanneer iets is geregistreerd) via `tijdstipRegistratie`. StUF kent geen element
`eindRegistratie`, in tegenstelling tot [[NEN3610]]; het einde van een versie wordt impliciet
bepaald door het ontstaan van een volgende versie.

Naast deze temporele elementen speelt de parameter `mutatiesoort` een rol bij de opbouw van formele
historie:

| Code  | Naam         | Betekenis                                                               |
| ----- | ------------ | ----------------------------------------------------------------------- |
| **T** | Toevoeging   | Het object is relevant geworden voor de zender (niet per se ontstaan)   |
| **V** | Verwijdering | Het object is niet meer relevant voor de zender (niet per se beëindigd) |
| **W** | Wijziging    | Er is iets in de werkelijkheid veranderd                                |
| **F** | Correctie    | De registratie was fout; de werkelijkheid is niet veranderd             |

De mutatiesoort classificeert het administratieve perspectief van de zender, niet zelfstandige
feiten. Toestandsovergangen zijn alleen verwerkbaar in de juiste volgorde.

In de praktijk is de technische interpretatie strikter dan de specificatie suggereert.
Kennisgevingen met mutatiesoort W of F mogen alleen worden gebruikt voor gegevens waarvoor
`eindGeldigheid` geen waarde heeft. Historische gegevens kunnen niet via kennisgevingen worden
gecorrigeerd; daarvoor is een synchronisatiebericht nodig. Het gevolg is dat mutatiesoort F wordt
gebruikt voor zowel echte correcties als situaties waarin W technisch niet toegepast kan worden. De
mutatiesoort drukt daarmee niet betrouwbaar de functionele intentie uit.

StUF definieert hoe de bronhouder een bericht moet formuleren (bij een wijziging W, bij een
correctie F), maar technische constraints kunnen de keuze afdwingen ongeacht de werkelijke intentie.
De ontvanger kan dus niet uit het bericht afleiden wat de intentie was. Het Kadaster heeft dit
pragmatisch opgelost door algoritmisch vast te leggen wat de LV doet bij een bepaalde schrijfwijze
in StUF-conforme XML, los van de oorspronkelijke intentie. Dit algoritme is de feitelijke norm
geworden.

### Het probleem met formele historie

Bij de WOZ-keten spelen niet twee maar drie temporele dimensies een rol: materiële historie (wanneer
geldig in de werkelijkheid), formele historie van de bronhouder (wanneer geregistreerd bij de
gemeente), en formele historie van de Landelijke Voorziening (wanneer beschikbaar voor afnemers).

De huidige architectuur probeert de formele historie van de bronhouder over te nemen in de LV-WOZ.
Dit vereist dat bronhouders de sequentie van historische registraties kunnen reconstrueren en in de
juiste volgorde versturen. Die reconstructie is foutgevoelig: niet alle gemeenten leveren formele
historie op dezelfde manier aan, de vertaling van StUF-semantiek naar interne opslag is complex, en
bij intermediairs bestaat het risico dat formele historie-informatie verloren gaat.

Tegelijkertijd houdt de LV-WOZ geen eigen formele tijdlijn bij. Wat zij uitlevert als "formele
historie" is een reconstructie uit StUF-berichten, niet een registratie van wanneer gegevens bij de
LV beschikbaar kwamen. De kernvraag van afnemers, "Wat wist de LV vier weken geleden?", kan niet
worden beantwoord.

Uit gesprekken met afnemers blijkt dat zij primair behoefte hebben aan materiële historie (wat was
de WOZ-waarde op een peildatum?) en LV-formele historie (wanneer was dit beschikbaar?). De formele
historie van de bronhouder, welke tussentijdse invoerfouten de gemeente heeft gemaakt, is voor
afnemers niet relevant. Toch is dit precies de informatie die de huidige architectuur probeert te
synchroniseren.

Er is daarmee een structurele mismatch: de architectuur investeert in het synchroniseren van
informatie (bronhouder-formele historie) die afnemers niet nodig hebben, terwijl de informatie die
zij wel nodig hebben (LV-formele historie) niet wordt bijgehouden.

### Granulariteit van tijdregistratie

De huidige WOZ werkt op dagbasis voor materiële historie. In de praktijk zijn er situaties waarin
meerdere transacties op dezelfde dag plaatsvinden, bijvoorbeeld een nieuwe beschikking gevolgd door
een bezwaar op dezelfde dag ("flitsbezwaren"). Dit leidt tot toestanden met een duur van nul
seconden die in de materiële historie worden gestopt, hoewel ze nooit werkelijk geldig zijn geweest.

Registratie in tijdstippen (milliseconden, UTC) in plaats van op dagbasis zou dit probleem
voorkomen, omdat uit een tijdstip eenvoudig de dag is af te leiden maar andersom niet.

Een bijkomend probleem is dat tijdzones niet goed zijn geregeld. Er zijn mutaties voorgekomen in het
uur dat niet bestaat (bij de overgang naar zomertijd). UTC als basis voorkomt dit soort fouten.

De wet schrijft voor dat geldigheid op dagbasis wordt geregistreerd. Een overgang naar
tijdstipregistratie zou dus een wetsaanpassing vereisen.

### Status na beëindiging van objecten

Bij het modelleren van objecten die worden beëindigd (bijvoorbeeld een gesloopt pand) zijn er twee
principiële benaderingen.

In de huidige StUF-benadering is er altijd een actuele toestand. Een beëindigd object krijgt een
status-attribuut (bijvoorbeeld "gesloopt" of "niet meer geregistreerd"). Dit maakt het mogelijk om
voor elk object dat ooit geregistreerd is geweest de vraag te beantwoorden: wat is de actuele
toestand? Dit geldt ook voor objecten die ten onrechte waren opgevoerd.

Een alternatieve benadering is dat een object dat niet meer geregistreerd is, geen actuele toestand
meer heeft. De laatste toestand krijgt een eindregistratie en daarmee houdt het op. Op basis van de
identificatie kan in de historie worden opgezocht wat er ooit was vastgelegd.

De tweede benadering is conceptueel eenvoudiger (als iets niet meer geregistreerd is, is het niet
meer geregistreerd), maar vereist dat afnemers die gewend zijn aan een actuele toestand met
status-indicatie via een andere weg aan dezelfde informatie komen. De overgang van de huidige
situatie naar een dergelijk model is een grote stap.

Deze keuze heeft directe gevolgen voor het informatiemodel en de API-specificaties en moet vroeg in
het ontwerpproces worden gemaakt.

## Event-driven intentie, synchronisatie-praktijk

Het Sectormodel WOZ stelt: "De aanlevering van mutaties zal, conform NORA, volledig gebeurtenis
georiënteerd plaatsvinden." Dit impliceert een model waarin bronhouders gebeurtenissen aanleveren en
de LV-WOZ deze verwerkt tot een coherente registratie. In de praktijk is het model verschoven naar
database-synchronisatie: de LV-WOZ probeert een volledige bitemporele kopie te zijn van de
bronhouderregistraties.

| Aspect                    | Event-driven model                              | Synchronisatie-model                |
| ------------------------- | ----------------------------------------------- | ----------------------------------- |
| **Wat wordt aangeleverd** | Gebeurtenissen (feiten)                         | Toestandswijzigingen met historie   |
| **Verantwoordelijkheid**  | Bronhouder levert events, LV bepaalt verwerking | Bronhouder dicteert exacte toestand |
| **Historiemodel**         | LV bouwt eigen formele historie                 | LV neemt bronhouder-historie over   |
| **Herstelscenario**       | Events opnieuw afspelen                         | Volledige toestand synchroniseren   |
| **Complexiteit**          | Bij de LV (interpretatie)                       | Bij bronhouder (reconstructie)      |

De huidige implementatie combineert elementen van beide modellen op een manier die de nadelen
accumuleert. Berichten gebruiken termen als "kennisgeving" en "gebeurtenis", maar de technische
verwerking vereist dat bronhouders exacte toestandsovergangen specificeren alsof zij de LV-database
direct muteren.

### De gelaagdheid van dienstberichten en kennisgevingen

Zoals beschreven in het hoofdstuk [Huidige situatie](#huidige-situatie) verloopt de aanlevering aan
de LV-WOZ via [dienstberichten](#def-dienstbericht): containers die kennisgevingen bundelen rond een
WOZ-gebeurtenis. Deze gelaagdheid maakt de spanning tussen de event-driven intentie en de
synchronisatie-praktijk zichtbaar:

| Aspect            | Gebeurtenis-laag (dienstbericht) | Toestand-laag (kennisgeving) |
| ----------------- | -------------------------------- | ---------------------------- |
| **Semantiek**     | Wat er is gebeurd                | Hoe de registratie wijzigt   |
| **Granulariteit** | Eén gebeurtenis                  | Meerdere objectmutaties      |
| **Verwerking**    | Samenhangvalidatie               | Validatie en opslag          |

De LV-WOZ gebruikt het type dienstbericht voor samenhangvalidatie: gegeven het type gebeurtenis
wordt gecontroleerd of de combinatie van ingesloten kennisgevingen een zinvolle interpretatie heeft.
De feitelijke verwerking (validatie tegen de huidige toestand en opslag) vindt plaats op het niveau
van de individuele kennisgevingen.

Het gevolg is een hybride structuur die de complexiteit van beide benaderingen combineert. De
bronhouder moet zowel het juiste dienstbericht selecteren (gebeurtenis-denken) als de kennisgevingen
daarbinnen correct vullen (toestand-denken). De LV-WOZ verwerkt beide lagen: het dienstbericht voor
samenhangvalidatie, de kennisgevingen voor toestandsovergangen.

### Toestandsoverdracht en zijn problemen

De kennisgevingen binnen een dienstbericht zijn technisch gezien _state transfer messages_. Een
wijzigkennisgeving bevat zowel de oude situatie als de nieuwe situatie. De ontvanger moet valideren
dat de oude situatie overeenkomt met zijn huidige toestand, de wijziging toepassen, en een
foutbericht genereren als de validatie faalt.

Dit patroon heeft specifieke eigenschappen. Berichten moeten in exacte volgorde worden verwerkt; als
bericht B arriveert vóór bericht A, faalt de validatie. In de praktijk wordt dit probleem
gemitigeerd doordat berichten worden geclusterd binnen gebeurtenissen: een dienstbericht bevat alle
kennisgevingen die bij één gebeurtenis horen. Volgordeproblemen spelen daardoor vooral wanneer
meerdere gebeurtenissen voor hetzelfde object in zeer korte tijd plaatsvinden, bijvoorbeeld bij
"flitsbezwaren" waarbij bezwaar en afhandeling op dezelfde dag worden verwerkt, of bij meerdere
eigenaarswisselingen in korte tijd. Het tweemaal verwerken van dezelfde kennisgeving leidt tot een
fout, omdat de oude situatie niet meer klopt. ebMS2 biedt duplicaat-eliminatie op transportniveau
(de MSH houdt ontvangen MessageIds bij), maar op applicatieniveau zijn StUF-berichten niet
idempotent. Zender en ontvanger moeten exact dezelfde toestand hebben; divergentie blokkeert verdere
verwerking.

De StUF-standaard erkent dit: "StUF ondersteunt niet het gericht corrigeren van een enkel foutief
historisch gegeven." De voorgeschreven oplossing is synchronisatie: de volledige toestand opnieuw
aanleveren. Dit adresseert de directe inconsistentie, maar niet de onderliggende oorzaak van de
divergentie.

### Synchronisatieberichten

StUF voorziet in synchronisatieberichten (Sh-berichten) voor herstel na divergentie. Het Sectormodel
beschrijft wanneer de LV-WOZ om synchronisatie vraagt: "als in een dienstbericht een
toevoegkennisgeving of de oude situatie in een wijzigkennisgeving niet overeenkomt met de huidige
situatie in de LV WOZ." Met andere woorden: de LV-WOZ valideert de kennisgevingen binnen elk
aangeleverd dienstbericht tegen haar eigen toestand, en vraagt om synchronisatie wanneer die
toestand niet klopt.

Dit is een recovery-mechanisme waarbij de LV inconsistenties detecteert en om een volledig beeld
vraagt. De implementatie brengt complexiteit met zich mee. Synchronisatieberichten hebben een
geneste structuur met strikte sorteervereisten: alle historische registraties moeten oplopend
gesorteerd zijn op `tijdstipRegistratie`, en binnen één tijdstipRegistratie oplopend op
`beginGeldigheid`. De bronhouder moet de volledige historie kunnen reconstrueren in StUF-formaat,
inclusief de juiste volgorde van registraties. In de praktijk is dit voor veel bronhouders niet
haalbaar; niet alle WOZ-systemen zijn hierop ingericht.

Synchronisatie blijkt vaker nodig dan het ontwerp veronderstelt. Gemiste berichten, verkeerd
verwerkte mutaties en volgordefouten leiden tot divergentie.

### Consistentiemodel

Event-driven systemen zijn typisch eventually consistent: na een wijziging duurt het even voordat
alle read-modellen zijn bijgewerkt. Dit is een bewuste trade-off voor schaalbaarheid.

De WOZ-keten opereert in een hybride model. Berichten worden asynchroon verwerkt, maar het protocol
verwacht dat verzender en ontvanger dezelfde toestand hebben. De bronhouder heeft geen mechanisme om
te verifiëren of en wanneer verwerking is voltooid. Wanneer de consistentie-verwachting niet wordt
waargemaakt, valt het systeem terug op volledige synchronisatie.

### De interpretatielast

De problemen met toestandsoverdracht, synchronisatie en consistentie zijn technisch van aard. Maar
het hybride model heeft ook een breder, ketenoverkoepelend gevolg. Het dienstbericht bevat weliswaar
een gebeurtenis-indicatie (een van de 21 WOZ-gebeurtenistypen), maar de feitelijke verwerking bij
zowel de LV-WOZ als afnemers vindt plaats op het niveau van de individuele kennisgevingen:
toestandsovergangen per object. Wanneer de relatie tussen de gebeurtenis op dienstberichtniveau en
de kennisgevingen daarbinnen niet eenduidig is (bijvoorbeeld bij synchronisatieberichten of bij
correcties die als wijziging worden aangeleverd), moet de ontvanger zelf afleiden wat er is gebeurd.
Elke ontvanger in de keten moet zelfstandig afleiden wat de datamutaties betekenen. Dit leidt tot
divergentie: dezelfde datamutatie kan door verschillende partijen anders worden geïnterpreteerd. Het
probleem wordt versterkt wanneer meerdere gebeurtenissen worden gestapeld in één mutatiebericht; de
ontvanger kan dan niet meer herleiden welke afzonderlijke gebeurtenissen de mutatie hebben
veroorzaakt. De interpretatielast wordt vermenigvuldigd over alle ketenpartners, zonder garantie op
consistente uitkomsten. De architecturele gevolgen hiervan komen terug in
[Koppeling met afnemers](#koppeling-met-afnemers).

### Positionering: event sourcing en Change Data Capture

De voorgaande subsecties beschrijven wat de huidige berichtenstroom doet en welke problemen dat
oplevert. Om dit scherp te positioneren is een vergelijking met twee bekende architectuurpatronen
nuttig.

Event sourcing is een architectuurpatroon waarbij alle wijzigingen worden vastgelegd als een
onveranderlijke reeks van domeingebeurtenissen. De huidige toestand wordt gereconstrueerd door alle
events af te spelen. StUF-kennisgevingen lijken op events, maar er zijn wezenlijke verschillen:

| Aspect                 | Event sourcing                                          | StUF-kennisgeving                           |
| ---------------------- | ------------------------------------------------------- | ------------------------------------------- |
| **Inhoud**             | Beschrijft _wat er gebeurd is_                          | Beschrijft _de toestandsovergang_           |
| **Onveranderlijkheid** | Events zijn immutable; correctie via compenserend event | Eerdere gegevens kunnen worden gecorrigeerd |
| **Reconstructie**      | Toestand = som van alle events                          | Toestand = laatste bericht                  |
| **Idempotentie**       | Replay levert altijd dezelfde toestand                  | Replay kan leiden tot fouten                |
| **Eigenaarschap**      | Event store is source of truth                          | Bronhouder dicteert toestand                |

In event sourcing _is_ de event log de database. In StUF is de kennisgeving een _instructie_ aan de
ontvanger om zijn database te muteren.

StUF-kennisgevingen lijken daarmee meer op Change Data Capture (CDC) dan op event sourcing. CDC legt
ook toestandswijzigingen vast ("rij X werd Y") in plaats van domeingebeurtenissen. Beide patronen
zijn volgorde-afhankelijk en niet idempotent. Het verschil met event sourcing is niet dat het geen
"events" zijn, maar dat ze een ander abstractieniveau beschrijven: wijzigingen in de registratie in
plaats van gebeurtenissen in de werkelijkheid.

## De rol van intermediairs

Zoals beschreven in het hoofdstuk [Huidige situatie](#huidige-situatie) besteedt een substantieel
deel van de bronhouders de ebMS/StUF-implementatie uit aan intermediairs. Deze constructie lost het
complexiteitsprobleem voor bronhouders op, maar heeft gevolgen voor de functionaliteit die de
standaarden beogen te bieden.

### Informatieverlies op de transportlaag

Het gebruik van intermediairs heeft gevolgen voor de voordelen waarvoor ebMS2 is ontworpen. De
end-to-end betrouwbaarheidsgarantie wordt opgesplitst in twee hop-to-hop garanties. De bronhouder
ontvangt bevestiging dat de intermediair het bericht heeft ontvangen, maar geen protocolniveau
zekerheid dat het de LV-WOZ heeft bereikt.

De TLS-verbinding wordt opgezet tussen bronhouder en intermediair, en tussen intermediair en LV-WOZ.
De LV-WOZ ziet het certificaat van de intermediair, niet dat van de bronhouder. Bij directe
ebMS-communicatie kan een ondertekende acknowledgement dienen als onweerlegbaar bewijs van
ontvangst; bij een intermediair bestaat dit bewijs niet in end-to-end vorm.

Technische fouten (TLS-handshakes, SOAP-validatie, MSH-verwerking) en functionele fouten
(StUF-schemavalidatie, business rules) volgen verschillende paden. Bij een intermediair moeten
ebMS-fouten worden vertaald naar het koppelvlak dat de bronhouder gebruikt; een specifieke
MSH-foutcode wordt daarbij vaak een generieke foutmelding.

De LV-WOZ genereert maandelijks tussen de 100.000 en 200.000 foutmeldingen. Bij een
intermediair-constructie gaan deze naar de intermediair, niet de bronhouder. In de praktijk komen
foutmeldingen regelmatig niet op de juiste plek terecht.

Het gevolg is dat de intermediair de end-to-end beheersing van de keten doorbreekt. In de praktijk
komt het voor dat gemeenten niet doorhebben dat zij niet meer aan de LV leveren, omdat het contact
met de LV-WOZ volledig via de intermediair verloopt. Acknowledgements en foutmeldingen belanden soms
tussen wal en schip.

### Informatieverlies op de inhoudslaag

Uit de evaluatie van Forum Standaardisatie [[FORUM-STUF-EVAL]] blijkt dat bij StUF-implementaties
vaak sub-standaarden ontstaan. API's leveren doorgaans minder gegevens dan het volledige StUF-model.
Het risico bestaat dat bij de vertaling naar eenvoudigere koppelvlakken informatie verloren gaat,
bijvoorbeeld formele historie of het onderscheid tussen wijzigingen en correcties.

### Trade-off

Intermediairs lossen een concreet probleem op: bronhouders kunnen zich concentreren op hun kerntaak
zonder ebMS- of StUF-expertise. Tegelijkertijd gaat bij de intermediair een deel van de
functionaliteit verloren waarvoor de standaarden zijn ontworpen. De complexiteit van de standaarden
blijft bestaan (bij de intermediair), terwijl de voordelen niet volledig doorwerken naar de
bronhouder.

## Architecturele beperkingen

### Positie van de Landelijke Voorziening

De LV-WOZ bevindt zich in een structureel lastige positie. De voorziening ontvangt berichten van
honderden bronhouders, elk met eigen systemen, processen en interpretaties, en in toenemende mate
via intermediairs met elk hun eigen transformaties.

De voorziening heeft geen controle over de kwaliteit van wat binnenkomt, geen controle over de
volgorde, en beperkte mogelijkheden om terug te communiceren. Zij kan niet strenger zijn dan de
zwakste schakel: wanneer een bronhouder geen formele historie aanlevert, kan de LV die niet
fabriceren; wanneer een intermediair correctie-semantiek verliest, kan de LV die niet reconstrueren.

### De gemeentelijke registratie en de LV

De wet stelt dat het college van B&W informatie moet aanleveren aan de Landelijke Voorziening. Er
staat echter nergens in de wet dat de gemeente ook een kopie van het LV-deel moet hebben. De taak
van de bronhouder is aanleveren; de taak van de LV is ervoor zorgen dat de weergave overeenkomt met
wat de bronhouder heeft aangeleverd en dat de gegevens bewaard blijven en op een correcte manier
naar de afnemers gaan.

In de praktijk is het WOZ-informatiecomponent bij de LV zeer beperkt ten opzichte van wat er bij de
gemeente leeft. Het taxatieproces, het echte werk van de gemeente, is veel omvangrijker. De
basisregistratie is daarvan een marginaal onderdeel dat bestaat omdat het vervolgens naar de
afnemers moet. Gemeenten kiezen dan ook voor het ondersteunen van hun werk- en taxatieproces; daar
worden de applicaties op gebouwd. Er is doorgaans geen apart systeem waarvan een extract wordt
gemaakt voor de LV; het werkprocessysteem stuurt gegevens naar de LV wanneer dat nodig is.

De "lokale kopie" van het LV-deel is daarmee een administratief fictief concept: een view op het
gemeentelijke systeem waarvan een bepaald deel wordt beschouwd als de basisregistratie, relevant
voor afnemers. De rest (het taxatieproces, contactregistraties met burgers, bezwaarprocessen) gaat
de LV niet aan. Dit inzicht is relevant voor het ontwerp van het koppelvlak: wat de bronhouder
aanlevert is een selectie uit een veel groter geheel, niet een extract uit een apart ingericht
basisregistratiesysteem.

Een toenemend patroon is dat gemeenten ook afnemer worden van de LV. Waar een gemeente de WOZ-taken
uitbesteedt aan een belastingsamenwerkingsverband, kan de gemeente soms haar eigen data niet meer
rechtstreeks inzien. In die gevallen wordt de data via de Haal Centraal API opgehaald bij de LV. Dit
patroon groeit naarmate er meer grondslagen komen waarmee gemeenten WOZ-data mogen gebruiken, onder
meer voor de Omgevingswet. Architectureel is het aantrekkelijk als de LV de verstrekkingsbron is,
omdat dit afhankelijkheden in de binnengemeentelijke architectuur wegneemt.

### Validatiestrategie

In de huidige opzet is elke validatie die de LV doet potentieel een oorzaak van een verschil tussen
de LV en de gemeentelijke registratie. De gemeente heeft immers al besloten dat de data correct is.
Wanneer de LV vervolgens afkeurt, ontstaat er een verschil dat kan groeien als er vervolgberichten
worden verstuurd die uitgaan van succesvolle verwerking.

Hier spelen twee conflicterende principes. Enerzijds is er de wens om meer te valideren, omdat
daarmee de kwaliteit in de LV omhooggaat. Anderzijds is er het principe dat de LV een conforme kopie
zou moeten zijn van de gemeentelijke registratie. Die twee principes kunnen niet onbeperkt naast
elkaar bestaan: meer validatie betekent meer potentiële afwijkingen van de bron.

Er tekenen zich twee benaderingen af:

**Strikt valideren en afkeuren.** Dit is het huidige model bij de WOZ. Berichten die niet aan de
validatieregels voldoen worden afgewezen. Een neveneffect is dat berichten waarmee de gemeente
eerdere fouten recht probeert te zetten het risico lopen om op hun beurt ook te worden afgewezen.

**Signaleren en informeren.** Dit is meer hoe de BAG werkt. Berichten die technisch verwerkt kunnen
worden, worden geaccepteerd, ook als er functionele fouten in zitten die worden teruggemeld. Alleen
berichten die zo fout zijn dat ze technisch niet verantwoord verwerkt kunnen worden (bijvoorbeeld
een corrupte tijdlijn) worden afgekeurd. De grens ligt bij technische integriteit, niet bij
functionele correctheid.

Een interessant patroon komt uit de Basisregistratie Ondergrond (BRO): daar bestaat een voorportaal
waar bronhouders mutaties klaarzetten en valideren voordat ze worden doorgezet naar de Landelijke
Voorziening. De bronhouder bepaalt uiteindelijk wat wordt doorgezet, maar het voorportaal biedt een
buffer. Validaties die anders bij de LV tot afkeuring zouden leiden, worden naar voren getrokken. De
bronhouder kan externe experts een rol toekennen om aangeleverde data te beoordelen. Dit geeft een
stukje proces in de facilitering dat het verschil maakt tussen individuele berichten die worden
afgekeurd en het compleet klaarzetten van een samenhangende set mutaties.

Het achterliggende principe is dat de verantwoordelijkheid bij de gemeente ligt, en dat de gemeente
in staat moet worden gesteld om controles al te doen voordat zij iets verzendt.

### Berichtgranulariteit

De huidige architectuur verwerkt elke gebeurtenis als afzonderlijk dienstbericht. In de
beschikkingsperiode betekent dit circa 10 miljoen individuele dienstberichten in 8 weken. Elk
dienstbericht doorloopt het volledige verwerkingsproces: ebMS-handshake, MSH-verwerking,
StUF-parsing, validatie van de ingesloten kennisgevingen, en opslag.

Batch-aanlevering zou de overhead significant kunnen reduceren: minder protocol-overhead,
efficiëntere validatie, eenvoudigere foutafhandeling, betere aansluiting bij massa-processen. De
huidige standaarden ondersteunen geen gestandaardiseerde batch-aanlevering; elk dienstbericht bevat
de kennisgevingen voor één gebeurtenis.

### Koppeling met afnemers

De LV-WOZ stuurt via Digilevering [[DIGILEVERING-WOZ]] berichten door naar afnemers. Hierbij vindt
per afnemertype filtering plaats: waterschappen ontvangen gegevens die voor hen relevant zijn (zoals
de aanduiding gebouwd/ongebouwd en sluimerende WOZ-objecten) die voor berichten naar de
Belastingdienst worden weggefilterd, en omgekeerd. De LV-WOZ voegt geen informatie toe, maar vervult
wel een actieve mediërende rol tussen bronhouders en afnemers.

Dit heeft een structureel gevolg voor de doorlevering. De LV-WOZ investeert aanzienlijk in het
correct interpreteren van inkomende berichten: pattern matching op datamutaties, reconstructie van
formele historie, samenhangvalidatie op dienstberichtniveau. De huidige architectuur voorziet er
echter niet in om het resultaat van deze interpretatie door te geven aan afnemers; in plaats daarvan
wordt het oorspronkelijke bronbericht doorgestuurd. Afnemers moeten daardoor dezelfde complexe
interpretatie opnieuw uitvoeren, elk met eigen interpretatielogica en met het risico op afwijkende
uitkomsten.

Desondanks bepaalt het formaat van aangeleverde berichten grotendeels wat afnemers ontvangen.
Digilevering biedt daarnaast filtering op postcodegebied of gemeente, maar geen inhoudelijke
filtering op wat er is gewijzigd. Bij herstelacties ontvangen afnemers grote aantallen berichten
waarin voor hen geen nieuwe informatie staat. Een wijziging in het aanleveringsformaat vereist
gelijktijdige aanpassingen bij alle afnemers; elke verandering heeft een domino-effect door de hele
keten.

Het Kadaster heeft aangegeven dat Digilevering voor WOZ komt te vervallen en wordt vervangen door
een notificatiedienst, vergelijkbaar met BRK-notificaties. Dit biedt kansen voor een losser
gekoppelde architectuur waarin afnemers worden genotificeerd en zelf bepalen wanneer en welke
gegevens zij ophalen.

#### Informatierijk versus informatiearm notificeren

Bij de inrichting van een notificatiedienst is een fundamentele keuze of notificaties informatierijk
of informatiearm zijn. Bij informatiearme notificaties (het notify-pull patroon) ontvangen afnemers
alleen een signaal dat er iets is gewijzigd en halen vervolgens zelf de actuele gegevens op via een
bevraging. Bij informatierijke notificaties bevat het bericht zelf de relevante gegevens, zoals in
de huidige WOZ-keten het geval is.

Het notify-pull patroon past bij de principes van "data bij de bron" en federatief databeheer, en
wordt breed aanbevolen in de context van Common Ground en het Federatief Datastelsel. Beide patronen
hebben echter specifieke consequenties voor de WOZ-keten.

Het volume van de WOZ-keten maakt de keuze niet triviaal. In de piekperiode worden circa 10 miljoen
dienstberichten aangeleverd (zie [Berichtgranulariteit](#berichtgranulariteit)). Bij puur
informatiearme notificaties zou elke notificatie leiden tot een of meer bevragingsverzoeken van
afnemers. Of die bevragingen direct bij ontvangst van de notificatie plaatsvinden of op een later
moment is aan de afnemer, maar het totale bevragingsvolume blijft hetzelfde. Dit verveelvoudigt de
belasting op de LV-WOZ, zeker wanneer meerdere afnemers in dezelfde periode hun gegevens ophalen.
Daar staat tegenover dat informatierijk notificeren een eigen complexiteit kent: de LV-WOZ
investeert aanzienlijk in het correct interpreteren van inkomende berichten, maar stuurt vervolgens
het oorspronkelijke bronbericht door naar afnemers. Het interpretatiewerk van de LV gaat daarbij
verloren en afnemers moeten dezelfde complexe interpretatie opnieuw uitvoeren (zie
[Koppeling met afnemers](#koppeling-met-afnemers)).

De praktijk laat zien dat de informatiebehoefte per afnemer sterk verschilt en dat afnemers al
uiteenlopende strategieën hanteren. De Belastingdienst verwerkt inmiddels niet meer de informatie
uit rijke notificaties, maar haalt in plaats daarvan de data via bevraging op in een
gestandaardiseerd formaat; minstens eenmaal per jaar halen zij de volledige dataset op ter controle.
Het informatierijke bericht voegt voor hen mogelijk geen waarde meer toe. Waterschappen hebben
daarentegen behoefte aan specifieke gegevens die niet uit een standaardbevraging komen, zoals het
adres waarnaar de gemeente de beschikking heeft gestuurd, zodat de waterschapsaanslag naar hetzelfde
adres kan.

Dit wijst erop dat de vraag niet zozeer "informatierijk of informatiearm" is, maar welk patroon bij
welke afnemer past. De uiteenlopende informatiebehoefte en verwerkingspatronen van afnemers maken
een uniforme keuze voor de hele keten problematisch. De keuze heeft directe gevolgen voor het
ontwerp van de notificatiedienst en moet vroeg in het ontwerpproces worden gemaakt.

### Recovery en ketenrisico

In een asynchrone berichtenketen bevinden zich altijd gegevens in transit. Bij een recovery-scenario
is de ketentoestand verdeeld over meerdere systemen die niet op hetzelfde moment hun backup maken.
Berichten die na de backup zijn verzonden maar voor een storing aankwamen, zitten niet in de backup
van de verzender maar mogelijk wel bij de ontvanger. De MSH-administratie kan inconsistent zijn na
herstel. Bij een intermediair is onduidelijk welke berichten wel en niet zijn doorgekomen.

## Conclusie

De beschreven knelpunten hangen samen en zijn voor een groot deel niet uniek voor de WOZ. Ze vloeien
voort uit een spanningsveld dat speelt bij elke registratie die op ebMS2 en StUF is gebaseerd: de
standaarden bieden functionaliteit, maar de complexiteit leidt ertoe dat organisaties constructies
kiezen waarbij die functionaliteit deels verloren gaat.

De transportlaag (ebMS2) leidt tot uitbesteding aan intermediairs, waardoor end-to-end
betrouwbaarheid en onweerlegbaarheid niet volledig worden gerealiseerd. De inhoudslaag (StUF-WOZ)
biedt functionele rijkdom met bijbehorende complexiteit; mutatiesoorten classificeren het
administratieve perspectief van de zender, niet feitelijke gebeurtenissen, en worden in de praktijk
bepaald door technische constraints. De doorontwikkeling van StUF is gestopt; er is geen
transitie-roadmap.

Het historiemodel streeft naar bitemporaliteit, maar de poging om bronhouder-formele historie over
te nemen leidt tot complexiteit. Afnemers geven aan behoefte te hebben aan de formele historie van
de LV, niet van de bronhouder.

De architectuur combineert elementen van event-driven en synchronisatie-modellen. Kennisgevingen
worden gepresenteerd als events, maar beschrijven toestandsovergangen. State wordt gesynchroniseerd,
maar de protocollen voorzien niet in alle scenario's. De keten combineert event-vocabulaire met
synchronisatie-eisen.

Hier manifesteert zich een paradox. Hoe minder goed een bronhouder in staat is om de kwaliteit van
zijn registratie te borgen, hoe groter de behoefte bij afnemers aan rijke gebeurtenissemantiek om de
datamutaties te kunnen duiden. Maar juist die bronhouders zijn het minst in staat om die semantiek
te leveren. Omgekeerd geldt: bij een bron met perfecte processen en volledige verantwoording
volstaat eenvoudige datasynchronisatie, omdat de kwaliteit al geborgd is. De oplossingsrichtingen
moeten rekening houden met dit spanningsveld.

Het volgende hoofdstuk analyseert of de transitie naar ebMS3/AS4 deze knelpunten kan adresseren.
