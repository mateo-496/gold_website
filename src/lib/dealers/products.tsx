import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  // Gold bars
  { id: "gold-bar-1g", metal: "gold", form: "bar", name: "1 g Gold Bar", weightGrams: 1, purity: 0.9999 },
  { id: "gold-bar-10g", metal: "gold", form: "bar", name: "10 g Gold Bar", weightGrams: 10, purity: 0.9999 },
  { id: "gold-bar-1oz", metal: "gold", form: "bar", name: "1 oz Gold Bar", weightGrams: 31.1035, purity: 0.9999 },
  { id: "gold-bar-100g", metal: "gold", form: "bar", name: "100 g Gold Bar", weightGrams: 100, purity: 0.9999 },
  { id: "gold-bar-1kg", metal: "gold", form: "bar", name: "1 kg Gold Bar", weightGrams: 1000, purity: 0.9999 },

  // Gold coins
  { id: "gold-coin-vreneli", metal: "gold", form: "coin", name: "20 Fr. Vreneli", weightGrams: 6.4516, purity: 0.9 },
  { id: "gold-coin-krugerrand", metal: "gold", form: "coin", name: "1 oz Krugerrand", weightGrams: 33.93, purity: 0.9167 },
  { id: "gold-coin-maple", metal: "gold", form: "coin", name: "1 oz Gold Maple Leaf", weightGrams: 31.1035, purity: 0.9999 },
  { id: "gold-coin-napoleon", metal: "gold", form: "coin", name: "20 Fr. Napoléon", weightGrams: 6.4516, purity: 0.9 },

  // Silver bars
  { id: "silver-bar-100g", metal: "silver", form: "bar", name: "100 g Silver Bar", weightGrams: 100, purity: 0.999 },
  { id: "silver-bar-1kg", metal: "silver", form: "bar", name: "1 kg Silver Bar", weightGrams: 1000, purity: 0.999 },

  // Silver coins
  { id: "silver-coin-maple", metal: "silver", form: "coin", name: "1 oz Silver Maple Leaf", weightGrams: 31.1035, purity: 0.9999 },
  { id: "silver-coin-britannia", metal: "silver", form: "coin", name: "1 oz Silver Britannia", weightGrams: 31.1035, purity: 0.999 },
];

export const CATEGORIES = [
  { key: "gold-bar", metal: "gold", form: "bar" },
  { key: "gold-coin", metal: "gold", form: "coin" },
  { key: "silver-bar", metal: "silver", form: "bar" },
  { key: "silver-coin", metal: "silver", form: "coin" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function productsForCategory(key: CategoryKey): Product[] {
  const cat = CATEGORIES.find((c) => c.key === key);
  if (!cat) return [];
  return PRODUCTS.filter((p) => p.metal === cat.metal && p.form === cat.form);
}