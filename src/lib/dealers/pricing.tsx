import type { Product } from "./types";

const GRAMS_PER_TROY_OZ = 31.1034768;

// TODO: replace with a live FX rate (e.g. from the same data layer as
// /api/gold-price) once a USD/CHF feed is wired up. Spot prices from
// Yahoo (GC=F, SI=F) are quoted in USD/oz.
const FALLBACK_USD_CHF = 0.9;

/** Melt value of a product, in CHF, given a USD/oz spot price. */
export function intrinsicValueChf(product: Product, spotUsdPerOz: number, usdChf: number = FALLBACK_USD_CHF): number {
  const pricePerGramUsd = spotUsdPerOz / GRAMS_PER_TROY_OZ;
  const fineGrams = product.weightGrams * product.purity;
  return pricePerGramUsd * fineGrams * usdChf;
}

/** Premium of an offer over melt value, as a fraction (0.05 = +5%). */
export function premium(priceChf: number, intrinsicChf: number): number {
  if (!intrinsicChf) return 0;
  return (priceChf - intrinsicChf) / intrinsicChf;
}

export function formatChf(value: number): string {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(1)}%`;
}