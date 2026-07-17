"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { COUNTRIES } from "@/i18n/routing";

export function PageNav() {
  const [paysOpen, setPaysOpen] = useState(false);
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tCategories = useTranslations("categories");
  const tCountries = useTranslations("countries");

  const links = [
    { key: "home", label: "Home", href: `/${locale}` },
    { key: "achat", label: tCategories("achat.title"), href: `/${locale}/achat` },
    { key: "export", label: tCategories("export.title"), href: `/${locale}/export` },
    { key: "revente", label: tCategories("revente.title"), href: `/${locale}/revente` },
  ];

  return (
    <nav className="flex items-center gap-8 font-serif text-lg md:text-xl tracking-wide text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
      {links.map((link) => (
        <Link key={link.key} href={link.href} className="hover:text-white transition-colors">
          {link.label}
        </Link>
      ))}

      <div
        className="relative"
        onMouseEnter={() => setPaysOpen(true)}
        onMouseLeave={() => setPaysOpen(false)}
      >
        <button
          onClick={() => setPaysOpen((v) => !v)}
          aria-expanded={paysOpen}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          {tNav("pays")}
          <svg
            width="12"
            height="12"
            viewBox="0 0 10 10"
            fill="none"
            className={`transition-transform duration-200 ${paysOpen ? "rotate-180" : ""}`}
          >
            <path d="M1.5 3.5L5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          className={`absolute left-0 top-full pt-3 transition-opacity duration-200 ${
            paysOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="min-w-[200px] py-2">
            {COUNTRIES.map((country) => (
              <Link
                key={country}
                href={`/${locale}/pays/${country}`}
                className="block px-4 py-2 text-white/90 hover:text-white transition-colors"
              >
                {tCountries(`${country}.name`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}