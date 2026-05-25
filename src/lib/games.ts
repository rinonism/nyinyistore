export interface Denomination {
  amount: string;
  price: number;
  label: string;
}

export interface Game {
  name: string;
  slug: string;
  icon: string;
  description: string;
  denominations: Denomination[];
}

export const games: Game[] = [
  {
    name: "Mobile Legends",
    slug: "mobile-legends",
    icon: "⚔️",
    description: "Mobile Legends: Bang Bang Diamond Top Up",
    denominations: [
      { amount: "86 Diamonds", price: 19000, label: "86 💎" },
      { amount: "172 Diamonds", price: 38000, label: "172 💎" },
      { amount: "257 Diamonds", price: 57000, label: "257 💎" },
      { amount: "344 Diamonds", price: 76000, label: "344 💎" },
      { amount: "514 Diamonds", price: 114000, label: "514 💎" },
      { amount: "706 Diamonds", price: 152000, label: "706 💎" },
    ],
  },
  {
    name: "Free Fire",
    slug: "free-fire",
    icon: "🔥",
    description: "Garena Free Fire Diamond Top Up",
    denominations: [
      { amount: "70 Diamonds", price: 15000, label: "70 💎" },
      { amount: "140 Diamonds", price: 29000, label: "140 💎" },
      { amount: "355 Diamonds", price: 69000, label: "355 💎" },
      { amount: "720 Diamonds", price: 139000, label: "720 💎" },
      { amount: "1450 Diamonds", price: 279000, label: "1450 💎" },
      { amount: "2180 Diamonds", price: 419000, label: "2180 💎" },
    ],
  },
  {
    name: "Genshin Impact",
    slug: "genshin-impact",
    icon: "🌟",
    description: "Genshin Impact Genesis Crystal Top Up",
    denominations: [
      { amount: "60 Crystals", price: 16000, label: "60 💠" },
      { amount: "330 Crystals", price: 79000, label: "330 💠" },
      { amount: "1090 Crystals", price: 249000, label: "1090 💠" },
      { amount: "2240 Crystals", price: 479000, label: "2240 💠" },
      { amount: "3880 Crystals", price: 799000, label: "3880 💠" },
      { amount: "8080 Crystals", price: 1599000, label: "8080 💠" },
    ],
  },
  {
    name: "Valorant",
    slug: "valorant",
    icon: "🎯",
    description: "Valorant Points (VP) Top Up",
    denominations: [
      { amount: "125 VP", price: 15000, label: "125 VP" },
      { amount: "420 VP", price: 49000, label: "420 VP" },
      { amount: "700 VP", price: 79000, label: "700 VP" },
      { amount: "1375 VP", price: 149000, label: "1375 VP" },
      { amount: "2400 VP", price: 249000, label: "2400 VP" },
      { amount: "4000 VP", price: 399000, label: "4000 VP" },
    ],
  },
  {
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    icon: "🪖",
    description: "PUBG Mobile UC Top Up",
    denominations: [
      { amount: "60 UC", price: 15000, label: "60 UC" },
      { amount: "325 UC", price: 75000, label: "325 UC" },
      { amount: "660 UC", price: 149000, label: "660 UC" },
      { amount: "1800 UC", price: 379000, label: "1800 UC" },
      { amount: "3850 UC", price: 759000, label: "3850 UC" },
      { amount: "8100 UC", price: 1519000, label: "8100 UC" },
    ],
  },
  {
    name: "Honkai Star Rail",
    slug: "honkai-star-rail",
    icon: "🚀",
    description: "Honkai: Star Rail Oneiric Shard Top Up",
    denominations: [
      { amount: "60 Shards", price: 16000, label: "60 ✨" },
      { amount: "330 Shards", price: 79000, label: "330 ✨" },
      { amount: "1090 Shards", price: 249000, label: "1090 ✨" },
      { amount: "2240 Shards", price: 479000, label: "2240 ✨" },
      { amount: "3880 Shards", price: 799000, label: "3880 ✨" },
      { amount: "8080 Shards", price: 1599000, label: "8080 ✨" },
    ],
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
