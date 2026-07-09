"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { COUNTRIES } from "@/i18n/routing";

export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paysOpen, setPaysOpen] = useState(false);
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tCategories = useTranslations("categories");
  const tCountries = useTranslations("countries");

  const links = [
    { key: "achat", label: tCategories("achat.title"), href: `/${locale}/achat` },
    { key: "export", label: tCategories("export.title"), href: `/${locale}/export` },
    { key: "revente", label: tCategories("revente.title"), href: `/${locale}/revente` },
  ];

  const closeAll = () => {
    setMenuOpen(false);
    setPaysOpen(false);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/gold_marble2.png')" }}
      />
      <div className="absolute inset-0 bg-black/35" />

      {/* Hamburger menu - transparent, top left */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        className="absolute top-8 left-8 z-30 flex flex-col gap-1.5 w-8"
      >
        <span
          className={`h-[1.5px] w-full bg-white transition-transform duration-500 ease-in-out ${
            menuOpen ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`h-[1.5px] w-full bg-white transition-opacity duration-500 ease-in-out ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-[1.5px] w-full bg-white transition-transform duration-500 ease-in-out ${
            menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </button>

      {/* Overlay menu */}
      {menuOpen && (
        <div className="absolute inset-0 z-20 bg-black/90 flex items-center justify-center animate-menuFadeIn">
          {!paysOpen ? (
            <nav className="flex flex-col items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={closeAll}
                  className="font-serif text-white text-3xl tracking-wide hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setPaysOpen(true)}
                className="font-serif text-white text-3xl tracking-wide hover:opacity-70 transition-opacity"
              >
                {tNav("pays")}
              </button>
            </nav>
          ) : (
            <nav className="flex flex-col items-center gap-8 animate-menuFadeIn">
              <button
                onClick={() => setPaysOpen(false)}
                aria-label="Back"
                className="absolute top-8 right-8 text-white text-sm tracking-widest hover:opacity-70 transition-opacity"
              >
                {tNav("back") ?? "←"}
              </button>
              {COUNTRIES.map((country) => (
                <Link
                  key={country}
                  href={`/${locale}/pays/${country}`}
                  onClick={closeAll}
                  className="font-serif text-white text-3xl tracking-wide hover:opacity-70 transition-opacity"
                >
                  {tCountries(`${country}.name`)}
                </Link>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* Company name, centered */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <h1 className="font-serif text-white text-[clamp(2.5rem,8vw,7rem)] tracking-wide">
          OrCompare
        </h1>
      </div>
    </section>
  );
}