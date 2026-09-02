# Functionele kaders

Dit hoofdstuk beschrijft de functionele eisen die de WOZ-keten stelt aan elke oplossingsrichting,
onafhankelijk van de gekozen technologie of standaarden. De eisen zijn afgeleid uit de Wet WOZ
[[WET-WOZ]], de Catalogus Basisregistratie WOZ [[CATALOGUS-WOZ]] en de behoeften van afnemers zoals
die naar voren komen uit de analyse in dit document.

Het doel van dit hoofdstuk is om een toetsingskader te bieden waartegen zowel de huidige inrichting
als alternatieven kunnen worden beoordeeld. De eisen in dit hoofdstuk betreffen het _wat_; de keuze
_hoe_ deze eisen worden ingevuld zijn architectuurkeuzes die aan bod komen in de
oplossingsrichtingen.

## Wettelijk kader

De Wet WOZ [[WET-WOZ]] beschrijft twee voorzieningen: de Basisregistratie WOZ bij de gemeente en de
Landelijke Voorziening WOZ bij de Dienst (het Kadaster). De wet legt twee verplichtingen vast die
aan de eisen in dit hoofdstuk ten grondslag liggen:

- **Leveren** (art. 37b, lid 1): Het college levert een waardegegeven met bijbehorende temporele en
  meta-kenmerken aan de Dienst ten behoeve van de opname in de landelijke voorziening WOZ.
- **Overeenstemmen** (art. 37aa, lid 3): De Dienst draagt er zorg voor dat de weergave van een in de
  landelijke voorziening WOZ opgenomen gegeven overeenstemt met het overeenkomstig artikel 37b,
  eerste lid, door het college verstrekte gegeven.

## Aanlevering en registratie

Uit de verplichtingen tot leveren en overeenstemmen volgen eisen aan het koppelvlak:

- De bronhouder moet in staat zijn alle relevante gegevens aan te leveren, inclusief correcties en
  wijzigingen met terugwerkende kracht.
- De LV-WOZ moet het door de bronhouder verstrekte gegeven getrouw kunnen weergeven en, na een
  bijgestelde levering, de weergave daarmee in overeenstemming kunnen brengen.

## Bitemporele historie

De WOZ-keten vereist bitemporele historie: de combinatie van materiële historie (wanneer iets in de
werkelijkheid geldig was) en formele historie (wanneer iets in de registratie is vastgelegd). Beide
dimensies zijn nodig voor het formele gebruik van de gegevens. Dat gebruik omvat belastingheffing in
het algemeen, en daarnaast bezwaar, beroep en verantwoording.

- **Materiële historie**: Afnemers moeten kunnen vaststellen welke gegevens op een bepaald moment in
  de werkelijkheid golden: welke waarde gold voor een belastingjaar, wie op dat moment
  belanghebbende was, en hoe het WOZ-object er toen uitzag. De waardepeildatum speelt hierbij een
  andere rol: die bepaalt naar welk moment een waarde is getaxeerd, niet vanaf wanneer een gegeven
  geldig is.
- **Formele historie**: De keten moet vastleggen wanneer gegevens zijn geregistreerd en wanneer zij
  beschikbaar kwamen voor afnemers. Het onderscheid tussen de formele historie van de bronhouder
  (wanneer de gemeente iets registreerde) en de formele historie van de LV (wanneer het voor
  afnemers beschikbaar werd) is hierbij relevant.

## Herhaalbaarheid en beschouwingsmomenten

Afnemers moeten kunnen reconstrueren welke gegevens op een bepaald moment beschikbaar waren. Dit
speelt bij bezwaar en beroep, maar evengoed bij het reguliere gebruik van de gegevens voor
belastingheffing en bij verantwoording achteraf. Het vereist herhaalbaarheid: dezelfde vraag met
dezelfde parameters moet hetzelfde antwoord opleveren, ongeacht wanneer de vraag wordt gesteld.

