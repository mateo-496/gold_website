"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const MENU_ANIMATION_MS = 700;

export function Hero() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuMounted, setMenuMounted] = useState(false);
    const locale = useLocale();
    const tNav = useTranslations("nav");
    const tCategories = useTranslations("categories");

    const links = [
        { key: "achat", label: tCategories("achat.title"), href: `/${locale}/achat` },
        { key: "export", label: tCategories("export.title"), href: `/${locale}/export` },
        { key: "revente", label: tCategories("revente.title"), href: `/${locale}/revente` },
    ];

    useEffect(() => {
        if (menuOpen) {
            setMenuMounted(true);
            return;
        }
        if (!menuMounted) return;
        const timeout = setTimeout(() => setMenuMounted(false), MENU_ANIMATION_MS);
        return () => clearTimeout(timeout);
    }, [menuOpen, menuMounted]);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/gold_marble2.png')"}}
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
                    className={`h-[1.5px] w-full bg-white transition-transform duration-500 ease-in-out ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
                />
                <span
                    className={`h-[1.5px] w-full bg-white transition-opacity duration-500 ease-in-out ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                    className={`h-[1.5px] w-full bg-white transition-transform duration-500 ease-in-out ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
                />
            </button>

            {/* Menu overlay */}
            {menuMounted && (
                <div
                    className={`absolute inset-0 z-20 bg-black/90 flex items-center justify-center ${
                        menuOpen ? "animate-menuFadeIn" : "animate-menuFadeOut"
                    }`}
                >
                    <nav>
                        <ul className="flex flex-col items-center gap-8">
                            {links.map((link) => (
                                <li key={link.key}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="font-serif italic text-white text-4xl md:text-5xl hover:text-neutral-300 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}

            {/* Company name, centered */}
            <div className="relative z-10 h-full flex items-center justify-center">
                <h1 className="font-serif text-white text-[clamp(2.5rem,8vw,7rem)] tracking-wide">
                    OrCompare
                </h1>
            </div>

            {/* Scroll hint */}
            <a href="#next" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-scrollHint">
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                    <path d="M2 2L12 12L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </a>
        </section>
    )
}