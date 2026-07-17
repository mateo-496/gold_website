"use client";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

type PricePoint = {
  time: string;
  goldPrice: number | null;
  silverPrice: number | null;
  platinumPrice: number | null;
};
type CurrentPrice = {
  price: number | null;
  previousClose: number | null;
  marketState: string;
  isLive: boolean;
  lastTradeTime: number | null;
};
type CurrentBoth = { gold: CurrentPrice; silver: CurrentPrice; platinum: CurrentPrice };

const RANGES = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y", "CUSTOM"] as const;
type Range = (typeof RANGES)[number];

const METAL_KEYS = ["gold", "silver", "platinum"] as const;
type MetalKey = (typeof METAL_KEYS)[number];

const METAL_META: Record<MetalKey, { symbol: string; color: string }> = {
  gold: { symbol: "XAU", color: "#c9a24b" },
  silver: { symbol: "XAG", color: "#9ea4ad" },
  platinum: { symbol: "XPT", color: "#7fa8c9" },
};

const METAL_FIELD: Record<MetalKey, keyof Omit<PricePoint, "time">> = {
  gold: "goldPrice",
  silver: "silverPrice",
  platinum: "platinumPrice",
};

const CHART_MIN_HEIGHT = 420;

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthAgoISO = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};
const startForRange = (r: Exclude<Range, "CUSTOM">): string => {
  if (r === "1D") return todayISO();
  const d = new Date();
  switch (r) {
    case "1W":
      d.setDate(d.getDate() - 7);
      break;
    case "1M":
      d.setMonth(d.getMonth() - 1);
      break;
    case "3M":
      d.setMonth(d.getMonth() - 3);
      break;
    case "6M":
      d.setMonth(d.getMonth() - 6);
      break;
    case "1Y":
      d.setFullYear(d.getFullYear() - 1);
      break;
    case "5Y":
      d.setFullYear(d.getFullYear() - 5);
      break;
  }
  return d.toISOString().slice(0, 10);
};

function computeChange(data: PricePoint[], field: keyof Omit<PricePoint, "time">): number | null {
  const values = data.map((p) => p[field]).filter((v): v is number => typeof v === "number");
  if (values.length < 2 || !values[0]) return null;
  return ((values[values.length - 1] - values[0]) / values[0]) * 100;
}

function MetalCard({
  metalKey,
  label,
  closedLabel,
  current,
  change,
  active,
  onToggle,
  locked,
  lockedTooltip,
}: {
  metalKey: MetalKey;
  label: string;
  closedLabel: string;
  current: CurrentPrice | null;
  change: number | null;
  active: boolean;
  onToggle: () => void;
  locked: boolean;
  lockedTooltip: string;
}) {
  const meta = METAL_META[metalKey];
  if (current?.price == null) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      title={locked ? lockedTooltip : undefined}
      className={`flex flex-col gap-1.5 text-left px-4 py-2.5 rounded-xl border transition-colors ${
        active ? "" : "border-neutral-800 hover:border-neutral-600"
      } ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={active ? { borderColor: meta.color } : undefined}
    >
      <div className="flex items-center gap-2">
        <span className="text-[14px] uppercase tracking-[0.15em] text-neutral-500">{label}</span>
        <span className="text-[13px] tracking-wide text-neutral-600">{meta.symbol}</span>
        {current.isLive && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-numeric text-3xl leading-none" style={{ color: meta.color }}>
          ${current.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </span>
        {change !== null && (
          <span className={`font-numeric text-base ${change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        )}
      </div>

      {!current.isLive && (
        <span className="text-[11px] text-neutral-600">
          {closedLabel}
          {current.lastTradeTime &&
            ` — ${new Date(current.lastTradeTime).toLocaleString([], {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}`}
        </span>
      )}
    </button>
  );
}

