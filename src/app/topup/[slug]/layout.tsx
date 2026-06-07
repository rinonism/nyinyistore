import { games } from "@/lib/games";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

// Prerender every game page as static HTML at build time.
// Without this, [slug] is server-rendered on demand (Node cold start ~2-3s per cold hit).
export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

// Unknown slugs 404 immediately instead of spinning up a serverless render.
export const dynamicParams = false;

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
    alternates: {
      canonical: `https://nyinyistore.com/topup/${game.slug}`,
    },
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

export default function TopUpLayout({ params, children }: Props) {
  const game = games.find((g) => g.slug === params.slug);

  if (!game) {
    return <>{children}</>;
  }

  const availableDenoms = game.denominations.filter(d => !d.comingSoon);

  // Skip structured data if no available denominations (prevents invalid schema)
  if (availableDenoms.length === 0) {
    return <>{children}</>;
  }

  const lowestPrice = Math.min(...availableDenoms.map(d => d.price));
  const highestPrice = Math.max(...availableDenoms.map(d => d.price));

  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Top Up ${game.name}`,
    description: `Top up ${game.name} harga termurah. ${game.description}. Proses instan 1-3 detik.`,
    image: `https://nyinyistore.com${game.image}`,
    brand: {
      "@type": "Brand",
      name: game.developer,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: availableDenoms.length,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "NyinyiStore",
        url: "https://nyinyistore.com",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: {
        "@type": "Person",
        name: "Anonim",
      },
      reviewBody: "Proses cepat banget, diamond langsung masuk. Harga paling murah dibanding toko lain.",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}
