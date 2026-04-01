# Oplossingsrichtingen

Dit hoofdstuk wordt uitgewerkt in de volgende fase. De onderstaande secties bevatten input uit de
analyse die bij de uitwerking moet worden meegenomen.

Bij het formuleren van oplossingsrichtingen is een spanning relevant die in de analyse naar voren
komt: hoe minder goed een bronhouder in staat is om de kwaliteit van zijn registratie te borgen, hoe
groter de behoefte bij afnemers aan rijke gebeurtenissemantiek om de datamutaties te kunnen duiden.
Maar juist die bronhouders zijn het minst in staat om die semantiek te leveren. Omgekeerd geldt: bij
een bron met perfecte processen en volledige verantwoording volstaat eenvoudige datasynchronisatie,
omdat de kwaliteit al geborgd is. De oplossingsrichtingen moeten rekening houden met dit
spanningsveld.

## Validatiestrategie

Er tekenen zich twee benaderingen af voor de omgang met validatie:

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
bronhouder kan externe experts een rol toekennen om aangeleverde data te beoordelen.

Het achterliggende principe is dat de verantwoordelijkheid bij de gemeente ligt, en dat de gemeente
in staat moet worden gesteld om controles al te doen voordat zij iets verzendt.

## Notificatiestrategie

Bij de inrichting van een notificatiedienst is een fundamentele keuze of notificaties informatierijk
of informatiearm zijn. Bij informatiearme notificaties (het notify-pull patroon) ontvangen afnemers
alleen een signaal dat er iets is gewijzigd en halen vervolgens zelf de actuele gegevens op via een
bevraging. Bij informatierijke notificaties bevat het bericht zelf de relevante gegevens, zoals in
de huidige WOZ-keten het geval is.

Het notify-pull patroon past bij de principes van "data bij de bron" en federatief databeheer, en
wordt breed aanbevolen in de context van Common Ground en het Federatief Datastelsel. Beide patronen
hebben echter specifieke consequenties voor de WOZ-keten.

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
Waterschappen hebben daarentegen behoefte aan specifieke gegevens die niet uit een
standaardbevraging komen, zoals het adres waarnaar de gemeente de beschikking heeft gestuurd, zodat
de waterschapsaanslag naar hetzelfde adres kan.

Dit wijst erop dat de vraag niet zozeer "informatierijk of informatiearm" is, maar welk patroon bij
welke afnemer past. De keuze heeft directe gevolgen voor het ontwerp van de notificatiedienst en
moet vroeg in het ontwerpproces worden gemaakt.

Een mogelijk transitiepad is dat afnemers beginnen met informatiearm interpreteren: zij ontvangen
nog steeds de volledige notificatie maar halen er uitsluitend de identificatie uit. Dit geeft ruimte
om later ook alleen notificaties met identificatie te sturen, zonder dat dit een verandering vergt
aan de kant van de afnemer.

## Kopiegegevens en verwijzingen

Bij een nieuw koppelvlak kan worden onderzocht of vermindering van de redundantie in kopiegegevens
haalbaar is, waarbij rekening moet worden gehouden met niet-ingezetenen waarvoor de WOZ soms de
enige plek is waar subjectgegevens zijn vastgelegd.
