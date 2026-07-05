import { NextResponse } from "next/server";

async function fetchYahoo(symbol: string) {
  const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
  const data = await res.json();
  return data.chart.result[0].meta.regularMarketPrice;
}

async function fetchGoldApi() {
  const res = await fetch("https://api.gold-api.com/price/XAU");
  const data = await res.json();
  return data.price;
}

export async function GET() {
  const [yahoo, goldApi] = await Promise.allSettled([
    fetchYahoo("GC=F"),
    fetchGoldApi(),
  ]);

  const prices = [yahoo, goldApi]
    .filter((r) => r.status === "fulfilled")
    .map((r: any) => r.value);

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

  return NextResponse.json({ price: avg, sources: prices.length });
}