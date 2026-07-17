import type { DealerOffer } from "./types";

/**
 * Placeholder data only. This will be replaced by the GoldAlp scraping
 * API once it exists (see `prime_history` in the Supabase schema plan).
 * Dealer names below are fictional — they are NOT real quoted prices from
 * real dealers, and should not be presented to users as such until backed
 * by the live feed.
 */
export const MOCK_OFFERS: DealerOffer[] = [
  // 1 oz Gold Bar
  { id: "o1", productId: "gold-bar-1oz", dealerName: "Helvetia Bullion", location: "Zurich, CH", priceChf: 3180, updatedAt: "2026-07-16" },
  { id: "o2", productId: "gold-bar-1oz", dealerName: "Rive Gauche Or", location: "Geneva, CH", priceChf: 3195, updatedAt: "2026-07-16" },
  { id: "o3", productId: "gold-bar-1oz", dealerName: "Lugano Fine Metals", location: "Lugano, CH", priceChf: 3172, updatedAt: "2026-07-15" },
  { id: "o4", productId: "gold-bar-1oz", dealerName: "Nordkantone Gold", location: "Munich, DE", priceChf: 3205, updatedAt: "2026-07-16" },
  { id: "o5", productId: "gold-bar-1oz", dealerName: "Alpine Precious", location: "Bern, CH", priceChf: 3188, updatedAt: "2026-07-14" },

  // 10 g Gold Bar
  { id: "o6", productId: "gold-bar-10g", dealerName: "Helvetia Bullion", location: "Zurich, CH", priceChf: 1042, updatedAt: "2026-07-16" },
  { id: "o7", productId: "gold-bar-10g", dealerName: "Ticino Bullion House", location: "Lugano, CH", priceChf: 1051, updatedAt: "2026-07-15" },
  { id: "o8", productId: "gold-bar-10g", dealerName: "Rive Gauche Or", location: "Geneva, CH", priceChf: 1038, updatedAt: "2026-07-16" },

  // 20 Fr. Vreneli
  { id: "o9", productId: "gold-coin-vreneli", dealerName: "Berner Münzhaus", location: "Bern, CH", priceChf: 218, updatedAt: "2026-07-16" },
  { id: "o10", productId: "gold-coin-vreneli", dealerName: "Helvetia Bullion", location: "Zurich, CH", priceChf: 224, updatedAt: "2026-07-16" },
  { id: "o11", productId: "gold-coin-vreneli", dealerName: "Lugano Fine Metals", location: "Lugano, CH", priceChf: 215, updatedAt: "2026-07-13" },

  // 1 oz Krugerrand
  { id: "o12", productId: "gold-coin-krugerrand", dealerName: "Alpine Precious", location: "Bern, CH", priceChf: 3210, updatedAt: "2026-07-16" },
  { id: "o13", productId: "gold-coin-krugerrand", dealerName: "Nordkantone Gold", location: "Munich, DE", priceChf: 3240, updatedAt: "2026-07-16" },
  { id: "o14", productId: "gold-coin-krugerrand", dealerName: "Rive Gauche Or", location: "Geneva, CH", priceChf: 3198, updatedAt: "2026-07-15" },
  { id: "o15", productId: "gold-coin-krugerrand", dealerName: "Milano Metalli", location: "Milan, IT", priceChf: 3255, updatedAt: "2026-07-14" },

  // 100 g Silver Bar
  { id: "o16", productId: "silver-bar-100g", dealerName: "Helvetia Bullion", location: "Zurich, CH", priceChf: 92, updatedAt: "2026-07-16" },
  { id: "o17", productId: "silver-bar-100g", dealerName: "Ticino Bullion House", location: "Lugano, CH", priceChf: 96, updatedAt: "2026-07-15" },
  { id: "o18", productId: "silver-bar-100g", dealerName: "Rive Gauche Or", location: "Geneva, CH", priceChf: 90, updatedAt: "2026-07-16" },

  // 1 oz Silver Maple Leaf
  { id: "o19", productId: "silver-coin-maple", dealerName: "Alpine Precious", location: "Bern, CH", priceChf: 34, updatedAt: "2026-07-16" },
  { id: "o20", productId: "silver-coin-maple", dealerName: "Berner Münzhaus", location: "Bern, CH", priceChf: 33, updatedAt: "2026-07-16" },
  { id: "o21", productId: "silver-coin-maple", dealerName: "Nordkantone Gold", location: "Munich, DE", priceChf: 35, updatedAt: "2026-07-14" },
  { id: "o22", productId: "silver-coin-maple", dealerName: "Milano Metalli", location: "Milan, IT", priceChf: 36, updatedAt: "2026-07-13" },
];

export function offersForProduct(productId: string): DealerOffer[] {
  return MOCK_OFFERS.filter((o) => o.productId === productId);
}