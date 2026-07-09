"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

type PricePoint = { time: string; price: number };

export function GoldPriceChart() {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gold-price")
      .then((res) => res.json())
      .then((json) => setData(json.series ?? []))
      .catch((e) => console.error("Price fetch failed", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <h2 className="font-serif text-3xl mb-6">Gold Price (XAU/USD) — Last Month</h2>
      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#a8874f" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}