Herhaalbaarheid vraagt om twee beschouwingsmomenten, die de twee dimensies van de
[bitemporele historie](#bitemporele-historie) volgen. Beide moeten afzonderlijk kunnen worden
opgegeven bij een bevraging en afzonderlijk worden teruggegeven in het antwoord:

- **Beschouwingsmoment geldigheid**: het moment in de werkelijkheid waarnaar wordt gekeken, oftewel
  welke gegevens toen golden.
- **Beschouwingsmoment registratie**: het moment in de registratie waarnaar wordt gekeken, oftewel
  wat op dat moment was vastgelegd.

Eén enkelvoudig moment dekt beide dimensies niet. Een afnemer die later dezelfde vraag stelt met
dezelfde twee beschouwingsmomenten, ontvangt hetzelfde antwoord. Wordt alleen het moment van
geldigheid vastgezet, dan mag hetzelfde verzoek op een later tijdstip een ander antwoord opleveren.
In de huidige inrichting zijn dit de parameters `peiltijdstipMaterieel` en `peiltijdstipFormeel`; de
eis zelf staat los van die invulling.

Deze eis zegt niet van wélke registratie de formele tijdlijn maatgevend is. Dat is een ontwerpvraag,
die aan de orde komt bij [Formele historie](#formele-historie) en in de
[oplossingsrichtingen](#oplossingsrichtingen).

## Gebeurtenisgedreven karakter

De WOZ-keten is georganiseerd rondom gebeurtenissen: nieuwe beschikking, uitspraak op bezwaar,
wijziging of beëindiging van een WOZ-object, en dergelijke. Deze gebeurtenissen vervullen twee
functies:

- **Transactiebegrenzing**: een gebeurtenis definieert welke gegevensmutaties in samenhang moeten
  worden verwerkt.
- **Aanleiding voor afnemers**: het type gebeurtenis bepaalt welke vervolgactie een afnemer moet
  nemen. Een nieuwe beschikking vereist een andere reactie dan een uitspraak op bezwaar.

Het koppelvlak moet het type gebeurtenis dat de aanleiding vormt voor een gegevensmutatie kunnen
communiceren. Afnemers en de LV-WOZ gebruiken deze informatie voor respectievelijk procesbepaling en
validatie.

## Correctiesemantiek

Gemeenten moeten gegevens die zij eerder hebben geregistreerd kunnen bijstellen. Het koppelvlak moet
onderscheid kunnen maken tussen:

- **Wijzigingen**: er is iets in de werkelijkheid veranderd (bijvoorbeeld een nieuwe eigenaar)
- **Correcties**: de registratie was fout; de werkelijkheid is niet veranderd (bijvoorbeeld een
  verkeerd geregistreerde oppervlakte)

In de praktijk is dit onderscheid niet zwart-wit, en het is ook niet los te zien van de manier
waarop de gegevens zijn gemodelleerd. Staat de heer Jansen geregistreerd als gebruiker sinds 2009,
dan is het vastleggen dat mevrouw De Vries vanaf 1 april 2026 gebruiker is een wijziging. Stond
echter al geregistreerd dat Jansen gebruiker was tot 1 juni 2026, dan krijgt dezelfde verandering in
de werkelijkheid het karakter van een correctie: de einddatum bij Jansen klopte niet. In het huidige
model zijn de relatie tussen het WOZ-object en Jansen en die tussen het WOZ-object en De Vries
echter twee afzonderlijke entiteiten, elk met een eigen bitemporele historie. Of hier sprake is van
een correctie hangt er dan van af naar welke van de twee wordt gekeken.

Ook het spraakgebruik loopt niet gelijk met het historiemodel. Een waardeherziening na bezwaar wordt
in het dagelijks taalgebruik een correctie genoemd, terwijl het in het historiemodel een wijziging
is.

Beide begrippen vragen daarom een preciezere definitie dan hier wordt gegeven, in samenhang met de
modellering van objecten en relaties. Die definitie hoort bij het informatiemodel, bij voorkeur zo
generiek mogelijk geformuleerd; waar zij toch domeinspecifiek moet zijn, hoort zij thuis in de
domeinanalyse voor de WOZ.

Wat het koppelvlak hoe dan ook moet kunnen uitdrukken, is welke periode op de materiële tijdlijn
wordt geraakt en of een eerdere vastlegging daarmee wordt bijgesteld. Voor de vervolgactie bij
afnemers is de gebeurtenis leidend en niet de vraag of iets als wijziging of als correctie is
getypeerd; het gebeurtenistype draagt de aanleiding, en wat een afnemer daarmee doet volgt uit het
eigen werkproces (zie [Gebeurtenisgedreven karakter](#gebeurtenisgedreven-karakter)).

## Consistentievalidatie

WOZ-gegevens leiden bij afnemers tot financiële besluiten (belastingaanslagen, waterschapslasten).
Fouten in aangeleverde gegevens kunnen leiden tot het moeten terugdraaien van besluiten. Dit stelt
eisen aan de consistentie van doorgeleverde gegevens.

- Gegevens die de LV-WOZ doorlevert aan afnemers moeten intern consistent zijn.
- Het koppelvlak moet validatie mogelijk maken die waarborgt dat aangeleverde gegevens passen bij de
  eerder aangeleverde toestand en bij de gemelde gebeurtenis.
- Wanneer mutaties onderling afhankelijk zijn, moet het koppelvlak de benodigde verwerkingsvolgorde
  kunnen uitdrukken (bijvoorbeeld: een subject moet bekend zijn voordat een relatie met dat subject
  kan worden gelegd).

## Betrouwbare aflevering

Berichten mogen niet verloren gaan in de keten. Wanneer een bronhouder gegevens aanlevert, moet
vaststaan dat deze de LV-WOZ bereiken. Omgekeerd moet de bronhouder zekerheid hebben over de
verwerkingsstatus: is het bericht aangekomen, en zo ja, is het succesvol verwerkt of afgewezen?

Dit vereist:

- Een mechanisme voor ontvangstbevestiging
- Een mechanisme voor terugkoppeling over de verwerkingsstatus (succes of fout, met reden)
- De mogelijkheid om berichten veilig opnieuw aan te bieden zonder dubbele verwerking (idempotentie)

## Verwerking bij piekbelasting

De WOZ-keten kent een sterk seizoenspatroon. Na 1 januari leveren bronhouders circa 10 miljoen
beschikkingen aan in 8 weken. Het koppelvlak moet dit volume aankunnen zonder dat de kwaliteit of
betrouwbaarheid van de verwerking afneemt.

Dit stelt eisen aan:

- **Doorvoercapaciteit**: de keten moet het piekvolume binnen de wettelijke termijn kunnen
  verwerken.
- **Capaciteitsbeheersing**: wanneer de verwerkingscapaciteit van de LV-WOZ het aanlevertempo niet
  kan bijhouden, moet er een mechanisme zijn dat voorkomt dat berichten verloren gaan of dat
  bronhouders worden geblokkeerd zonder terugkoppeling.

## Notificatie van afnemers

Afnemers moeten tijdig worden geïnformeerd over wijzigingen in WOZ-gegevens, zodat zij hun processen
kunnen starten. Het koppelvlak moet daarvoor het type gebeurtenis en de betrokken objecten kunnen
communiceren, en wel zo tijdig dat de vervolgprocessen bij afnemers binnen de voor hen geldende
termijnen kunnen worden uitgevoerd.

Notificeren en bevragen staan hierbij niet los van elkaar. Zowel de Belastingdienst als de
waterschappen hebben behoefte aan gebeurtenisinformatie én aan de mogelijkheid om gegevens in een
gestandaardiseerd formaat op te halen; het CBS heeft daarnaast behoefte aan statistische
aggregaties. De keten moet in al deze vormen kunnen voorzien, en daarbij ook voldoen aan de
verwachtingen van afnemers over de reactiesnelheid bij bevragen.

## Autorisatie op attribuutniveau

Afnemers zijn niet voor dezelfde gegevens geautoriseerd. Zowel de Belastingdienst als de
waterschappen zijn geautoriseerd voor enkele gegevens die specifiek voor hen in de LV-WOZ staan; de
aanduiding gebouwd/ongebouwd en sluimerende WOZ-objecten zijn daarvan voorbeelden aan de kant van de
waterschappen. De keten moet per afnemer kunnen bepalen welke gegevens worden verstrekt, tot op het
niveau van het afzonderlijke attribuut, en zowel bij notificatie als bij bevraging.

Autorisatie is hierbij iets anders dan informatiebehoefte. Autorisatie bepaalt wat een afnemer mág
ontvangen en is een harde grens; de informatiebehoefte bepaalt wat een afnemer wíl ontvangen en
stuurt de filtering daarbinnen. Filtering op behoefte mag de autorisatiegrens niet vervangen.

## Traceerbaarheid en verantwoording

De keten moet herleidbaar zijn: welke gebeurtenis leidde tot welke datamutatie, wanneer is deze
verwerkt, en aan wie is deze doorgeleverd? Dit is relevant voor:

- **Bezwaar en beroep**: wanneer een belanghebbende bezwaar maakt, moet reconstrueerbaar zijn op
  basis van welke gegevens een beschikking is opgelegd.
- **Ketenverantwoording**: bij fouten in de keten moet vast te stellen zijn waar het misging (bij de
  bronhouder, in het transport, bij de LV, of bij de afnemer).
- **AVG-verantwoording**: welke persoonsgegevens zijn wanneer aan wie verstrekt?

## Logging van bevragingen en doelbinding

Waar traceerbaarheid zich richt op het herleiden van een gegeven door de keten, stelt de
verstrekking aan afnemers een eigen eis: elke bevraging moet worden gelogd, met vastlegging van wie
bevroeg, wat werd verstrekt en op welke grondslag. Dit maakt controleerbaar dat een afnemer gegevens
ontvangt en verwerkt met het doel waarvoor hij is geautoriseerd. Deze eis is bij bevraging zwaarder
dan bij notificatie, omdat de afnemer daar het initiatief heeft en het volume en de selectie niet
vooraf vastliggen.

## Identificatie en verwijzing

WOZ-gegevens verwijzen naar objecten en subjecten uit andere basisregistraties (BAG, BRK, BRP,
Handelsregister). Het koppelvlak moet eenduidige, persistente identificatie ondersteunen, zodat
gegevens betrouwbaar kunnen worden gekoppeld. Dit geldt voor:

- **Objecten**: WOZ-objecten en hun relatie met BAG-objecten.
- **Subjecten**: natuurlijke personen, niet-natuurlijke personen en vestigingen, geïdentificeerd met
  actuele identificatoren (BSN, RSIN, vestigingsnummer).
- **Relaties**: de relatie tussen een subject en een WOZ-object (bijvoorbeeld een belang) moet
  eenduidig identificeerbaar zijn, ook wanneer relaties worden beëindigd of gecorrigeerd.

De keuze welke identificerende gegevens worden meegegeven (alleen verwijzingen, of ook redundante
gegevens zoals naam en adres) is een functioneel-inhoudelijke afweging die samenhangt met de
beschikbaarheid van de gekoppelde registraties en de behoeften van afnemers.

## Afbakening

De bovenstaande eisen betreffen het koppelvlak en de keten tussen bronhouder, LV-WOZ en afnemers.
Verschillende eisen in dit hoofdstuk (notificatie, autorisatie, logging, herhaalbaarheid) raken de
afnemerskant. Dat is bewust: de aanlevering wordt in dit advies beoordeeld op wat zij de rest van de
keten mogelijk maakt, en de bestaande gebeurtenisberichten zijn juist vanuit dat afnemersperspectief
ontworpen (zie [Scope en afbakening](#scope-en-afbakening)).

De volgende zaken vallen buiten scope:

- De inrichting van gemeentelijke WOZ-systemen
- De interne architectuur van de LV-WOZ
- Het ontwerp van de bevragings-API's zelf. De eisen die bevraging aan de keten stelt
  (herhaalbaarheid, autorisatie, logging) staan wel in dit hoofdstuk, omdat zij bepalen wat er in de
  aanlevering en in de vastlegging bij de LV moet worden geborgd.
- Functioneel-inhoudelijke keuzes binnen het informatiemodel, zoals welke attributen worden
  opgenomen en de granulariteit van tijdregistratie. Deze keuzes zijn relevant, maar betreffen het
  informatiemodel, niet de standaarden- en architectuurkeuze die in dit document centraal staat.
