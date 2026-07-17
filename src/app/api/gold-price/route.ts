// src/app/api/gold-price/route.ts
import { NextRequest, NextResponse } from "next/server";

const RANGE_CONFIG: Record<string, { range: string; interval: string }> = {
  "1D": { range: "1d", interval: "15m" },
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
  volumes: number[];
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
    volumes: result?.indicators?.quote?.[0]?.close ?? [],
    meta: result?.meta ?? {},
  };
}

function buildCurrent(meta: Record<string, unknown>, closes: number[]) {
  const regularMarketTime = meta.regularMarketTime as number | undefined;
  const currentTradingPeriod = meta.currentTradingPeriod as
    | { regular?: { start: number; end: number} }
    | undefined;

  const nowSec = Date.now() / 1000;
  const session = currentTradingPeriod?.regular;

  const isLive = session ? nowSec >= session.start && nowSec <= session.end : false;

  return {
    price: (meta.regularMarketPrice as number | undefined) ?? closes[closes.length - 1] ?? null,
    previousClose: (meta.chartPreviousClose as number | undefined) ?? (meta.previousClose as number | undefined) ?? null,
    marketState: isLive ? "REGULAR" : "CLOSED",
    isLive,
    lastTradeTime: regularMarketTime ? regularMarketTime * 1000 : null,
  }
}

export async function GET(req: NextRequest) {
  try {
    const rangeKey = req.nextUrl.searchParams.get("range") ?? "1M";
    const start = req.nextUrl.searchParams.get("start"); // YYYY-MM-DD
    const end = req.nextUrl.searchParams.get("end"); // YYYY-MM-DD

    let rangeParams: string;
    let interval: string;
    let isIntraday: boolean;
    let isSingleDay: boolean;

    if (rangeKey === "CUSTOM" && start && end) {
      const period1 = Math.floor(new Date(start).getTime() / 1000);
      const period2 = Math.floor(new Date(end).getTime() / 1000) + 86400; // include end day
      const spanDays = (period2 - period1) / 86400;
      // Mirror the RANGE_CONFIG buckets (1D/1W -> 15m, 1M/3M/6M -> 1d, 1Y/5Y -> 1wk).
      // Threshold is 8 not 7 because period2 always adds +1 day to include the end
      // date, so a 7-calendar-day custom span (matching the 1W preset) computes to 8.
      if (spanDays <= 8) {
        interval = "15m";
      } else if (spanDays <= 186) {
        interval = "1d";
      } else {
        interval = "1wk";
      }
      isIntraday = interval === "1h";
      isSingleDay = spanDays <= 1;
      rangeParams = `period1=${period1}&period2=${period2}`;
    } else {
      const config = RANGE_CONFIG[rangeKey] ?? RANGE_CONFIG["1M"];
      interval = config.interval;
      isIntraday = interval.endsWith("m") || interval.endsWith("h");
      isSingleDay = rangeKey === "1D";
      rangeParams = `range=${config.range}`;
    }

    const [goldResult, silverResult, platinumResult] = await Promise.allSettled([
      fetchYahoo("GC=F", interval, rangeParams),
      fetchYahoo("SI=F", interval, rangeParams),
      fetchYahoo("PL=F", interval, rangeParams),
    ]);

    const empty: YahooFetchResult = { 
      timestamps: [],
      closes: [],
      volumes: [],
      meta: {},
    }

    const gold = goldResult.status === "fulfilled" ? goldResult.value : empty;
    const silver = silverResult.status === "fulfilled" ? silverResult.value : empty;
    const platinum = platinumResult.status === "fulfilled" ? platinumResult.value : empty;

    if (goldResult.status === "rejected") console.error("Gold fetch failed", goldResult.reason);
    if (silverResult.status === "rejected") console.error("Silver fetch failed", silverResult.reason);
    if (platinumResult.status === "rejected") console.error("Platinum fetch failed", platinumResult.reason);

    const silverByTime = new Map<number, number>();
    silver.timestamps.forEach((t, i) => {
      const price = silver.closes[i];
      if (typeof price === "number") silverByTime.set(t, price);
    });

    const platinumByTime = new Map<number, number>();
    platinum.timestamps.forEach((t, i) => {
      const price = platinum.closes[i];
      if (typeof price === "number") platinumByTime.set(t, price);
    });

    const formatTime = (t: number) => {
      const d = new Date(t * 1000);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");

      if (isSingleDay) return `${hours}:${minutes}`;
      if (isIntraday) return `${day}.${month} ${hours}:${minutes}`;
      return `${day}.${month}.${year}`;
    };

    const series = gold.timestamps
      .map((t, i) => ({
        time: formatTime(t),
        goldPrice: gold.closes[i],
        silverPrice: silverByTime.get(t) ?? null,
        platinumPrice: platinumByTime.get(t) ?? null,
      }))
      .filter((p) => typeof p.goldPrice === "number");

    const current = {
      gold: buildCurrent(gold.meta, gold.closes),
      silver: buildCurrent(silver.meta, silver.closes),
      platinum: buildCurrent(platinum.meta, platinum.closes),
    };

    return NextResponse.json({ series, current, source: "yahoo", timestamp: Date.now() });
  } catch (e) {
    console.error("Price fetch failed", e);
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 502 });
  }
}