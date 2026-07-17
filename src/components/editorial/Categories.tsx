import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const KEYS = ["achat", "export", "revente"] as const;
const HREF: Record<(typeof KEYS)[number], string> = {
  achat: "/achat",
  export: "/export",
  revente: "/revente",
};
// Replace with your own imagery in /public/images/categories/
const IMAGE: Record<(typeof KEYS)[number], string> = {
  achat: "/images/categories/achat.jpg",
  export: "/images/categories/export.jpg",
  revente: "/images/categories/revente.jpg",
};

export function Categories() {
  const t = useTranslations("categories");

  return (
    <section className="min-h-[100dvh] w-full bg-[#f5f5f5] px-6 py-32 flex flex-col justify-center snap-start">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="font-serif text-4xl md:text-5xl mb-16 md:mb-20 leading-tight">
          <span className="text-neutral-900">{t("heading")}</span>{" "}
          <em className="italic text-red-600">{t("headingAccent")}</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
          {KEYS.map((key) => (
            <Link key={key} href={HREF[key]} className="group block">
              <div className="relative aspect-square w-full overflow-hidden mb-8 bg-neutral-200">
                <Image
                  src={IMAGE[key]}
                  alt={t(`${key}.title`)}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl leading-none mb-4 text-neutral-900">
                {t(`${key}.title`)}
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-6">
                {t(`${key}.text`)}
              </p>
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-neutral-900 group-hover:text-red-600 transition-colors">
                {t(`${key}.title`)}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}