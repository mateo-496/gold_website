import Image from "next/image";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/editorial/PageHero";

const SECTION_KEYS = ["mission", "editorial", "coverage"] as const;

// Fill in as hires are confirmed — each slot renders a placeholder until `photo` is set.
const TEAM: { key: string; photo?: string }[] = [
  { key: "member1" },
  { key: "member2" },
  { key: "member3" },
];

export function AboutPage() {
  const t = useTranslations("about");

  return (
    <main>
      <PageHero breadcrumbLabel={t("breadcrumb")} imageSrc="/images/backgrounds/mountain1.jpeg" />

      <section className="w-full bg-white px-6 pt-16 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Standard mark, on white — the letterhead moment. */}
          <div className="flex justify-center mb-16">
            <div className="relative h-36 md:h-52 w-36 md:w-96">
              <Image
                src="/images/logo/logo.svg"
                alt="GoldAlp"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight text-neutral-900 text-center">
            {t("heading")}
          </h1>
          <p className="text-neutral-600 leading-relaxed text-lg mb-20 text-center">
            {t("intro")}
          </p>

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

          {/* Team */}
          <div className="border-t border-neutral-200 pt-10 mt-16">
            <h2 className="font-serif italic text-2xl text-neutral-900 mb-4">
              {t("sections.team.title")}
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-10">{t("sections.team.text")}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {TEAM.map(({ key, photo }) => (
                <div key={key} className="flex flex-col">
                  <div className="relative aspect-[3/4] w-full bg-neutral-100 border border-neutral-200 overflow-hidden">
                    {photo ? (
                      <Image src={photo} alt={t(`team.${key}.name`)} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-3xl text-neutral-300">
                          {t(`team.${key}.initial`)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-serif text-base text-neutral-900 mt-4">
                    {t(`team.${key}.name`)}
                  </span>
                  <span className="text-sm text-neutral-500">{t(`team.${key}.role`)}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-neutral-400 leading-relaxed mt-20 border-t border-neutral-200 pt-8">
            {t("disclaimer")}
          </p>
        </div>
      </section>
    </main>
  );
}