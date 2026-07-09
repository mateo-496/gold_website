// src/app/api/gold-price/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=1mo",
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Yahoo responded ${res.status}`);

    const json = await res.json();
    const result = json.chart?.result?.[0];
    const timestamps: number[] = result?.timestamp ?? [];
    const closes: number[] = result?.indicators?.quote?.[0]?.close ?? [];

    const series = timestamps
      .map((t, i) => ({
        time: new Date(t * 1000).toLocaleDateString(),
        price: closes[i],
      }))
      .filter((p) => typeof p.price === "number");

    return NextResponse.json({ series, source: "yahoo", timestamp: Date.now() });
  } catch (e) {
    console.error("Gold price fetch failed", e);
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 502 });
  }
}