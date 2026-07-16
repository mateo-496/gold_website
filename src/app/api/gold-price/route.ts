// src/app/api/gold-price/route.ts
import { NextRequest, NextResponse } from "next/server";

const RANGE_CONFIG: Record<string, { range: string; interval: string }> = {
  "1W": { range: "5d", interval: "15m" },
  "1M": { range: "1mo", interval: "1d" },
  "3M": { range: "3mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1wk" },
  "5Y": { range: "5y", interval: "1wk" },
};

type YahooFetchResult = {
  timestamps: number[];
  closes: number[];
  meta: Record<string, unknown>;
};

async function fetchYahoo(symbol: string, interval: string, rangeParams: string): Promise<YahooFetchResult> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&${rangeParams}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Yahoo responded ${res.status} for ${symbol}`);

  const json = await res.json();
  const result = json.chart?.result?.[0];
  return {
    timestamps: result?.timestamp ?? [],
    closes: result?.indicators?.quote?.[0]?.close ?? [],
    meta: result?.meta ?? {},
  };
}

function buildCurrent(meta: Record<string, unknown>, closes: number[]) {
  const marketState = meta.marketState as string | undefined;
  const regularMarketTime = meta.regularMarketTime as number | undefined;
  const secondsSinceLastTick = regularMarketTime ? Date.now() / 1000 - regularMarketTime : null;
  const isLive =
    marketState !== undefined
      ? marketState === "REGULAR"
      : secondsSinceLastTick !== null && secondsSinceLastTick < 180;

  return {
    price: (meta.regularMarketPrice as number | undefined) ?? closes[closes.length - 1] ?? null,
    previousClose: (meta.chartPreviousClose as number | undefined) ?? (meta.previousClose as number | undefined) ?? null,
    marketState: marketState ?? (isLive ? "REGULAR" : "CLOSED"),
    isLive,
    lastTradeTime: regularMarketTime ? regularMarketTime * 1000 : null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const rangeKey = req.nextUrl.searchParams.get("range") ?? "1M";
    const start = req.nextUrl.searchParams.get("start"); // YYYY-MM-DD
    const end = req.nextUrl.searchParams.get("end"); // YYYY-MM-DD

    let rangeParams: string;
    let interval: string;
    let isIntraday: boolean;

    if (rangeKey === "CUSTOM" && start && end) {
      const period1 = Math.floor(new Date(start).getTime() / 1000);
      const period2 = Math.floor(new Date(end).getTime() / 1000) + 86400; // include end day
      const spanDays = (period2 - period1) / 86400;
      // Yahoo caps intraday history, so pick a sane interval for the span
      interval = spanDays <= 7 ? "1h" : spanDays <= 60 ? "1d" : "1wk";
      isIntraday = interval === "1h";
      rangeParams = `period1=${period1}&period2=${period2}`;
    } else {
      const config = RANGE_CONFIG[rangeKey] ?? RANGE_CONFIG["1M"];
      interval = config.interval;
      isIntraday = interval.endsWith("m") || interval.endsWith("h");
      rangeParams = `range=${config.range}`;
    }

    const [gold, silver] = await Promise.all([
      fetchYahoo("GC=F", interval, rangeParams),
      fetchYahoo("SI=F", interval, rangeParams),
    ]);

    const silverByTime = new Map<number, number>();
    silver.timestamps.forEach((t, i) => {
      const price = silver.closes[i];
      if (typeof price === "number") silverByTime.set(t, price);
    });

    const formatTime = (t: number) =>
      isIntraday
        ? new Date(t * 1000).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        : new Date(t * 1000).toLocaleDateString();

    const series = gold.timestamps
      .map((t, i) => ({
        time: formatTime(t),
        price: gold.closes[i],
        silverPrice: silverByTime.get(t) ?? null,
      }))
      .filter((p) => typeof p.price === "number");

    const current = {
      gold: buildCurrent(gold.meta, gold.closes),
      silver: buildCurrent(silver.meta, silver.closes),
    };

    return NextResponse.json({ series, current, source: "yahoo", timestamp: Date.now() });
  } catch (e) {
    console.error("Price fetch failed", e);
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 502 });
  }
}