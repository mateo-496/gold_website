import { CountryPage } from "@/components/editorial/CountryPage";
import { COUNTRIES, routing, type CountryKey } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    COUNTRIES.map((country) => ({ locale, country }))
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;

  setRequestLocale(locale);

  if (!COUNTRIES.includes(country as CountryKey)) {
    notFound();
  }

  return <CountryPage country={country as CountryKey} />;
}