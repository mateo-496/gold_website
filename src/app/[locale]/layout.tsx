import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/editorial/LanguageSwitcher";
import { Logo } from "@/components/editorial/Logo";
import { Footer } from "@/components/editorial/Footer";
import { ScrollSnapController } from "@/components/editorial/ScrollSnapController";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "../globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-numeric",
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "GoldAlp.ch",
  description: "Comparateur de vendeur d'or en Suisse",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${fraunces.variable} ${geistMono.variable} ${ibmPlexSans.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ScrollSnapController />
          <Logo />
          <LanguageSwitcher />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}