"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { COUNTRIES } from "@/i18n/routing";

export function PageNav() {
  const [paysOpen, setPaysOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [mobilePaysOpen, setMobilePaysOpen] = useState(false);
  const [navFading, setNavFading] = useState(false);
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tCategories = useTranslations("categories");
  const tCountries = useTranslations("countries");

  const links = [
    { key: "home", label: "Home", href: `/${locale}` },
    { key: "achat", label: tCategories("achat.title"), href: `/${locale}/achat` },
    { key: "export", label: tCategories("export.title"), href: `/${locale}/export` },
    { key: "revente", label: tCategories("revente.title"), href: `/${locale}/revente` },
    { key: "about", label: tNav("about"), href: `/about` },
  ];

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      setTimeout(() => {
        setMenuMounted(false);
        setMobilePaysOpen(false);
      }, 700);
    } else {
      setMenuMounted(true);
      setMenuOpen(true);
    }
  };

  const closeAll = () => {
    setMenuOpen(false);
    setTimeout(() => {
      setMenuMounted(false);
      setMobilePaysOpen(false);
    }, 700);
  };

  const switchToPays = () => {
    setNavFading(true);
    setTimeout(() => {
      setMobilePaysOpen(true);
      setNavFading(false);
    }, 350);
  };

  const switchToMain = () => {
    setNavFading(true);
    setTimeout(() => {
      setMobilePaysOpen(false);
      setNavFading(false);
    }, 350);
  };

  return (
    <>
      {/* Desktop nav — hidden below 1200px */}
      <nav className="hidden min-[1350px]:flex items-center gap-8 font-serif text-lg xl:text-xl tracking-wide text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
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

      {/* Mobile hamburger — shown below 1200px */}
      <button
        onClick={toggleMenu}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        className="min-[1200px]:hidden relative z-40 flex flex-col gap-1.5 w-7"
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

      {/* Mobile overlay menu */}
      {menuMounted && (
        <div
          className={`fixed inset-0 z-30 bg-black/90 flex items-center justify-center min-[1200px]:hidden ${
            menuOpen ? "animate-menuFadeIn" : "animate-menuFadeOut"
          }`}
        >
          {!mobilePaysOpen ? (
            <nav className={`flex flex-col items-center gap-8 ${navFading ? "animate-navFadeOut" : "animate-navFadeIn"}`}>
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
                onClick={switchToPays}
                className="font-serif text-white text-3xl tracking-wide hover:opacity-70 transition-opacity"
              >
                {tNav("pays")}
              </button>
            </nav>
          ) : (
            <nav className={`flex flex-col items-center gap-8 ${navFading ? "animate-navFadeOut" : "animate-navFadeIn"}`}>
              <button
                onClick={switchToMain}
                aria-label="Back"
                className="absolute top-24 left-8 text-white text-sm tracking-widest hover:opacity-70 transition-opacity"
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
    </>
  );
}