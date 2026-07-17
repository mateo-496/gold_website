"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  fr: "FR",
  de: "DE",
  it: "IT",
  en: "EN",
};

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (nextLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = nextLocale; // segments[0] is "" before the leading slash
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div className="fixed top-8 right-8 z-40">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-white text-sm tracking-widest font-serif hover:opacity-70 transition-opacity"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))" }}
      >
        {LABELS[locale]}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-8 right-0 flex flex-col items-end gap-3 animate-menuFadeIn">
          {routing.locales
            .filter((l) => l !== locale)
            .map((l) => (
              <button
                key={l}
                onClick={() => switchTo(l)}
                className="text-white text-sm tracking-widest font-serif hover:opacity-70 transition-opacity"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))" }}
              >
                {LABELS[l]}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}