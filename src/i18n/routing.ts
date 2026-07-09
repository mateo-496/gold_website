import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "de", "it", "en"],
  defaultLocale: "fr",
});

export const COUNTRIES = ["switzerland", "france", "germany", "italy", "usa"] as const;
export type CountryKey = (typeof COUNTRIES)[number];
