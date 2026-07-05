"use client";
import { useEffect, useState } from "react";

export function PriceTicker() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    // placeholder — wire to your real XAU/CHF feed later
    setPrice(78450); // CHF per kg, dummy value
  }, []);

  return (
    <div className="mt-10 inline-flex items-center gap-3 border border-neutral-200 rounded-lg px-5 py-3">
      <span className="text-sm text-neutral-500">XAU/CHF</span>
      <span className="text-xl font-mono text-[--color-gold]">
        {price ? price.toLocaleString("fr-CH") : "—"}
      </span>
    </div>
  );
}