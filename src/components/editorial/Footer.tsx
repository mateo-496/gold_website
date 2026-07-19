"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export function Footer() {
    const t = useTranslations("footer");
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);
    const isHome =
        segments.length === 1 &&
        (routing.locales as readonly string[]).includes(segments[0]);

    return (
        <footer
            data-logo-hide="true"
            className={`border-t border-neutral-200 py-8 ${isHome ? "snap-end" : ""}`}
        >
            <div className="mx-auto max-w-2xl px-6 flex flex-col items-center gap-4">
                <a
                    href="mailto:contact@goldalp.ch"
                    className="font-serif text-sm text-neutral-500 hover:text-neutral-900 transition-colors"            
                >
                    contact@goldalp.ch
                </a>
                <p className="text-xs text-neutral-400 text-center max-w-2xl">
                    {t('disclaimer')}
                </p>
            </div> 
        </footer>
    )
}