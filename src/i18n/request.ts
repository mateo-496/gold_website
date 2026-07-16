import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Namespace files (one per page/section)
import frNav from "../messages/fr/nav.json";
import frCategories from "../messages/fr/categories.json";
import frExport from "../messages/fr/export.json";
import frRevente from "../messages/fr/revente.json";
import frCountryPage from "../messages/fr/countryPage.json";
import frFooter from "../messages/fr/footer.json";

import deNav from "../messages/de/nav.json";
import deCategories from "../messages/de/categories.json";
import deExport from "../messages/de/export.json";
import deRevente from "../messages/de/revente.json";
import deCountryPage from "../messages/de/countryPage.json";
import deFooter from "../messages/de/footer.json";

import itNav from "../messages/it/nav.json";
import itCategories from "../messages/it/categories.json";
import itExport from "../messages/it/export.json";
import itRevente from "../messages/it/revente.json";
import itCountryPage from "../messages/it/countryPage.json";
import itFooter from "../messages/it/footer.json";

import enNav from "../messages/en/nav.json";
import enCategories from "../messages/en/categories.json";
import enExport from "../messages/en/export.json";
import enRevente from "../messages/en/revente.json";
import enCountryPage from "../messages/en/countryPage.json";
import enFooter from "../messages/en/footer.json";

// Country profile files
import frSwitzerland from "../messages/fr/countries/switzerland.json";
import frFrance from "../messages/fr/countries/france.json";
import frGermany from "../messages/fr/countries/germany.json";
import frItaly from "../messages/fr/countries/italy.json";
import frUsa from "../messages/fr/countries/usa.json";

import deSwitzerland from "../messages/de/countries/switzerland.json";
import deFrance from "../messages/de/countries/france.json";
import deGermany from "../messages/de/countries/germany.json";
import deItaly from "../messages/de/countries/italy.json";
import deUsa from "../messages/de/countries/usa.json";

import itSwitzerland from "../messages/it/countries/switzerland.json";
import itFrance from "../messages/it/countries/france.json";
import itGermany from "../messages/it/countries/germany.json";
import itItaly from "../messages/it/countries/italy.json";
import itUsa from "../messages/it/countries/usa.json";

import enSwitzerland from "../messages/en/countries/switzerland.json";
import enFrance from "../messages/en/countries/france.json";
import enGermany from "../messages/en/countries/germany.json";
import enItaly from "../messages/en/countries/italy.json";
import enUsa from "../messages/en/countries/usa.json";

const MESSAGES = {
  fr: {
    nav: frNav,
    categories: frCategories,
    export: frExport,
    revente: frRevente,
    countryPage: frCountryPage,
    footer: frFooter,
    countries: {
      switzerland: frSwitzerland,
      france: frFrance,
      germany: frGermany,
      italy: frItaly,
      usa: frUsa,
    },
  },
  de: {
    nav: deNav,
    categories: deCategories,
    export: deExport,
    revente: deRevente,
    countryPage: deCountryPage,
    footer: deFooter,
    countries: {
      switzerland: deSwitzerland,
      france: deFrance,
      germany: deGermany,
      italy: deItaly,
      usa: deUsa,
    },
  },
  it: {
    nav: itNav,
    categories: itCategories,
    export: itExport,
    revente: itRevente,
    countryPage: itCountryPage,
    footer: itFooter,
    countries: {
      switzerland: itSwitzerland,
      france: itFrance,
      germany: itGermany,
      italy: itItaly,
      usa: itUsa,
    },
  },
  en: {
    nav: enNav,
    categories: enCategories,
    export: enExport,
    revente: enRevente,
    countryPage: enCountryPage,
    footer: enFooter,
    countries: {
      switzerland: enSwitzerland,
      france: enFrance,
      germany: enGermany,
      italy: enItaly,
      usa: enUsa,
    },
  },
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: MESSAGES[locale],
  };
});