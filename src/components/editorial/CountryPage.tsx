"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { CountryKey } from "@/i18n/routing";
import { PageHero } from "@/components/editorial/PageHero";
import { CustomsTable } from "@/components/editorial/CustomsTable";
import { SimpleTable } from "@/components/editorial/SimpleTable";

type Faq = { q: string; a: string };
type CustomsRow = { range: string; requirement: string; formLabel?: string; formUrl?: string };
type ResaleRow = { scenario: string; treatment: string };
type SectionTitles = { investmentGold: string; vat: string; customs: string; resale: string; faq: string };

export function CountryPage({ country }: { country: CountryKey }) {
  const locale = useLocale();
  const t = useTranslations(`countries.${country}`);
  const tPage = useTranslations("countryPage");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = t.raw("faqs") as Faq[];
  const customsRows = t.raw("customsRows") as CustomsRow[];

  // Falls back to the generic countryPage titles if a country hasn't
  // defined its own sectionTitles yet.
  let sectionTitles: SectionTitles;
  try {
    sectionTitles = t.raw("sectionTitles") as SectionTitles;
  } catch {
    sectionTitles = {
      investmentGold: tPage("investmentGoldTitle"),
      vat: tPage("vatTitle"),
      customs: tPage("customsTitle"),
      resale: tPage("reventeTitle"),
      faq: tPage("faqTitle"),
    };
  }

  let investmentGoldText: string | null = null;
  try {
    investmentGoldText = t("investmentGoldText");
  } catch {
    investmentGoldText = null;
  }

  // Resale as a table where available, falling back to the old bullet
  // list for countries not yet migrated to resaleRows.
  let resaleRows: ResaleRow[] | null = null;
  let reventePoints: string[] | null = null;
  try {
    resaleRows = t.raw("resaleRows") as ResaleRow[];
  } catch {
    try {
      reventePoints = t.raw("reventePoints") as string[];
    } catch {
      reventePoints = [];
    }
  }

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
      <section className="max-w-4xl mx-auto px-6 pt-6 pb-20">
        <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6 text-neutral-900 flex items-center">
          <Image
            src={`/images/emblems/${country}.png`}
            alt=""
            width={44}
            height={44}
            className="mr-4 object-contain"
          />
          {t("name")}
        </h1>
        <p className="text-neutral-600 leading-relaxed max-w-2xl">
          {t("intro")}
        </p>
      </section>

      {/* VAT and import */}
      <section className="w-full bg-[#f5f5f5] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl mb-6 text-neutral-900">{sectionTitles.vat}</h2>
          <p className="text-neutral-800 leading-relaxed max-w-2xl">{t("vatText")}</p>
        </div>
      </section>

      {/* Customs declaration */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl mb-6 text-neutral-900">{sectionTitles.customs}</h2>
        <p className="text-neutral-800 leading-relaxed max-w-2xl mb-10">{t("customsIntro")}</p>
        <CustomsTable
          headers={{
            range: tPage("customsHeaders.range"),
            requirement: tPage("customsHeaders.requirement"),
            form: tPage("customsHeaders.form"),
          }}
          rows={customsRows}
        />
      </section>

      {/* Resale */}
      <section className="w-full bg-[#f5f5f5] py-20">
        <div className="max-w-4xl mx-auto px-6">

          <h2 className="font-serif text-3xl mb-6 text-neutral-900">{sectionTitles.resale}</h2>
          <p className="text-neutral-800 leading-relaxed max-w-2xl mb-10">{t("resaleIntro")}</p>
          {resaleRows ? (
            <SimpleTable
              headers={{
                left: tPage("resaleHeaders.scenario"),
                right: tPage("resaleHeaders.treatment"),
              }}
              rows={resaleRows.map((r) => ({ left: r.scenario, right: r.treatment }))}
            />
          ) : (
            <ul className="space-y-4">
              {reventePoints?.map((point, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="text-red-600 mt-1">—</span>
                  <span className="text-neutral-800 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          )}

        </div>
      </section>

      {/* What is investment gold */}
      {investmentGoldText && (
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl mb-6 text-neutral-900">
            {sectionTitles.investmentGold}
          </h2>
          <p className="text-neutral-800 leading-relaxed max-w-2xl">{investmentGoldText}</p>
        </section>
      )}

      {/* FAQ */}
      <section className="w-full bg-[#f5f5f5] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-neutral-800 font-serif text-3xl mb-8">{sectionTitles.faq}</h2>
          <div className="divide-y divide-neutral-300">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left py-6"
                >
                  <span className="text-neutral-800 font-serif text-lg pr-6">{faq.q}</span>
                  <span className="text-red-600 text-xl shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-neutral-800 leading-relaxed pb-6 max-w-2xl">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}