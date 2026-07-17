export type Metal = "gold" | "silver";
export type ProductForm = "bar" | "coin";

export type Product = {
  id: string;
  metal: Metal;
  form: ProductForm;
  name: string; // e.g. "1 oz Gold Bar"
  weightGrams: number;
  purity: number; // fineness, 0–1 (e.g. 0.9999)
};

export type DealerOffer = {
  id: string;
  productId: string;
  dealerName: string;
  location: string; // "Zurich, CH"
  priceChf: number;
  url?: string;
  updatedAt: string; // ISO date — when the offer was last observed
};