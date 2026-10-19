import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const TITLE = "Zollman Blue — Vintage Home & Objects";
const DESCRIPTION =
  "Zollman Blue curates high-end yet accessible vintage furniture and objects, from Mid-Century to classical French, blending Hill Country ease with timeless classical touches that carry across generations.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zollmanblue.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Zollman Blue",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bodoni.className}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
