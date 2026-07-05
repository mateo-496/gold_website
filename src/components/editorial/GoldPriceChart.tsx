"use client";
import { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

type PricePoint = { time: string; price: number };

const INTERVALS = [
  { label: "1 min", ms: 60_000 },
  { label: "30 sec", ms: 30_000 },
  { label: "10 sec", ms: 10_000 },
];

export function GoldPriceChart() {
  const [data, setData] = useState<PricePoint[]>([]);
  const [intervalMs, setIntervalMs] = useState(60_000);

  const tick = useCallback(async () => {
    try {
      const res = await fetch("/api/gold-price");
      const json = await res.json();
      setData((prev) => [
        ...prev.slice(-49),
        { time: new Date().toLocaleTimeString(), price: json.price },
      ]);
    } catch (e) {
      console.error("Price fetch failed", e);
    }
  }, []);

  useEffect(() => {
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, tick]);

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-3xl">Live Gold Price (XAU/USD)</h2>
        <select
          value={intervalMs}
          onChange={(e) => setIntervalMs(Number(e.target.value))}
          className="border border-neutral-300 rounded px-3 py-1 text-sm"
        >
          {INTERVALS.map((opt) => (
            <option key={opt.ms} value={opt.ms}>Refresh: {opt.label}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#a8874f" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}