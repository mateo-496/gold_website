"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

type PricePoint = { time: string; price: number };
type CurrentPrice = {
  price: number | null;
  previousClose: number | null;
  marketState: string;
  isLive: boolean;
  lastTradeTime: number | null;
};

const RANGES = ["1W", "1M", "3M", "6M", "1Y", "5Y", "CUSTOM"] as const;
type Range = (typeof RANGES)[number];

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthAgoISO = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};

export function GoldPriceChart() {
  const [range, setRange] = useState<Range>("1M");
  const [customStart, setCustomStart] = useState(monthAgoISO());
  const [customEnd, setCustomEnd] = useState(todayISO());
  const [data, setData] = useState<PricePoint[]>([]);
  const [current, setCurrent] = useState<CurrentPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (range === "CUSTOM" && (!customStart || !customEnd || customStart > customEnd)) return;

    setLoading(true);
    setError(null);
    const url =
      range === "CUSTOM"
        ? `/api/gold-price?range=CUSTOM&start=${customStart}&end=${customEnd}`
        : `/api/gold-price?range=${range}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json.series ?? []);
        setCurrent(json.current ?? null);
      })
      .catch((e) => {
        console.error("Price fetch failed", e);
        setError("Couldn't load this range.");
      })
      .finally(() => setLoading(false));
  }, [range, customStart, customEnd]);

  const first = data[0]?.price;
  const last = data[data.length - 1]?.price;
  const change = first && last ? ((last - first) / first) * 100 : null;

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="font-serif text-3xl">Gold Price (XAU/USD)</h2>

          {current?.price != null && (
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-2xl text-[--color-gold]">
                ${current.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>

              {current.isLive ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  Live
                </span>
              ) : (
                <span className="text-xs text-neutral-500">
                  Markets closed
                  {current.lastTradeTime &&
                    ` — last traded ${new Date(current.lastTradeTime).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </span>
              )}
            </div>
          )}

          {change !== null && (
            <p className={`text-sm mt-1 ${change >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}% over the period
            </p>
          )}
        </div>

        <div className="flex gap-1 border border-neutral-200 rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-sm tracking-wide rounded-md transition-colors ${
                range === r
                  ? "bg-[--color-gold] text-white"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {r === "CUSTOM" ? "Custom" : r}
            </button>
          ))}
        </div>
      </div>

      {range === "CUSTOM" && (
        <div className="flex flex-wrap items-center gap-3 mb-6 mt-4 text-sm">
          <label className="flex items-center gap-2 text-neutral-500">
            From
            <input
              type="date"
              value={customStart}
              max={customEnd}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border border-neutral-200 rounded-md px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-2 text-neutral-500">
            To
            <input
              type="date"
              value={customEnd}
              min={customStart}
              max={todayISO()}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border border-neutral-200 rounded-md px-2 py-1"
            />
          </label>
        </div>
      )}

      <div className="mt-6">
        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : loading ? (
          <p className="text-sm text-neutral-500">Loading…</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <XAxis dataKey="time" minTickGap={40} />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#a8874f" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}