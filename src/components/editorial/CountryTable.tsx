"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

type FormLink = { label: string; url: string };

type CountryRow = {
  key: string;
  emblem: string;
  name: string;
  threshold: string;
  forms?: FormLink[];
  keyPoint?: string;
};

export function CountryTable({
  headers,
  rows,
  moreLabel,
}: {
  headers: { country: string; threshold: string; forms?: string; keyPoint?: string; more: string };
  rows: CountryRow[];
  moreLabel: string;
}) {
  const locale = useLocale();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-300 text-left">
            <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-600">
              {headers.country}
            </th>
            <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-600">
              {headers.threshold}
            </th>
            <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-600">
              {headers.forms ?? headers.keyPoint}
            </th>
            <th className="py-4 font-serif font-normal text-sm uppercase tracking-wide text-neutral-600" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-neutral-200 align-top">
              <td className="py-6 pr-6 whitespace-nowrap">
                <Image
                  src={row.emblem}
                  alt=""
                  width={28}
                  height={28}
                  className="inline-block mr-3 align-middle object-contain"
                />
                <span className="font-serif italic text-xl text-neutral-800">{row.name}</span>
              </td>
              <td className="py-6 pr-6 text-neutral-800 max-w-xs">{row.threshold}</td>
              <td className="py-6 pr-6 max-w-md">
                {row.forms ? (
                  <div className="flex flex-col gap-2">
                    {row.forms.map((form, i) => (
                      <Link
                        key={i}
                        href={form.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:opacity-70 transition-opacity text-sm"
                      >
                        {form.label} ↗
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="text-neutral-800">{row.keyPoint}</span>
                )}
              </td>
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