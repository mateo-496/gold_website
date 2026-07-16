"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

type PricePoint = { time: string; price: number; silverPrice: number | null };
type CurrentPrice = {
  price: number | null;
  previousClose: number | null;
  marketState: string;
  isLive: boolean;
  lastTradeTime: number | null;
};
type CurrentBoth = { gold: CurrentPrice; silver: CurrentPrice };

const RANGES = ["1W", "1M", "3M", "6M", "1Y", "5Y", "CUSTOM"] as const;
type Range = (typeof RANGES)[number];

const CHART_MIN_HEIGHT = 420;

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthAgoISO = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};

function LivePrice({ label, color, current }: { label: string; color: string; current: CurrentPrice | null }) {
  if (current?.price == null) return null;
  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="text-xs uppercase tracking-wide text-neutral-400 w-10">{label}</span>
      <span className="font-mono text-xl" style={{ color }}>
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
  );
}

export function GoldPriceChart() {
  const [range, setRange] = useState<Range>("1M");
  const [customStart, setCustomStart] = useState(monthAgoISO());
  const [customEnd, setCustomEnd] = useState(todayISO());
  const [data, setData] = useState<PricePoint[]>([]);
  const [current, setCurrent] = useState<CurrentBoth | null>(null);
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
    <section className="min-h-[100dvh] flex flex-col px-6 py-16 lg:px-12 snap-start">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2 shrink-0">
        <div>
          <h2 className="font-serif text-3xl">Gold &amp; Silver Price (XAU / XAG)</h2>

          <LivePrice label="Gold" color="var(--color-gold)" current={current?.gold ?? null} />
          <LivePrice label="Silver" color="#8a8f98" current={current?.silver ?? null} />

          {change !== null && (
            <p className={`text-sm mt-1 ${change >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}% over the period (gold)
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
        <div className="flex flex-wrap items-center gap-3 mb-6 mt-4 text-sm shrink-0">
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

      <div className="mt-6 relative flex-1" style={{ minHeight: CHART_MIN_HEIGHT }}>
        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : (
          <>
            <div
              className={`absolute inset-0 transition-opacity duration-150 ${loading ? "opacity-40" : "opacity-100"}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="time" minTickGap={40} />
                  <YAxis
                    yAxisId="gold"
                    domain={["auto", "auto"]}
                    stroke="#a8874f"
                    tick={{ fill: "#a8874f", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="silver"
                    orientation="right"
                    domain={["auto", "auto"]}
                    stroke="#8a8f98"
                    tick={{ fill: "#8a8f98", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="gold"
                    type="monotone"
                    dataKey="price"
                    name="Gold"
                    stroke="#a8874f"
                    dot={false}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                  <Line
                    yAxisId="silver"
                    type="monotone"
                    dataKey="silverPrice"
                    name="Silver"
                    stroke="#8a8f98"
                    dot={false}
                    strokeWidth={2}
                    isAnimationActive={false}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-sm text-neutral-500">Loading…</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}