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

export async function GET(req: NextRequest) {
  try {
    const rangeKey = req.nextUrl.searchParams.get("range") ?? "1M";
    const start = req.nextUrl.searchParams.get("start"); // YYYY-MM-DD
    const end = req.nextUrl.searchParams.get("end"); // YYYY-MM-DD

    let url: string;
    let isIntraday = false;

    if (rangeKey === "CUSTOM" && start && end) {
      const period1 = Math.floor(new Date(start).getTime() / 1000);
      const period2 = Math.floor(new Date(end).getTime() / 1000) + 86400; // include end day
      const spanDays = (period2 - period1) / 86400;
      // Yahoo caps intraday history, so pick a sane interval for the span
      const interval = spanDays <= 7 ? "1h" : spanDays <= 60 ? "1d" : "1wk";
      isIntraday = interval === "1h";
      url = `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=${interval}&period1=${period1}&period2=${period2}`;
    } else {
      const { range, interval } = RANGE_CONFIG[rangeKey] ?? RANGE_CONFIG["1M"];
      isIntraday = interval.endsWith("m") || interval.endsWith("h");
      url = `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=${interval}&range=${range}`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Yahoo responded ${res.status}`);

    const json = await res.json();
    const result = json.chart?.result?.[0];
    const timestamps: number[] = result?.timestamp ?? [];
    const closes: number[] = result?.indicators?.quote?.[0]?.close ?? [];
    const meta = result?.meta ?? {};

    const series = timestamps
      .map((t, i) => ({
        time: isIntraday
          ? new Date(t * 1000).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
          : new Date(t * 1000).toLocaleDateString(),
        price: closes[i],
      }))
      .filter((p) => typeof p.price === "number");

    // Yahoo reports a marketState for the underlying exchange (e.g. "REGULAR", "CLOSED", "PRE", "POST").
    // Fall back to freshness of the last tick if marketState isn't present.
    const marketState: string | undefined = meta.marketState;
    const regularMarketTime: number | undefined = meta.regularMarketTime;
    const secondsSinceLastTick = regularMarketTime ? Date.now() / 1000 - regularMarketTime : null;
    const isLive =
      marketState !== undefined
        ? marketState === "REGULAR"
        : secondsSinceLastTick !== null && secondsSinceLastTick < 180;

    const current = {
      price: meta.regularMarketPrice ?? closes[closes.length - 1] ?? null,
      previousClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
      marketState: marketState ?? (isLive ? "REGULAR" : "CLOSED"),
      isLive,
      lastTradeTime: regularMarketTime ? regularMarketTime * 1000 : null,
    };

    return NextResponse.json({ series, current, source: "yahoo", timestamp: Date.now() });
  } catch (e) {
    console.error("Gold price fetch failed", e);
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 502 });
  }
}