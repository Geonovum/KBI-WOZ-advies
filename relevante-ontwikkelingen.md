# Relevante ontwikkelingen

De modernisering van ketens die op ebMS en StUF zijn gebaseerd staat niet op zichzelf. Binnen de
overheid lopen diverse initiatieven die raken aan de vraag hoe registers gegevens moeten
uitwisselen, en in de bredere IT-architectuur zijn principes geformuleerd die richting geven aan
deze vraag. Dit hoofdstuk beschrijft de beleidscontext, technische ontwikkelingen en
architectuurprincipes die relevant zijn voor registraties die deze transitie doormaken.

## Uit Betrouwbare Bron

Het project
[Uit Betrouwbare Bron](https://website-digilab-overheid-nl-research-uit-betrouw-e1f39021ce924c.gitlab.io/)
onderzoekt wat er nodig is om "capabele registers" te ontwikkelen die passen binnen een federatief
datastelsel. Het project constateert dat registers op dit moment nog niet beschikken over de
noodzakelijke capabilities voor bijhouding van gegevens om te functioneren als real-time en duurzaam
te gebruiken gegevensbron.

Kernprincipes uit dit onderzoek zijn breed relevant:

- **Data bij de bron**: In een federatief stelsel blijft informatie bij de oorspronkelijke eigenaar.
  Afnemers bevragen de bron in plaats van kopieën te ontvangen en zelf bij te houden.
- **Capabele registers**: Bronnen moeten in staat zijn om vragen te beantwoorden over de historie
  van gegevens en over de aanleiding van registraties. Dit vereist dat registers zelf hun temporele
  model op orde hebben.
- **Verwerkingsverantwoording**: Een betrouwbare bron legt niet alleen de huidige toestand vast,
  maar ook de herkomst (waar komt het vandaan?), de legitimering (op welke grondslag?) en het
  tijdstip van verwerking. Zonder deze verantwoording is een registratie een bewering zonder
  onderbouwing.
- **Herhaalbaarheid en beschouwingsmoment**: Een bevraging op hetzelfde moment moet altijd hetzelfde
  resultaat opleveren. Dit vereist dat bronnen een consistent beschouwingsmoment kunnen bieden: een
  punt in de tijd waarvan vaststaat dat alle schrijftransacties zijn afgerond. Het project stelt
  voor om dit beschouwingsmoment expliciet mee te geven in API-responses.
- **Event-oriëntatie**: Het werken met events kan een geschikte manier zijn om te "informeren bij de
  bron"; afnemers worden genotificeerd over wijzigingen en bepalen zelf wanneer en wat zij ophalen.

Het onderzoek maakt een expliciet onderscheid tussen de intentie van een handeling en de registratie
ervan. Een bron die alleen toestandsgegevens vastlegt zonder de context van de handelingen die tot
die toestand hebben geleid, kan niet volledig verantwoording afleggen. Dit inzicht sluit aan bij de
spanning tussen event-driven intentie en synchronisatie-praktijk die zichtbaar wordt in
[Synchronisatieberichten als herstelmechanisme](#synchronisatieberichten-als-herstelmechanisme).

Het WOZ-domein is expliciet een van de toepassingsgebieden waarin het project inzichten beproeft.
Dit maakt de bevindingen direct relevant voor de modernisering van de LV-WOZ.

De huidige StUF-kennisgevingen laten zich in dit kader positioneren ten opzichte van twee bekende
architectuurpatronen. Bij _event sourcing_ worden alle wijzigingen vastgelegd als een
onveranderlijke reeks van domeingebeurtenissen; de huidige toestand wordt gereconstrueerd door alle
events af te spelen. StUF-kennisgevingen lijken op events, maar beschrijven toestandsovergangen in
plaats van domeingebeurtenissen, zijn niet onveranderlijk, en zijn niet idempotent bij replay.
StUF-kennisgevingen lijken daarmee meer op _Change Data Capture_ (CDC): het vastleggen van
toestandswijzigingen ("rij X werd Y") in plaats van domeingebeurtenissen. Beide patronen zijn
volgorde-afhankelijk en niet idempotent. Het verschil met event sourcing is niet dat het geen
"events" zijn, maar dat ze een ander abstractieniveau beschrijven: wijzigingen in de registratie in
plaats van gebeurtenissen in de werkelijkheid.

De spanning tussen deze twee modellen is zichtbaar in de huidige WOZ-keten:

| Aspect                    | Event-driven model                              | Synchronisatie-model                |
| ------------------------- | ----------------------------------------------- | ----------------------------------- |
| **Wat wordt aangeleverd** | Gebeurtenissen (feiten)                         | Toestandswijzigingen met historie   |
| **Verantwoordelijkheid**  | Bronhouder levert events, LV bepaalt verwerking | Bronhouder dicteert exacte toestand |
| **Historiemodel**         | LV bouwt eigen formele historie                 | LV neemt bronhouder-historie over   |
| **Herstelscenario**       | Events opnieuw afspelen                         | Volledige toestand synchroniseren   |
| **Complexiteit**          | Bij de LV (interpretatie)                       | Bij bronhouder (reconstructie)      |

De huidige implementatie combineert elementen van beide modellen.

## Common Ground

[Common Ground](#def-common-ground) is een door de VNG geïnitieerde beweging om de
informatievoorziening van gemeenten te moderniseren. De kernprincipes (scheiden van data en
applicaties, eenmalig opslaan en meervoudig gebruiken van gegevens, ontsluiten van data via
gestandaardiseerde API's) raken direct aan ketens waar de gegevensuitwisseling nog volledig via
berichtuitwisseling verloopt, zoals de WOZ-keten.

Binnen Common Ground is met koplopergemeenten gewerkt aan de vraag hoe gemeenten met API's moeten
omgaan. Een centrale conclusie is dat de overgang naar REST API's niet alleen een technologiewissel
moet zijn, maar ook een verschuiving in benadering: van data-gedreven naar handeling-gedreven
interfaces.

Een handeling-gedreven (of functionele) API ontvangt niet een set gewijzigde velden, maar de
betekenis van wat er is gebeurd. Het verschil is wezenlijk: een data-gedreven API zegt "wijzig veld
X naar waarde Y", terwijl een functionele API zegt "registreer een eigendomsovergang" of "verwerk
een bezwaarafhandeling". De ontvanger interpreteert de handeling en bepaalt zelf welke gevolgen dat
heeft voor de registratie.

Dit sluit aan bij het concept van _conversational APIs_: interfaces die niet alleen fouten
retourneren, maar ook waarschuwingen en validatieresultaten kunnen teruggeven voordat een
registratie definitief wordt. Dit maakt het mogelijk om bedrijfsregels vooraf te toetsen en bij
twijfel de discretionaire bevoegdheid van de behandelaar te benutten, in plaats van achteraf
foutmeldingen te verwerken.

De beweging naar functionele APIs raakt direct aan dezelfde spanning tussen event-driven intentie en
synchronisatie-praktijk: het dienstbericht in de huidige WOZ-keten bevat al een gebeurtenislaag,
maar de kennisgevingen daarbinnen zijn data-gedreven. Een functionele API zou deze twee lagen
integreren.

## Smart Endpoints, Dumb Pipes

James Lewis en Martin Fowler formuleerden in hun invloedrijke artikel over
microservice-architecturen het principe _Smart Endpoints and Dumb Pipes_ [[SMART-ENDPOINTS]]:
applicaties bezitten hun eigen domeinlogica en communiceren via bewust eenvoudig gehouden kanalen.
Het principe staat tegenover de Enterprise Service Bus (ESB)-benadering, waarin intelligentie wordt
geconcentreerd in de communicatie-infrastructuur: routering, transformatie, businessregels en
choreografie.

Bij een ESB-architectuur is het de middleware die bepaalt hoe berichten worden gerouteerd,
getransformeerd en verwerkt. De endpoints (de applicaties die berichten versturen en ontvangen)
worden daardoor afhankelijk van de middleware: ze kunnen niet communiceren zonder de intelligentie
die in de bus is ingebouwd. Dit leidt tot een patroon waarin de complexiteit van de communicatie
groeit, de middleware steeds meer verantwoordelijkheden krijgt, en de endpoints steeds minder
zelfstandig zijn.

Het _Smart Endpoints and Dumb Pipes_-principe keert dit om. Applicaties zijn zelf verantwoordelijk
voor hun domeinlogica en communiceren via bewust eenvoudige kanalen: lichtgewicht HTTP-protocollen
of simpele message brokers die berichten routeren zonder ze te interpreteren. De intelligentie zit
bij de endpoints, niet in de pipe.

Het principe is geformuleerd in de context van microservices, maar de onderliggende observatie is
breder toepasbaar. De problematiek beschreven in
[De MSH als gescheiden component](#de-msh-als-gescheiden-component), waarin de complexiteit van de
transportlaag leidt tot een gescheiden MSH-component dat het end-to-end zicht op afleveringsstatus
en verwerking doorbreekt, laat zich herkennen als een geval van te veel intelligentie in de pipe.

Samen met de principes van Uit Betrouwbare Bron en de Common Ground-beweging wijst dit principe in
dezelfde richting: intelligentie hoort bij de applicatie, niet in de transportlaag.

## Werkgroep Historie

Binnen het Kennisplatform APIs wordt een werkgroep opgezet die zich richt op de vraag hoe
basisregistraties historie moeten ontsluiten en bijhouden via REST API's. De werkgroep richt zich op
generieke patronen die toepasbaar zijn voor iedere basisregistratie die de transitie van
StUF-gebaseerde uitwisseling naar REST API's maakt.

De werkgroep beoogt een handreiking op te leveren die beschrijft:

- Welke capabilities een register nodig heeft voor betrouwbare bijhouding en levering
- Hoe bijhoudings-APIs en leverings-APIs eruitzien wanneer historie en verantwoording worden
  onderkend
- Hoe verschillende implementatiestrategieën (enkelvoudige tijdlijn, bitemporeel, event sourcing)
  zich verhouden tot deze interface-eisen

De werkgroep is relevant voor elke registratie die de transitie van StUF naar REST API's doormaakt:
de uitdagingen rondom bitemporele historie, correctie-semantiek en gebeurtenis-gedreven uitwisseling
zijn niet uniek voor de WOZ. Patronen die in deze werkgroep worden ontwikkeld, kunnen direct worden
toegepast bij het ontwerp van nieuwe koppelvlakken.

## Informatiemodel WOZ

De Waarderingskamer beheert de inhoudelijke beschrijving van de WOZ-administratie. Het huidige kader
bestaat uit de Catalogus Basisregistratie WOZ, de Catalogus WOZ-gegevens voor afnemers en het
Gegevenswoordenboek WOZ. Een eerder initiatief om deze te integreren in een nieuw informatiemodel
(IMWOZ) is in 2022 gestopt, omdat het besluit tot vaststellen van dit IMWOZ model toen met een jaar
is uitgesteld om in die tijd meer duidelijkheid te krijgen van de gevolgen van de Common Ground
principes voor het WOZ-domein.

Inmiddels is er nieuwe voortgang. De huidige situatie is gemodelleerd conform MIM voor de volledige
gemeentelijke WOZ-administratie. Het resulterende document heeft echter nog geen bestuurlijke
vaststelling doorlopen.

Een structureel probleem is dat in geen van de beschikbare documentatie (StUF-WOZ 3.12, de nooit
uitgebrachte 3.13, noch het huidige IMWOZ-document) te zien is welke attributen bij de LV horen en
welke bij het gemeentelijke werkproces. Alles wat in het werkproces van belang is, staat erin. Het
enige document waaruit het daadwerkelijke informatiemodel van de LV kan worden afgeleid, is de XSD
die de norm is voor de XML-berichten naar de LV. Er hebben voorstellen gelegen voor een afzonderlijk
informatiemodel voor het LV-deel, maar deze zijn destijds niet tot uitvoering gekomen.

De ambitie is dan ook om een informatiemodel specifiek voor de LV te ontwikkelen. Dit zou een
belangrijk fundament bieden voor de standaardisatie van een nieuw koppelvlak.

## Haal Centraal WOZ Bevragen API

De WOZ Bevragen API [[KADASTER-WOZ-API]] is ontwikkeld door het Kadaster in samenwerking met VNG
Realisatie binnen het Haal Centraal-programma. De API stelt bronhouders in staat om WOZ-gegevens te
bevragen bij de LV-WOZ via een REST/JSON-interface.

Belangrijke beperkingen:

- De API is alleen voor **bevragingen**, niet voor aanlevering van mutaties
- Maximum 10.000 bevragingen per dag, 35 per minuut
- Geen massale bevragingen mogelijk
- Doorontwikkeling is gepauzeerd in afwachting van toepassingen waarvoor gemeenten ook geautoriseerd
  zijn om gegevens uit de LV WOZ te gebruiken en men voordeel ervaart van gebruik van een dergelijke
  API boven de breder gebruikte StUF bevragingsmogelijkheden of de standaard voorzieningen binnen
  MijnKadaster.

Naast de Haal Centraal API voor de WOZ is er ook een API waarmee de WOZ-gegevens uit de LV WOZ
worden opgevraagd voor het tonen op MijnOverheid. Deze API bevraagt de LV WOZ in combinatie met de
BRK. Ook de koppeling tussen de LV WOZ en het WOZ-waardeloket is gebaseerd op API's.

Een toenemend patroon is dat gemeenten ook afnemer worden van de LV. Waar een gemeente de WOZ-taken
uitbesteedt aan een belastingsamenwerkingsverband, kan de gemeente soms haar eigen data niet meer
rechtstreeks inzien. In die gevallen wordt de data via de Haal Centraal API opgehaald bij de LV. Dit
patroon groeit naarmate er meer grondslagen komen waarmee gemeenten WOZ-data mogen gebruiken, onder
meer voor de Omgevingswet.

## Binnengemeentelijke WOZ-API's

VNG Realisatie heeft binnengemeentelijke WOZ-bevragingen [[IMWOZ-BEVRAGINGEN]] in ontwikkeling: REST
API's voor het bevragen van WOZ-gegevens binnen de gemeente. Deze API's zijn bedoeld naast StUF-WOZ,
niet als vervanging. De huidige status (december 2024): "Deze API's zijn in ontwikkeling! Op dit
ogenblik zijn de API's nog niet volwassen genoeg om ingebouwd te worden in productie-software." De
ontwikkeling heeft tot nu toe geen concrete resultaten opgeleverd en kent beperkt draagvlak bij de
betrokken partijen.
