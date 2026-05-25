import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: "NyinyiStore - Top Up Game Termurah & Tercepat",
  description:
    "Top up game favorit kamu dengan harga termurah. Proses cepat 1-3 detik. Support Crypto, QRIS, dan Bank Transfer. Open 24 jam.",
  keywords: ["game top up", "crypto", "USDT", "mobile legends", "free fire", "genshin impact", "top up murah"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} ${fredoka.variable} bg-[#121212] text-[#f5f5f5] antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
