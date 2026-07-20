import { CountryPage } from "@/components/editorial/CountryPage";
import { COUNTRIES, type CountryKey } from "@/i18n/routing";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;

  if (!COUNTRIES.includes(country as CountryKey)) {
    notFound();
  }

  return <CountryPage country={country as CountryKey} />;
}