import Image from "next/image";

type CountryKey = "switzerland" | "france" | "germany" | "italy" | "usa";

/**
 * Official national emblems, sourced as PNG renders from Wikimedia Commons
 * (in the manner of Henley & Partners' country markers, which use the
 * genuine coat of arms rather than a stylized icon).
 *
 * Sources — all served via Commons' Special:FilePath, which rasterizes the
 * canonical SVG to a PNG at the requested width. These are stable, official
 * URLs (the same mechanism Wikipedia itself uses to embed these images):
 *   - Switzerland: "Coat of arms of Switzerland.svg" — public domain
 *     (note: the Swiss cross carries special protection akin to the Red
 *     Cross emblem under the Geneva Conventions in some jurisdictions;
 *     fine for informational/editorial display, avoid using it as a mark
 *     that could imply endorsement by the Confederation)
 *   - France: "Armoiries république française.svg", the 1913 diplomatic
 *     emblem (fasces) by Jules-Clément Chaplain — CC BY-SA 2.0 FR,
 *     attribution required (see ATTRIBUTION below)
 *   - Germany: "Coat of arms of Germany.svg" (Bundesadler) — public domain
 *   - Italy: "Emblem of Italy.svg" — public domain
 *   - USA: "Great Seal of the United States (obverse).svg" — public domain
 *     (US federal government work)
 *
 * ATTRIBUTION: the French emblem is CC BY-SA 2.0 FR, which requires credit.
 * If these run on publicly served pages, add a small credit line near the
 * France country page/footer, e.g. "French emblem: Jules-Clément Chaplain,
 * via Wikimedia Commons, CC BY-SA 2.0 FR."
 *
 * For production it's better to download these once and self-host under
 * /public/emblems/ rather than hotlink Commons — avoids a runtime
 * dependency on Wikimedia's availability and lets next/image optimize
 * them locally. Swap SRC below for local paths once downloaded.
 */
const COMMONS_FILE: Record<CountryKey, string> = {
  switzerland: "Coat_of_arms_of_Switzerland.svg",
  france: "Armoiries_r%C3%A9publique_fran%C3%A7aise.svg",
  germany: "Coat_of_arms_of_Germany.svg",
  italy: "Emblem_of_Italy.svg",
  usa: "Great_Seal_of_the_United_States_%28obverse%29.svg",
};

const ALT: Record<CountryKey, string> = {
  switzerland: "Coat of arms of Switzerland",
  france: "Emblem of the French Republic",
  germany: "Coat of arms of Germany",
  italy: "Emblem of Italy",
  usa: "Great Seal of the United States",
};

function commonsUrl(file: string, widthPx: number) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${widthPx}`;
}

export function CountryEmblem({
  country,
  className = "",
  size = 24,
}: {
  country: CountryKey;
  className?: string;
  size?: number;
}) {
  const file = COMMONS_FILE[country];
  if (!file) return null;

  // Fetch a raster ~3x the display size for crisp rendering on retina.
  const src = commonsUrl(file, size * 3);

  return (
    <Image
      src={src}
      alt={ALT[country]}
      width={size}
      height={size}
      unoptimized
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export type { CountryKey };