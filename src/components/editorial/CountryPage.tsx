"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { CountryKey } from "@/i18n/routing";
import { PageHero } from "@/components/editorial/PageHero";

type Faq = { q: string; a: string };

export function CountryPage({ country }: { country: CountryKey }) {
  const locale = useLocale();
  const t = useTranslations(`countries.${country}`);
  const tPage = useTranslations("countryPage");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = t.raw("faqs") as Faq[];
  const exportPoints = t.raw("exportPoints") as string[];
  const reventePoints = t.raw("reventePoints") as string[];

  return (
    <main className="bg-white">
      <PageHero
        breadcrumbLabel={
          <>
            <Link href={`/${locale}/export`} className="hover:text-white transition-colors underline">
              {tPage("breadcrumbExport")}
            </Link>
            <span className="mx-2">/</span>
            <span>{t("name")}</span>
          </>
        }
      />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-6 pb-16">
        <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6 text-neutral-900">
          <span className="mr-3">{t("flag")}</span>
          {t("name")}
        </h1>
        <p className="text-neutral-600 leading-relaxed max-w-2xl text-lg">
          {t("intro")}
        </p>
      </section>

      {/* Stat badges */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200">
          <div className="bg-[#f5f5f5] p-8">
            <p className="text-sm uppercase tracking-wide text-neutral-500 mb-2">
              {t("stat1Label")}
            </p>
            <p className="font-serif italic text-3xl text-red-600">{t("stat1Value")}</p>
          </div>
          <div className="bg-[#f5f5f5] p-8">
            <p className="text-sm uppercase tracking-wide text-neutral-500 mb-2">
              {t("stat2Label")}
            </p>
            <p className="font-serif italic text-3xl text-red-600">{t("stat2Value")}</p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="font-serif text-3xl mb-6">{tPage("overview")}</h2>
        <p className="text-neutral-600 leading-relaxed max-w-2xl">{t("overview")}</p>
      </section>

      {/* Export points */}
      <section className="w-full bg-[#f5f5f5] px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl mb-8">{tPage("exportTitle")}</h2>
          <ul className="space-y-4">
            {exportPoints.map((point, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="text-red-600 mt-1">—</span>
                <span className="text-neutral-700 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/export`}
            className="inline-block mt-8 text-red-600 hover:opacity-70 transition-opacity text-sm"
          >
            {tPage("seeAllExport")}
          </Link>
        </div>
      </section>

      {/* Resale points */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl mb-8">{tPage("reventeTitle")}</h2>
        <ul className="space-y-4">
          {reventePoints.map((point, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="text-red-600 mt-1">—</span>
              <span className="text-neutral-700 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/revente`}
          className="inline-block mt-8 text-red-600 hover:opacity-70 transition-opacity text-sm"
        >
          {tPage("seeAllRevente")}
        </Link>
      </section>

      {/* FAQ */}
      <section className="w-full bg-[#f5f5f5] px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl mb-8">{tPage("faqTitle")}</h2>
          <div className="divide-y divide-neutral-300">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left py-6"
                >
                  <span className="font-serif text-lg pr-6">{faq.q}</span>
                  <span className="text-red-600 text-xl shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-neutral-600 leading-relaxed pb-6 max-w-2xl">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-3xl mb-4">{tPage("ctaTitle")}</h2>
        <p className="text-neutral-600 mb-8">
          {tPage("ctaText", { country: t("name") })}
        </p>
        <Link
          href={`/${locale}/achat`}
          className="inline-block bg-neutral-900 text-white px-8 py-3 hover:bg-neutral-700 transition-colors"
        >
          {tPage("ctaButton")}
        </Link>
      </section>
    </main>
  );
}