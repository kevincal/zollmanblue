import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const KLAVIYO_COMPANY_ID = "Uy3cbN";

// Klaviyo's onsite stub: queues klaviyo.* calls until klaviyo.js loads.
const KLAVIYO_INIT = `!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`;

const GA_MEASUREMENT_ID = "G-MCPW83785F";

const GA_INIT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`;

const TITLE ="Zollman Blue — Vintage Home & Objects";
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
    <html lang="en" className={`${bodoni.className} ${bodoni.variable}`}>
      <body>
        {children}
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {GA_INIT}
        </Script>
        <Script id="klaviyo-init" strategy="afterInteractive">
          {KLAVIYO_INIT}
        </Script>
        <Script
          src={`https://static.klaviyo.com/onsite/js/${KLAVIYO_COMPANY_ID}/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
