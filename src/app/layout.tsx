import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NyinyiStore - Game Top Up Crypto",
  description:
    "Top up game favorit kamu dengan crypto. Cepat, aman, dan murah. Support USDT, USDC, QRIS, dan Bank Transfer.",
  keywords: ["game top up", "crypto", "USDT", "mobile legends", "free fire", "genshin impact"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100 antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
