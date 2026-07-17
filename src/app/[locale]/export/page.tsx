import { useTranslations } from "next-intl";
import { CountryTable } from "@/components/editorial/CountryTable";
import { PageHero } from "@/components/editorial/PageHero";

const COUNTRY_FLAGS: Record<string, string> = {
  switzerland: "🇨🇭",
  france: "🇫🇷",
  germany: "🇩🇪",
  italy: "🇮🇹",
  usa: "🇺🇸",
};

const COUNTRY_ORDER = ["switzerland", "france", "germany", "italy", "usa"] as const;

export default function ExportPage() {
  const t = useTranslations("export");

  const rows = COUNTRY_ORDER.map((key) => ({
    key,
    flag: COUNTRY_FLAGS[key],
    name: t(`countries.${key}.name`),
    threshold: t(`countries.${key}.threshold`),
    keyPoint: t(`countries.${key}.keyPoint`),
  }));

  return (
    <main>
      <PageHero breadcrumbLabel={t("breadcrumb")} />

      <section className="w-full bg-white px-6 pt-16 pb-32">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight text-neutral-900">
            {t("heading")}
          </h1>
          <p className="text-neutral-600 leading-relaxed max-w-2xl mb-16">
            {t("intro")}
          </p>

          <CountryTable
            headers={{
              country: t("headers.country"),
              threshold: t("headers.threshold"),
              keyPoint: t("headers.keyPoint"),
              more: t("headers.more"),
            }}
            moreLabel={t("headers.more")}
            rows={rows}
          />
        </div>
      </section>
    </main>
  );
}