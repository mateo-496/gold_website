import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function AboutTeaser() {
  const t = useTranslations("aboutTeaser");

  return (
    <section className="w-full min-h-[100dvh] flex flex-col bg-[#f5f5f5] snap-start">
      <div data-logo-bg="dark" className="relative w-full aspect-[21/9] md:aspect-[3/1] shrink-0">
        <Image
          src="/images/backgrounds/mountain1.jpeg"
          alt={t("title")}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="flex-1 px-6 py-20 md:py-28 flex flex-col items-center justify-center text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight text-neutral-900">
          {t("title")}
        </h2>
        <p className="text-neutral-600 leading-relaxed max-w-xl mb-8">
          {t("text")}
        </p>
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-neutral-900 hover:text-red-600 transition-colors"
        >
          {t("cta")}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}