export function GoldPriceChart() {
  const t = useTranslations("goldPriceChart");
  const [range, setRange] = useState<Range>("1M");
  const [visible, setVisible] = useState<Record<MetalKey, boolean>>({
    gold: true,
    silver: false,
    platinum: false,
  });
  const toggleMetal = (key: MetalKey) =>
    setVisible((v) => {
      const activeCount = METAL_KEYS.filter((k) => v[k]).length;
      if (v[key] && activeCount <= 1) return v; // always keep at least one commodity selected
      return { ...v, [key]: !v[key] };
    });
  const [customStart, setCustomStart] = useState(monthAgoISO());
  const [customEnd, setCustomEnd] = useState(todayISO());
  const handleRangeClick = (r: Range) => {
    if (r === "CUSTOM" && range !== "CUSTOM") {
      setCustomStart(startForRange(range));
      setCustomEnd(todayISO());
    }
    setRange(r);
  };
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
        setError(t("error"));
      })
      .finally(() => setLoading(false));
  }, [range, customStart, customEnd]);

  const activeKeys = METAL_KEYS.filter((k) => visible[k]);
  const isMultiMetal = activeKeys.length > 1;

  // With one metal selected, chart the raw price. With more than one, normalize
  // every series to % change from its first available value so metals at very
  // different price levels (e.g. gold ~$4000 vs silver ~$55) share one legible axis.
  const chartData = useMemo(() => {
    if (!isMultiMetal) return data;

    const bases: Partial<Record<MetalKey, number>> = {};
    for (const k of activeKeys) {
      const field = METAL_FIELD[k];
      const firstVal = data.find((p) => typeof p[field] === "number")?.[field] as number | undefined;
      if (firstVal) bases[k] = firstVal;
    }

    return data.map((p) => {
      const point: PricePoint = { time: p.time, goldPrice: null, silverPrice: null, platinumPrice: null };
      for (const k of activeKeys) {
        const field = METAL_FIELD[k];
        const raw = p[field];
        const base = bases[k];
        point[field] = typeof raw === "number" && base ? ((raw - base) / base) * 100 : null;
      }
      return point;
    });
  }, [data, activeKeys, isMultiMetal]);

  return (
    <section data-logo-bg="dark" className="min-h-[100dvh] flex flex-col px-6 pt-24 pb-16 md:pt-32 lg:px-12 snap-start">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-2 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-serif text-5xl">{t("title")}</h2>
            <div className="relative group">
              <button
                type="button"
                aria-label={t("disclaimer")}
                className="flex items-center justify-center w-4 h-4 rounded-full border border-neutral-500 text-neutral-500 text-[10px] leading-none hover:border-neutral-300 hover:text-neutral-300 transition-colors cursor-help"
              >
                i
              </button>
              <div className="pointer-events-none absolute left-0 top-full mt-2 w-72 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs leading-relaxed text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-lg">
                {t("disclaimer")}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {METAL_KEYS.map((k) => {
              const isOnlyOne = visible[k] && activeKeys.length === 1;
              return (
                <MetalCard
                  key={k}
                  metalKey={k}
                  label={t(k)}
                  closedLabel={t("closed")}
                  current={current?.[k] ?? null}
                  change={computeChange(data, METAL_FIELD[k])}
                  active={visible[k]}
                  onToggle={() => toggleMetal(k)}
                  locked={isOnlyOne}
                  lockedTooltip={t("lockedTooltip")}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 relative flex-1" style={{ minHeight: CHART_MIN_HEIGHT }}>
        <div className="absolute top-0 right-0 z-10 flex flex-wrap items-center justify-end gap-1.5 max-w-full">
          {range === "CUSTOM" && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 mr-1">
              <input
                type="date"
                value={customStart}
                max={customEnd}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-transparent border border-neutral-700 rounded-full px-2.5 py-1 text-neutral-300 [color-scheme:dark] focus:outline-none focus:border-neutral-500"
              />
              <span className="text-neutral-700">—</span>
              <input
                type="date"
                value={customEnd}
                min={customStart}
                max={todayISO()}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-transparent border border-neutral-700 rounded-full px-2.5 py-1 text-neutral-300 [color-scheme:dark] focus:outline-none focus:border-neutral-500"
              />
            </div>
          )}
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => handleRangeClick(r)}
              className={`px-3 py-1.5 text-xs sm:text-sm tracking-wide rounded-full transition-colors ${
                range === r
                  ? "bg-[--color-gold] text-white"
                  : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              {r === "CUSTOM" ? t("custom") : r}
            </button>
          ))}
        </div>

        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : (
          <>
            <div className={`absolute inset-0 pt-10 flex justify-center transition-opacity duration-150 ${loading ? "opacity-40" : "opacity-100"}`}>
              <ResponsiveContainer width="92%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 24, bottom: 12, left: 8 }}>
                  <XAxis
                    dataKey="time"
                    minTickGap={40}
                    stroke="#4a4a4a"
                    tick={{ fill: "#8a8a8a", fontSize: 16, fontFamily: "var(--font-numeric)"}}
                    tickMargin={12}
                    padding={{ left: 10, right: 30 }}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    stroke="#4a4a4a"
                    tick={{ fill: "#8a8a8a", fontSize: 20, fontFamily: "var(--font-numeric)" }}
                    tickMargin={10}
                    width={88}
                    tickFormatter={(v: number) =>
                      isMultiMetal ? `${v > 0 ? "+" : ""}${v.toFixed(1)}%` : `$${v.toLocaleString()}`
                    }
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      isMultiMetal
                        ? `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
                        : `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                      name,
                    ]}
                    contentStyle={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 6 }}
                    labelStyle={{ color: "#8a8a8a" }}
                  />
                  <Legend />
                  {visible.gold && (
                    <Line
                      type="monotone"
                      dataKey="goldPrice"
                      name={t("gold")}
                      stroke={METAL_META.gold.color}
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                      connectNulls
                    />
                  )}
                  {visible.silver && (
                    <Line
                      type="monotone"
                      dataKey="silverPrice"
                      name={t("silver")}
                      stroke={METAL_META.silver.color}
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                      connectNulls
                    />
                  )}
                  {visible.platinum && (
                    <Line
                      type="monotone"
                      dataKey="platinumPrice"
                      name={t("platinum")}
                      stroke={METAL_META.platinum.color}
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                      connectNulls
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-sm text-neutral-500">{t("loading")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}