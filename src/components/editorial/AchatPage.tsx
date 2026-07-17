"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CATEGORIES, type CategoryKey, productsForCategory } from "@/lib/dealers/products";
import { offersForProduct } from "@/lib/dealers/mockOffers";
import { formatChf, formatPercent, intrinsicValueChf, premium } from "@/lib/dealers/pricing";
import type { Metal } from "@/lib/dealers/types";
import { PageHero } from "@/components/editorial/PageHero";

type SpotState = { gold: number | null; silver: number | null };
type SortKey = "price" | "premium";

export function AchatPage() {
  const t = useTranslations("achat");

  const [category, setCategory] = useState<CategoryKey>("gold-bar");
  const products = useMemo(() => productsForCategory(category), [category]);
  const [productId, setProductId] = useState(products[0]?.id);
  const [spot, setSpot] = useState<SpotState>({ gold: null, silver: null });
  const [sortKey, setSortKey] = useState<SortKey>("price");

  // Reset the selected product whenever the category changes.
  useEffect(() => {
    setProductId(productsForCategory(category)[0]?.id);
  }, [category]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/gold-price?range=1D")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setSpot({
          gold: data?.current?.gold?.price ?? null,
          silver: data?.current?.silver?.price ?? null,
        });
      })
      .catch(() => {
        if (!cancelled) setSpot({ gold: null, silver: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const product = products.find((p) => p.id === productId) ?? products[0];
  const spotUsdPerOz = product?.metal === "silver" ? spot.silver : spot.gold;

  const offers = useMemo(() => {
    if (!product) return [];
    const rows = offersForProduct(product.id).map((offer) => {
      const intrinsic = spotUsdPerOz ? intrinsicValueChf(product, spotUsdPerOz) : null;
      return {
        ...offer,
        intrinsic,
        premium: intrinsic ? premium(offer.priceChf, intrinsic) : null,
      };
    });
    return rows.sort((a, b) => {
      if (sortKey === "premium") {
        return (a.premium ?? 0) - (b.premium ?? 0);
      }
      return a.priceChf - b.priceChf;
    });
  }, [product, spotUsdPerOz, sortKey]);

  const spotPerGram = (metal: Metal) => {
    const usdPerOz = metal === "silver" ? spot.silver : spot.gold;
    if (!usdPerOz) return null;
    return (usdPerOz / 31.1034768) * 0.9; // TODO: live USD/CHF, see lib/dealers/pricing.ts
  };

  return (
    <main className="bg-white">
      <PageHero breadcrumbLabel={t("breadcrumb")} />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-6 pb-16">
        <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6 text-neutral-900">{t("heading")}</h1>
        <p className="text-neutral-600 leading-relaxed max-w-2xl text-lg">{t("intro")}</p>
      </section>

      {/* Category tabs */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-neutral-300 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`font-serif text-lg pb-1 transition-colors ${
                category === cat.key
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {t(`categories.${cat.key}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Product pills */}
      <section className="max-w-5xl mx-auto px-6 pt-8">
        <div className="flex flex-wrap gap-3">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setProductId(p.id)}
              className={`px-4 py-2 text-sm tracking-wide transition-colors border ${
                product?.id === p.id
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* Spot banner */}
      {product && (
        <section className="max-w-5xl mx-auto px-6 pt-10">
          <div className="bg-[#f5f5f5] px-8 py-6 flex flex-wrap items-baseline justify-between gap-4">
            <p className="text-sm uppercase tracking-wide text-neutral-500">
              {t("spotLabel")} — {product.name}
            </p>
            <p className="font-serif italic text-2xl text-red-600">
              {spotPerGram(product.metal) !== null
                ? `${formatChf(spotPerGram(product.metal) as number)} / g`
                : "—"}
            </p>
          </div>
        </section>
      )}

      {/* Offers table */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        {offers.length === 0 ? (
          <p className="text-neutral-500 py-12 text-center border border-dashed border-neutral-300">
            {t("emptyState")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 text-left">
                  <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500">
                    {t("table.dealer")}
                  </th>
                  <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500">
                    {t("table.location")}
                  </th>
                  <th
                    className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500 cursor-pointer select-none"
                    onClick={() => setSortKey("price")}
                  >
                    {t("table.price")} {sortKey === "price" && "↓"}
                  </th>
                  <th
                    className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500 cursor-pointer select-none"
                    onClick={() => setSortKey("premium")}
                  >
                    {t("table.premium")} {sortKey === "premium" && "↓"}
                  </th>
                  <th className="py-4 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500">
                    {t("table.updated")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="border-b border-neutral-200 align-top">
                    <td className="py-6 pr-6 whitespace-nowrap">
                      {offer.url ? (
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-serif italic text-xl hover:text-red-600 transition-colors"
                        >
                          {offer.dealerName}
                        </a>
                      ) : (
                        <span className="font-serif italic text-xl">{offer.dealerName}</span>
                      )}
                    </td>
                    <td className="py-6 pr-6 text-neutral-600">{offer.location}</td>
                    <td className="py-6 pr-6 font-serif text-lg text-neutral-900">
                      {formatChf(offer.priceChf)}
                    </td>
                    <td className="py-6 pr-6">
                      {offer.premium !== null ? (
                        <span className={offer.premium <= 0 ? "text-emerald-700" : "text-red-600"}>
                          {formatPercent(offer.premium)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-6 text-neutral-500 text-sm whitespace-nowrap">{offer.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-neutral-400 mt-4">{t("sampleDataNotice")}</p>
      </section>

      {/* Disclaimer */}
      <section className="w-full bg-[#f5f5f5] px-6 py-12">
        <p className="max-w-5xl mx-auto text-sm text-neutral-500 leading-relaxed">{t("disclaimer")}</p>
      </section>
    </main>
  );
}