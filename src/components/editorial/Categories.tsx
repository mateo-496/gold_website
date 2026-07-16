import Link from "next/link";
import { useTranslations } from "next-intl";

const KEYS = ["achat", "export", "revente"] as const;
const HREF: Record<(typeof KEYS)[number], string> = {
  achat: "/achat",
  export: "/export",
  revente: "/revente",
};

function DropTitle({ title, href }: { title: string; href: string }) {
  const first = title[0];
  const rest = title.slice(1);
  return (
    <Link href={href}>
      <h3 className="font-serif italic text-6xl md:text-7xl leading-none hover:opacity-70 transition-opacity">
        <span className="text-red-600">{first}</span>
        <span className="text-neutral-900">{rest}</span>
      </h3>
    </Link>
  );
}

export function Categories() {
  const t = useTranslations("categories");

  return (
    <section className="min-h-[100dvh] w-full bg-[#f5f5f5] px-6 py-32 flex flex-col justify-center snap-start">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl mb-24 leading-tight">
          {t("heading")}{" "}
          <em className="italic text-red-600">{t("headingAccent")}</em>
        </h2>

        <div className="space-y-20">
          {KEYS.map((key) => (
            <div key={key}>
              <DropTitle title={t(`${key}.title`)} href={HREF[key]} />
              <div className="border-t border-neutral-300 mt-6 mb-6" />
              <p className="text-neutral-600 leading-relaxed max-w-xl">
                {t(`${key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}