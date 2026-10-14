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

export const metadata: Metadata = {
  title: "Zollman Blue — Coming Soon",
  description: "Zollman Blue — coming soon to Johnson City, Texas.",
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
