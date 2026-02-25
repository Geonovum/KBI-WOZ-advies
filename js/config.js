let respecConfig = {
  useLogo: true,
  useLabel: true,

  // TODO: title is verplicht! Neem hieronder de titel van het document op
  title: "Implementatie-advies modernisering gegevensaanlevering LV-WOZ",
  //-- specStatus is verplicht! (activeer 1 van de volgende)
  specStatus: "wv", // Werkversie
  //specStatus: "cv",               // Consultatieversie
  //specStatus: "vv",               // Versie ter vaststelling
  //specStatus: "def",              // Vastgestelde versie
  //specStatus: "basis",            // Basis Document

  //-- specType is verplicht bij alle andere dan BASIS
  //specType: "NO",                 // Norm
  //specType: "ST",                 // Standaard
  //specType: "IM",                 // Informatie Model
  //specType: "PR",                 // Praktijkrichtlijn
  specType: "HR", // HandReiking
  //specType: "WA",                 // Werkafspraak
  //specType: "BD",                 // Beheer Documentatie
  //specType: "AL",                 // Algemeen document
  //specType: "BP",                 // Best Practice

  //-- pubDomain is verplicht! (komt in de URL)
  //-- zie: https://geonovum.github.io/handleiding-tooling/ReSpec/#pubdomain
  //-- TODO: vul pubDomain in
  pubDomain: "kbi",

  //-- license: voor de geldende gebruiksvoorwaarden. Default is cc-by.
  //license: "cc-by-nd",            // bronvermelding, geen afgeleide werken (default)
  //license: "cc0",                 // Public Domain Dedication
  license: "cc-by", // Attribution, met bronvermelding

  //-- TODO shortName is verplicht! (komt in de URL: kies logische afkorting)
  shortName: "woz-advies",

  //edDraftURI = De URI van de draft version. Deze wordt automatisch afgeleid van de github URI; maar kan hier overschreven worden.
  //edDraftURI: ["https://geonovum.github.io", "/", "shortName"],

  //-- publishDate is verplicht. Als je werkversie gekozen hebt  dan pakt Respec
  //-- de pushdate maar de publishDate is nog steeds verplicht.
  publishDate: "2025-11-17",

  //-- publishVersion is verplicht. Hij mag wel leeg zijn [], maar niet de lege string zijn "".
  publishVersion: [],

  //-- Voor dit blok geldt: alleen als er eerdere versies zijn en altijd beide aan/uit!
  //previousPublishDate: "2014-05-01",
  //previousMaturity: "CV",

  //-- Deze gebruiken we niet binnen Geonovum
  //prevVersion: "0.0.1",

  //-- TODO: de namen van de Editor(s) / Redacteur(en)
  //-- vul in: per Editor: name:, company:, companyURL:
  editors: [
    {
      name: "Joost Farla",
      company: "Geonovum",
      companyURL: "https://www.geonovum.nl",
    },
    {
      name: "Frank Terpstra",
      company: "Geonovum",
      companyURL: "https://www.geonovum.nl",
    },
  ],

  //-- de namen van de auteur(s)
  //-- vul in: per auteur: name:, company:, companyURL:
  authors: [
    {
      name: "Joost Farla",
      company: "Geonovum",
      companyURL: "https://www.geonovum.nl",
    },
    {
      name: "Frank Terpstra",
      company: "Geonovum",
      companyURL: "https://www.geonovum.nl",
    },
  ],

  // TODO: Vul de github URL in.
  //neem hier de URL van de github repository op waar het respec document in staat
  github: "https://github.com/Geonovum/KBI-WOZ-advies",

  // Create PDF and link to file in header (optional):
  // TODO: Change the filename as preferred.
  //alternateFormats: [
  //    {
  //        label: "pdf",
  //        uri: "static/template.pdf",
  //    },
  //],

  // Lokale lijst voor bibliografie
  // - Kijk eerst naar de beschikbare www.specref.org .
  // - Kijk daarna in de organisatieconfig.
  // - Voeg dan pas hieronder toe.
  localBiblio: {
    MIM: {
      id: "MIM",
      title: "MIM - Metamodel Informatie Modellering",
      href: "https://docs.geostandaarden.nl/mim/mim/",
      status: "Definitief",
      publisher: "Geonovum",
    },
    LOGBOEK: {
      id: "LOGBOEK",
      title: "Logboek Dataverwerkingen",
      href: "https://logius-standaarden.github.io/logboek-dataverwerkingen/",
      publisher: "Logius",
    },
    "FORUM-STUF": {
      id: "FORUM-STUF",
      title: "StUF - Open Standaarden",
      href: "https://www.forumstandaardisatie.nl/open-standaarden/stuf",
      publisher: "Forum Standaardisatie",
    },
    "FORUM-STUF-EVAL": {
      id: "FORUM-STUF-EVAL",
      title: "Evaluatie StUF - Domein Uitwisselingsfundament",
      href: "https://www.forumstandaardisatie.nl/domein-uitwisselingsfundament-evaluatie-stuf-12-februari-2025",
      publisher: "Forum Standaardisatie",
      date: "2025-02-12",
    },
    "DK-ROADMAP": {
      id: "DK-ROADMAP",
      title: "Digikoppeling Roadmap 2024-2025",
      href: "https://gitdocumentatie.logius.nl/publicatie/dk/roadmap/2024-2025/",
      publisher: "Logius",
    },
    "HAAL-CENTRAAL-WOZ": {
      id: "HAAL-CENTRAAL-WOZ",
      title: "Haal Centraal WOZ Bevragen API",
      href: "https://github.com/kadaster/WOZ-bevragen",
      publisher: "Kadaster / VNG Realisatie",
    },
    "EBXML-MSG": {
      id: "EBXML-MSG",
      title: "ebXML Messaging Service Specification v2.0",
      href: "https://www.oasis-open.org/committees/ebxml-msg/documents/ebMS_v2_0.pdf",
      publisher: "OASIS",
      date: "2002-04-01",
    },
    "DK-EBMS2": {
      id: "DK-EBMS2",
      title: "Digikoppeling Koppelvlakstandaard ebMS2",
      href: "https://gitdocumentatie.logius.nl/publicatie/dk/ebms/",
      publisher: "Logius",
    },
    "LV-WOZ-KV": {
      id: "LV-WOZ-KV",
      title: "Koppelvlak Landelijke Voorziening WOZ v3.12",
      href: "https://www.waarderingskamer.nl/voor-gemeenten/gegevensbeheer/lv-woz",
      publisher: "Waarderingskamer / Kadaster",
      date: "2023-04-28",
    },
    "NL-API-STRATEGIE": {
      id: "NL-API-STRATEGIE",
      title: "API Strategie Algemeen - Nederlandse API Strategie",
      href: "https://docs.geostandaarden.nl/api/API-Strategie/",
      publisher: "Kennisplatform API's",
    },
    ADR: {
      id: "ADR",
      title: "REST API Design Rules",
      href: "https://gitdocumentatie.logius.nl/publicatie/api/adr/",
      publisher: "Logius",
    },
    NORA: {
      id: "NORA",
      title: "Nederlandse Overheid Referentie Architectuur",
      href: "https://www.noraonline.nl/",
      publisher: "ICTU",
    },
    GEMMA: {
      id: "GEMMA",
      title: "Gemeentelijke Model Architectuur",
      href: "https://www.gemmaonline.nl/",
      publisher: "VNG Realisatie",
    },
    "DK-RESTAPI": {
      id: "DK-RESTAPI",
      title: "Digikoppeling Koppelvlakstandaard REST-API",
      href: "https://gitdocumentatie.logius.nl/publicatie/dk/restapi/",
      publisher: "Logius",
    },
    "FSC-CORE": {
      id: "FSC-CORE",
      title: "FSC - Core",
      href: "https://gitdocumentatie.logius.nl/publicatie/fsc/core/",
      publisher: "Logius",
    },
    "DK-ARCH": {
      id: "DK-ARCH",
      title: "Digikoppeling Architectuur",
      href: "https://gitdocumentatie.logius.nl/publicatie/dk/architectuur/",
      publisher: "Logius",
    },
    "AS4-PROFILE": {
      id: "AS4-PROFILE",
      title: "AS4 Profile of ebMS 3.0 Version 1.0",
      href: "https://docs.oasis-open.org/ebxml-msg/ebms/v3.0/profiles/AS4-profile/v1.0/os/AS4-profile-v1.0-os.html",
      publisher: "OASIS",
      date: "2013-01-23",
    },
    "EDELIVERY-AS4": {
      id: "EDELIVERY-AS4",
      title: "eDelivery AS4 Profile",
      href: "https://ec.europa.eu/digital-building-blocks/sites/display/DIGITAL/eDelivery+AS4",
      publisher: "European Commission",
    },
    CPPA3: {
      id: "CPPA3",
      title: "Collaboration Protocol Profile and Agreement Version 3.0",
      href: "https://docs.oasis-open.org/ebcore/cppa/v3.0/cppa-v3.0.html",
      publisher: "OASIS",
      date: "2020-01-28",
    },
    "STUF-ONDERLAAG": {
      id: "STUF-ONDERLAAG",
      title: "StUF Berichtenstandaard",
      href: "https://vng-realisatie.github.io/StUF-onderlaag/",
      publisher: "VNG Realisatie",
    },
    "IMWOZ-BEVRAGINGEN": {
      id: "IMWOZ-BEVRAGINGEN",
      title: "Binnengemeentelijke IMWOZ-bevragingen API's",
      href: "https://vng-realisatie.github.io/IMWOZ-bevragingen/",
      publisher: "VNG Realisatie",
    },
    "KADASTER-WOZ-API": {
      id: "KADASTER-WOZ-API",
      title: "WOZ API Bevragen",
      href: "https://www.kadaster.nl/zakelijk/producten/adressen-en-gebouwen/woz-api-bevragen",
      publisher: "Kadaster",
    },
    "DIGILEVERING-WOZ": {
      id: "DIGILEVERING-WOZ",
      title: "WOZ Digilevering",
      href: "https://www.kadaster.nl/zakelijk/producten/adressen-en-gebouwen/woz-digilevering",
      publisher: "Kadaster",
    },
    "STUF-WOZ": {
      id: "STUF-WOZ",
      title: "StUF WOZ 03.12 - Technische specificaties LV WOZ",
      href: "https://www.waarderingskamer.nl/basisregistratie-woz-lv-woz/stuf-woz-0312/",
      publisher: "Waarderingskamer",
    },
    NEN3610: {
      id: "NEN3610",
      title: "NEN 3610:2022 - Basismodel geo-informatie",
      href: "https://www.nen.nl/nen-3610-2022-nl-296137",
      publisher: "NEN",
      date: "2022",
    },
    "STAAT-WOZ-2025": {
      id: "STAAT-WOZ-2025",
      title: "Staat van de WOZ 2025",
      href: "https://www.waarderingskamer.nl/documenten/02.-Over-ons/Staat-van-de-WOZ/Staat-van-de-WOZ-2025.pdf",
      publisher: "Waarderingskamer",
      date: "2025",
    },
    "SMART-ENDPOINTS": {
      id: "SMART-ENDPOINTS",
      title: "Microservices - Smart endpoints and dumb pipes",
      href: "https://martinfowler.com/articles/microservices.html#SmartEndpointsAndDumbPipes",
      authors: ["James Lewis", "Martin Fowler"],
      publisher: "martinfowler.com",
      date: "2014-03-25",
    },
  },
};
