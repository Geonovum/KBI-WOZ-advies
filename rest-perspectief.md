# Het REST-perspectief

De voorgaande hoofdstukken behandelen de berichtenstandaard (StUF) en de MSH-gebaseerde
transportprotocollen (ebMS2, ebMS3/AS4). Dit hoofdstuk analyseert het REST-alternatief. Het
Digikoppeling REST API profiel biedt een modern alternatief, maar kent fundamenteel andere
uitgangspunten en mogelijkheden. Een grondige vergelijking is noodzakelijk om te beoordelen of met
dit REST-alternatief voldaan kan worden aan de functionele eisen die de WOZ-keten stelt (zie
[Functionele kaders](#functionele-kaders)).

## Het Digikoppeling REST API profiel

Het Digikoppeling REST API profiel [[DK-RESTAPI]] is de standaard voor REST-gebaseerde
gegevensuitwisseling binnen de overheid. Het profiel is gericht op machine-to-machine (M2M) en
government-to-government (G2G) interacties en vormt onderdeel van het bredere
Digikoppeling-ecosysteem.

### Kernkenmerken

Het REST API profiel schrijft voor:

- **Conformiteit aan de REST API Design Rules**: Volledige naleving van de ADR 2.0-standaard met
  regels voor naamgeving, URL-structuur, HTTP-methoden, foutafhandeling en versionering.
- **Tweezijdige TLS**: Authenticatie via PKIoverheid-certificaten met OIN-gebaseerde identificatie
  van organisaties.
- **FSC-standaard**: Sinds versie 2.0 is [Federated Service Connectivity (FSC)](#def-fsc) verplicht
  onderdeel van het profiel voor het beheren van API-toegang en logging.

### Functioneel toepassingsgebied

Het profiel richt zich op gesloten diensten tussen overheidspartijen waar tweezijdige authenticatie
noodzakelijk is. Het is primair ontworpen voor synchrone request-response patronen waarbij snelheid
belangrijker is dan gegarandeerde aflevering. Dit sluit niet in eerste instantie aan op de
functionele behoeften in de WOZ-keten.

## Vergelijking met MSH-gebaseerde protocollen

Op een aantal vlakken bieden het REST API profiel en de MSH-gebaseerde protocollen (ebMS2 en
ebMS3/AS4) vergelijkbare functionaliteit. Voor de vergelijking is het relevant om zowel ebMS2 (de
huidige standaard bij veel registraties) als ebMS3/AS4 (de opvolger van ebMS2 binnen Digikoppeling)
te beschouwen.

### Authenticatie en identificatie

Alle drie de profielen gebruiken PKIoverheid-certificaten en OIN-gebaseerde identificatie. De
cryptografische basis voor het vaststellen van de identiteit van organisaties is vergelijkbaar:

- **REST API**: Tweezijdige TLS (mTLS) met PKIoverheid-certificaten
- **ebMS2**: TLS in combinatie met WS-Security
- **ebMS3/AS4**: TLS met optionele WS-Security; het AS4-profiel ondersteunt ook MSH-niveau
  authenticatie via SAML-tokens

### Berichtondertekening en versleuteling

Het REST API profiel ondersteunt sinds versie 2.0 optionele ondertekening en versleuteling van
berichten. ebMS2 en ebMS3/AS4 bieden vergelijkbare functionaliteit via WS-Security. Bij alle drie de
profielen is het gebruik configureerbaar; ebMS3/AS4 biedt meer flexibiliteit dan ebMS2 via MSH
Profile Management.

### Logging en verantwoording

FSC schrijft transactielogging voor met UUID v7-gebaseerde transactie-ID's. Dit biedt een
gestandaardiseerde manier om te traceren welke gegevens wanneer zijn uitgewisseld. Bij
MSH-gebaseerde protocollen wordt logging verzorgd door de MSH-component:

- **ebMS2**: MSH-logging van verzonden en ontvangen berichten, acknowledgements en fouten
- **ebMS3/AS4**: Vergelijkbare MSH-logging, met uitgebreidere MSH Profile Management voor het
  configureren van wat wordt gelogd

De FSC-logging is specifieker gericht op het koppelen van logs over organisatiegrenzen heen, wat bij
MSH-logging per implementatie verschilt.

Aanvullend op FSC-transactielogging biedt het [Logboek Dataverwerkingen](#def-logboek) een standaard
voor het vastleggen van _wat_ er met gegevens is gebeurd: welke gegevens zijn verwerkt, door wie,
wanneer en voor welk doel. Waar FSC-logging technische correlatie tussen API-aanroepen mogelijk
maakt, richt Logboek Dataverwerkingen zich op de inhoudelijke verantwoording die nodig is voor
AVG-compliance en transparantie naar burgers. De standaard is in ontwikkeling bij Logius en beoogt
opname op de lijst met aanbevolen standaarden. Voor de WOZ-keten kan deze standaard een
gestructureerde manier bieden om te verantwoorden welke WOZ-gegevens aan welke afnemers zijn
verstrekt.

### Toegangsbeheer

De drie profielen hanteren verschillende modellen voor toegangsbeheer:

- **ebMS2**: Bilaterale Collaboration Protocol Agreements (CPA's) die per partijcombinatie worden
  afgesloten en beheerd
- **ebMS3/AS4**: MSH Profile Management (PModes) die flexibeler zijn dan CPA's en minder bilaterale
  coördinatie vereisen
- **REST API met FSC**: Contracts en Grants via een gedistribueerd model met centrale Directory

FSC Contracts zijn conceptueel vergelijkbaar met CPA's en PModes, maar met een moderner, meer
gedistribueerd beheermodel. De FSC Directory biedt service discovery functionaliteit die bij ebMS2
en ebMS3 niet gestandaardiseerd is.

### Reliable messaging

Dit is het gebied waar de protocollen fundamenteel verschillen:

| Aspect                | REST API                         | ebMS2                | ebMS3/AS4            |
| --------------------- | -------------------------------- | -------------------- | -------------------- |
| Reliable messaging    | Niet gestandaardiseerd           | MSH-niveau garantie  | MSH-niveau garantie  |
| Exactly-once          | Via Idempotency-Key (optioneel)  | MSH-functionaliteit  | MSH-functionaliteit  |
| Asynchrone verwerking | Mogelijk, niet gestandaardiseerd | Native ondersteuning | Native ondersteuning |

ebMS3/AS4 biedt dezelfde reliable messaging functionaliteit als ebMS2, maar met een modernere
technische basis en betere aansluiting bij actuele WS-\* standaarden. Voor scenario's waar
gegarandeerde aflevering essentieel is, blijft een MSH-gebaseerd protocol (ebMS2 of ebMS3/AS4) de
gestandaardiseerde keuze binnen Digikoppeling.

## Wat niet is gestandaardiseerd

De fundamentele verschillen tussen het REST API profiel en ebMS2/StUF betreffen niet zozeer
technische onmogelijkheden, maar het ontbreken van standaardisatie. REST en HTTP bieden de
technische bouwstenen om vergelijkbare functionaliteit te realiseren, maar de generieke standaarden
schrijven niet voor _hoe_ dit moet gebeuren. Dit leidt tot een situatie waarin elke implementatie
eigen keuzes maakt, wat de interoperabiliteit beperkt.

### Betrouwbaarheid

Het REST API profiel is een _best-effort_ standaard. De Digikoppeling architectuur [[DK-ARCH]] is
hier expliciet over: "Is betrouwbaarheid belangrijker, kies dan voor een koppelvlakstandaard dat
reliable messaging ondersteunt (ebMS)."

| Aspect                | ebMS2                   | REST API profiel                                     |
| --------------------- | ----------------------- | ---------------------------------------------------- |
| Reliable messaging    | Gestandaardiseerd (MSH) | Technisch mogelijk, niet gestandaardiseerd           |
| Exactly-once delivery | Gestandaardiseerd       | Implementeerbaar via idempotency patterns            |
| Automatische retry    | Protocol-niveau         | Applicatie-niveau (exponential backoff aanbevolen)   |
| Duplicaat-eliminatie  | MSH-functionaliteit     | Idempotency-Key header (beschikbaar, niet verplicht) |

REST API's _kunnen_ betrouwbaar worden gemaakt. De `Idempotency-Key` header maakt het mogelijk om
POST- en PATCH-operaties veilig te herhalen. De
[richtlijnen op developer.overheid.nl](https://developer.overheid.nl/kennisbank/apis/gedrag-en-implementatie/retries-met-volledige-idempotency)
beschrijven hoe dit correct te implementeren, inclusief de vereiste voor atomaire transacties om
race conditions te voorkomen. Maar dit is:

- **Niet verplicht** in het Digikoppeling REST API profiel
- **Niet uniform** geïmplementeerd, omdat elke API eigen keuzes kan maken
- **Afhankelijk van beide kanten**, aangezien client én server het correct moeten implementeren

Het verschil met ebMS2 is dat de MSH-specificatie precies voorschrijft hoe betrouwbaarheid wordt
gerealiseerd. Bij REST moet elke API-aanbieder zelf bepalen of en hoe dit wordt geïmplementeerd.

### Capaciteitsbeheersing en backpressure

Een aspect dat bij de vergelijking vaak over het hoofd wordt gezien, is capaciteitsbeheersing. De
asynchrone modus van ebMS2 en ebMS3/AS4 biedt ingebouwde mechanismen voor _backpressure_: wanneer
een ontvanger de stroom niet kan bijbenen, kan het protocol de verzender vertragen. De
MSH-administratie buffert berichten en past het verzendtempo aan op basis van hoe snel
acknowledgements terugkomen.

Bij synchrone communicatie (zowel ebMS als REST) werkt flow control anders: de client blokkeert tot
de server een response geeft. De client kan niet sneller versturen dan de server kan verwerken, maar
er is geen protocol-niveau buffering. Bij overbelasting ontvangt de client een foutresponse en moet
zelf bepalen wanneer opnieuw te proberen.

Dit onderscheid is relevant voor ketens met volumepieken, zoals de WOZ, waar:

- Bronhouders in de piekperiode grote volumes willen aanleveren
- De verwerkingscapaciteit van de LV-WOZ begrensd is
- Zowel verzenders als ontvangers baat hebben bij gecontroleerde doorstroming

Bij synchrone REST API's is capaciteitsbeheersing niet gestandaardiseerd:

- **Rate limiting**: De `429 Too Many Requests` response is beschikbaar, maar het gedrag na een 429
  (hoe lang wachten, hoe vaak herhalen) is per API verschillend
- **Retry-after header**: Kan worden gebruikt om aan te geven wanneer een client opnieuw mag
  proberen, maar is niet verplicht
- **Client-side buffering**: Moet door de client worden geïmplementeerd wanneer de server overbelast
  is

Voor een keten met sterke volumepieken betekent dit dat bij een REST-transitie expliciet moet worden
gestandaardiseerd hoe capaciteitsbeheersing werkt: welke rate limits gelden, hoe clients moeten
reageren op overbelasting, en of er een server-side buffering-mechanisme beschikbaar is
(bijvoorbeeld via een asynchrone acceptatie met queue).

### Asynchrone verwerking

HTTP en REST ondersteunen asynchrone patronen. Een gangbare aanpak is:

1. Client stuurt POST-request
2. Server retourneert HTTP 202 Accepted met een `Location` header
3. Client pollt de opgegeven URL voor de status

Dit patroon wordt gebruikt in diverse overheids-API's, maar er is geen gestandaardiseerde
beschrijving van hoe dit moet werken. Vragen als "hoe vaak mag de client pollen?", "hoe wordt de
uiteindelijke response opgehaald?", en "hoe lang blijft het resultaat beschikbaar?" worden per API
anders beantwoord.

Een alternatief voor polling is het webhook-patroon: de client registreert een callback-URL waarop
de server een notificatie stuurt zodra de verwerking is afgerond. Dit vermijdt de overhead van
herhaalde poll-requests en levert snellere notificaties. Webhooks introduceren echter eigen
uitdagingen:

- De client moet een publiek bereikbaar endpoint aanbieden
- Authenticatie en autorisatie van inkomende webhook-calls moet worden geregeld
- Retry-gedrag bij onbereikbaarheid van de client is niet gestandaardiseerd
- De volgorde van webhook-notificaties is niet gegarandeerd

Binnen de NL GOV API-strategie wordt gewerkt aan standaardisatie van notificaties via Cloudevents,
maar deze standaard is nog niet breed geadopteerd.

ebMS2 standaardiseert dit: acknowledgements worden asynchroon verstuurd naar een vooraf afgesproken
endpoint, met gedefinieerde timeouts en retry-gedrag. Bij REST moet dit per API worden
gespecificeerd.

### Volgorde-afhandeling

REST API's kunnen volgorde-afhankelijke verwerking ondersteunen door:

- Sequence-nummers in de payload op te nemen
- Optimistic locking via ETags of versienummers
- Synchrone verwerking waarbij de client wacht op bevestiging

Maar er is geen standaard die voorschrijft hoe dit te doen voor overheids-API's. Elke implementatie
kiest eigen mechanismen, wat de interoperabiliteit beperkt.

### Correctie-semantiek en bitemporele historie

StUF definieert expliciete mutatiesoorten (T, V, W, F) die aangeven of een wijziging een reguliere
update is of een correctie van eerder geregistreerde gegevens. In combinatie met de
[bitemporele elementen](#def-bitemporeel) (`beginGeldigheid`, `eindGeldigheid`,
`tijdstipRegistratie`) maakt dit de opbouw van volledige historie mogelijk. De details van deze
StUF-functionaliteit komen aan bod in
[Toestandsoverdracht en volgorde-afhankelijkheid](#toestandsoverdracht-en-volgorde-afhankelijkheid).

REST API's kunnen vergelijkbare functionaliteit bieden, bijvoorbeeld via:

- Een `mutatieSoort` veld in de payload
- Aparte endpoints voor correcties versus reguliere mutaties
- Bitemporele velden in de JSON-payload

Maar er is geen overheidsbreed gestandaardiseerd model:

- De HTTP-methoden PUT en PATCH beschrijven _wat_ er gebeurt (vervangen of partieel wijzigen), niet
  _waarom_ (nieuwe informatie versus correctie)
- De NL API Strategie definieert tijdreisparameters voor _bevragingen_, niet voor _aanlevering_
- Zonder standaardisatie implementeert elke API dit anders

De uitdaging bij een REST-transitie is niet dat dit technisch onmogelijk is, maar dat er een
vergelijkbaar interoperabel model moet worden gedefinieerd en geadopteerd.

## De rol van FSC

De Federated Service Connectivity (FSC) [[FSC-CORE]] standaard, sinds december 2024 vastgesteld door
de Programmeringsraad GDI, is een verplicht onderdeel van het Digikoppeling REST API profiel. FSC
richt zich op _connectiviteit_: het vinden, autoriseren en loggen van API-aanroepen tussen
organisaties.

### Functionaliteit

FSC biedt:

- **Federated service discovery**: Een Directory waarin API's worden gepubliceerd en gevonden
- **Contract-gebaseerd toegangsbeheer**: Digitaal ondertekende Contracts tussen organisaties
- **Gestandaardiseerde logging**: Transactie-ID's (UUID v7) voor correlatie over organisatiegrenzen
- **Gedelegeerde toegang**: Mogelijkheid om namens een andere organisatie te handelen

Met deze functionaliteit adresseert FSC een vergelijkbare behoefte als de CPA's in ebMS2: het
formaliseren van afspraken tussen organisaties over wie welke diensten mag afnemen. Het beheermodel
is echter fundamenteel anders: waar CPA's bilaterale coördinatie vereisen, werkt FSC met een
gedistribueerd model waarin de Directory als centraal register fungeert.

### Scope-afbakening

FSC is bewust beperkt tot connectiviteit. Zaken als betrouwbare aflevering, berichtsemantiek en
domeinspecifieke datamodellen vallen buiten de scope van FSC. Niet omdat FSC tekortschiet, maar
omdat dit andere vraagstukken zijn die op andere lagen moeten worden geadresseerd:

- **Betrouwbaarheid**: Een applicatie-niveau verantwoordelijkheid of een keuze voor een ander
  protocol (ebMS3/AS4)
- **Berichtsemantiek**: Een domeinspecifieke standaardisatie-opgave (vergelijkbaar met StUF-WOZ)
- **Bitemporele modellering**: Een informatiemodel-vraagstuk (MIM, IMWOZ)

FSC en deze andere aspecten zijn complementair, niet concurrerend.

## De transitie-uitdaging

De transitie weg van StUF is fundamenteel anders dan de transitie van ebMS2 naar ebMS3/AS4 of REST.

### Wat verloren gaat

Bij een transitie naar generieke REST API's zonder domeinspecifieke standaardisatie gaat
StUF-functionaliteit verloren:

| StUF-functionaliteit             | Status bij generieke REST                  |
| -------------------------------- | ------------------------------------------ |
| Mutatiesoorten (T, V, W, F)      | Niet gestandaardiseerd                     |
| Bitemporele elementen            | Alleen voor bevragingen (NL API Strategie) |
| Kennisgevingspatroon (oud/nieuw) | Niet gestandaardiseerd                     |
| Sectorspecifiek objectmodel      | Per API opnieuw te definiëren              |

### Wat moet worden gestandaardiseerd

De functionele eisen uit [Functionele kaders](#functionele-kaders) worden in de huidige inrichting
ingevuld door de combinatie van ebMS2 en StUF. Om aan deze eisen te blijven voldoen in een
REST-gebaseerde architectuur, moet het volgende worden gestandaardiseerd:

1. **Een mutatiemodel**: Hoe worden toevoegingen, wijzigingen en correcties onderscheiden in een
   REST API?
2. **Bitemporele aanlevering**: Welke velden zijn verplicht, wat is hun semantiek?
3. **Een WOZ-specifiek datamodel**: MIM-conforme modellen en JSON-schema's voor WOZ-gegevens
4. **Interactiepatronen**: Hoe worden kennisgevingen vertaald naar REST-operaties, of iets anders?
5. **Capaciteitsbeheersing**: Hoe gaan clients om met overbelasting? Welke rate limits gelden, wat
   is het retry-gedrag, en is er server-side buffering?

Dit is geen technisch probleem, want REST _kan_ dit allemaal ondersteunen. Het is een
standaardisatie-opgave die tijd, governance en adoptie vereist.

### Uitbesteding bij REST

Bij een REST-architectuur vervalt de noodzaak van een MSH als apart component. De WOZ-applicatie
communiceert rechtstreeks via HTTP met de LV-WOZ (of via lichtgewicht tussenliggende componenten).
Daarmee verdwijnt de architecturele scheiding die in
[De MSH als gescheiden component](#de-msh-als-gescheiden-component) is beschreven als bron van
verlies van end-to-end zicht.

De organisatorische behoefte aan uitbesteding blijft wel bestaan: bronhouders willen op diverse
vlakken ontzorgd worden. De complexiteitsdrempel verschuift (REST API's zijn toegankelijker dan
ebMS/StUF), maar uitbesteding van hosting, beheer of connectiviteit blijft een gangbaar patroon. Het
koppelvlak moet zo worden ontworpen dat de kwaliteit en transparantie van de keten behouden blijven,
ongeacht of de bronhouder de technische implementatie zelf beheert of uitbesteedt. Synchrone
communicatie biedt hier voordelen: wanneer de bronhouder direct een response ontvangt, is de
verwerkingsstatus onmiddellijk duidelijk.

## Samenvatting REST

De transitie van ebMS2/StUF naar REST API's is niet triviaal, maar niet omdat REST technisch
ontoereikend zou zijn. Het verschil zit in de mate van standaardisatie. ebMS2 en StUF bieden een
volledig gestandaardiseerd pakket: het protocol, de betrouwbaarheidsgaranties, het berichtformaat en
de semantiek zijn alle voorgeschreven. Bij REST API's zijn de generieke bouwstenen beschikbaar, maar
moet de domeinspecifieke invulling nog worden gestandaardiseerd.

Het Digikoppeling REST API profiel met FSC biedt een solide basis voor:

- Authenticatie en identificatie via mTLS en OIN
- Toegangsbeheer via Contracts en Grants
- Transactielogging voor verantwoording
- Service discovery via de Directory

Wat overblijft is een domeinspecifieke standaardisatie-opgave per registratie. Voor de WOZ-keten
betreft dit de functionele eisen uit [Functionele kaders](#functionele-kaders) waarvoor bij REST nog
geen standaard bestaat:

- [Bitemporele historie](#bitemporele-historie): een gestandaardiseerd model voor bitemporele
  aanlevering
- [Correctiesemantiek](#correctiesemantiek): uniforme correctie-semantiek
- [Betrouwbare aflevering](#betrouwbare-aflevering): afspraken over betrouwbaarheid en idempotentie
- [Verwerking bij piekbelasting](#verwerking-bij-piekbelasting): capaciteitsbeheersing en
  backpressure-mechanismen
- Eventueel een patroon voor asynchrone verwerking
