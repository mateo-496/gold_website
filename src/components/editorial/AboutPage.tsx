import { useTranslations } from "next-intl";
import { PageHero } from "@/components/editorial/PageHero";

const SECTION_KEYS = ["mission", "editorial", "coverage"] as const;

export function AboutPage() {
  const t = useTranslations("about");

  return (
    <main>
      <PageHero breadcrumbLabel={t("breadcrumb")} imageSrc="/images/backgrounds/mountain1.jpeg" />

      <section className="w-full bg-white px-6 pt-16 pb-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight text-neutral-900">
            {t("heading")}
          </h1>
          <p className="text-neutral-600 leading-relaxed text-lg mb-20">{t("intro")}</p>

          <div className="flex flex-col gap-16">
            {SECTION_KEYS.map((key) => (
              <div key={key} className="border-t border-neutral-200 pt-10">
                <h2 className="font-serif italic text-2xl text-neutral-900 mb-4">
                  {t(`sections.${key}.title`)}
                </h2>
                <p className="text-neutral-600 leading-relaxed">{t(`sections.${key}.text`)}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-neutral-400 leading-relaxed mt-20 border-t border-neutral-200 pt-8">
            {t("disclaimer")}
          </p>
        </div>
      </section>
    </main>
  );
}