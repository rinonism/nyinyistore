import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: "NyinyiStore - Top Up Game Termurah & Tercepat",
  description:
    "Top up game favorit kamu dengan harga termurah. Mobile Legends, Free Fire, PUBG, Genshin Impact, Valorant. Proses cepat 1-3 detik. Support Crypto, QRIS, dan Bank Transfer. Open 24 jam.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  keywords: [
    "top up game murah",
    "top up mobile legends",
    "top up ml murah",
    "top up free fire",
    "top up ff murah",
    "top up diamond ml",
    "top up diamond ff",
    "top up genshin impact",
    "top up valorant",
    "top up pubg mobile",
    "top up roblox",
    "top up game crypto",
    "top up game usdt",
    "nyinyistore",
    "game voucher indonesia",
  ],
  openGraph: {
    title: "NyinyiStore - Top Up Game Termurah & Tercepat",
    description: "Top up game favorit kamu dengan harga termurah. Proses cepat 1-3 detik. Support Crypto, QRIS, dan Bank Transfer.",
    url: "https://nyinyistore.com",
    siteName: "NyinyiStore",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "NyinyiStore - Top Up Game Termurah & Tercepat",
    description: "Top up game favorit kamu dengan harga termurah. Proses cepat 1-3 detik.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://nyinyistore.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${inter.className} ${fredoka.variable} bg-[#121212] text-[#f5f5f5] antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
