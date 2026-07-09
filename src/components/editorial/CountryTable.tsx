"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

type CountryRow = {
  key: string;
  flag: string;
  name: string;
  threshold: string;
  keyPoint: string;
};

export function CountryTable({
  headers,
  rows,
  moreLabel,
}: {
  headers: { country: string; threshold: string; keyPoint: string; more: string };
  rows: CountryRow[];
  moreLabel: string;
}) {
  const locale = useLocale();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-300 text-left">
            <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500">
              {headers.country}
            </th>
            <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500">
              {headers.threshold}
            </th>
            <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500">
              {headers.keyPoint}
            </th>
            <th className="py-4 font-serif font-normal text-sm uppercase tracking-wide text-neutral-500" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-neutral-200 align-top">
              <td className="py-6 pr-6 whitespace-nowrap">
                <span className="text-2xl mr-2">{row.flag}</span>
                <span className="font-serif italic text-xl">{row.name}</span>
              </td>
              <td className="py-6 pr-6 text-neutral-600 max-w-xs">{row.threshold}</td>
              <td className="py-6 pr-6 text-neutral-600 max-w-md">{row.keyPoint}</td>
              <td className="py-6 whitespace-nowrap">
                <Link
                  href={`/${locale}/pays/${row.key}`}
                  className="text-red-600 hover:opacity-70 transition-opacity text-sm"
                >
                  {moreLabel} →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
