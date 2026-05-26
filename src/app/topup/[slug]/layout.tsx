import { games } from "@/lib/games";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = games.find((g) => g.slug === params.slug);
  if (!game) {
    return { title: "Game Not Found - NyinyiStore" };
  }

  const title = `Top Up ${game.name} Murah & Cepat - NyinyiStore`;
  const description = `Top up ${game.name} harga termurah. ${game.description}. Proses instan 1-3 detik. Bayar pakai Crypto, QRIS, atau Bank Transfer. Aman & terpercaya.`;

  return {
    title,
    description,
    keywords: [
      `top up ${game.name.toLowerCase()}`,
      `top up ${game.slug}`,
      `${game.name.toLowerCase()} murah`,
      `diamond ${game.name.toLowerCase()}`,
      `${game.name.toLowerCase()} indonesia`,
      "top up game murah",
      "nyinyistore",
    ],
    openGraph: {
      title,
      description,
      url: `https://nyinyistore.com/topup/${game.slug}`,
      siteName: "NyinyiStore",
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function TopUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
