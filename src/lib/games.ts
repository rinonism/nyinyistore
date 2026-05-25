export interface Denomination {
  amount: string;
  price: number;
  label: string;
}

export interface Game {
  name: string;
  slug: string;
  developer: string;
  image: string;
  description: string;
  denominations: Denomination[];
}

export const games: Game[] = [
  {
    name: "Mobile Legends",
    slug: "mobile-legends",
    developer: "Moonton",
    image: "/games/mobile-legends.jpg",
    description: "Diamond Top Up",
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
    name: "Mobile Legends Paket Irit",
    slug: "mobile-legends-paket-irit",
    developer: "Moonton",
    image: "/games/mobile-legends-paket-irit.jpg",
    description: "Paket Irit Diamond",
    denominations: [
      { amount: "86 Diamonds", price: 18000, label: "86 💎" },
      { amount: "172 Diamonds", price: 36000, label: "172 💎" },
      { amount: "257 Diamonds", price: 54000, label: "257 💎" },
      { amount: "344 Diamonds", price: 72000, label: "344 💎" },
    ],
  },
  {
    name: "Free Fire",
    slug: "free-fire",
    developer: "Garena",
    image: "/games/free-fire.jpg",
    description: "Diamond Top Up",
    denominations: [
      { amount: "70 Diamonds", price: 15000, label: "70 💎" },
      { amount: "140 Diamonds", price: 29000, label: "140 💎" },
      { amount: "355 Diamonds", price: 69000, label: "355 💎" },
      { amount: "720 Diamonds", price: 139000, label: "720 💎" },
    ],
  },
  {
    name: "Free Fire MAX",
    slug: "free-fire-max",
    developer: "Garena",
    image: "/games/free-fire-max.jpg",
    description: "Diamond Top Up",
    denominations: [
      { amount: "70 Diamonds", price: 15000, label: "70 💎" },
      { amount: "140 Diamonds", price: 29000, label: "140 💎" },
      { amount: "355 Diamonds", price: 69000, label: "355 💎" },
      { amount: "720 Diamonds", price: 139000, label: "720 💎" },
    ],
  },
  {
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    developer: "Tencent Games",
    image: "/games/pubg-mobile.png",
    description: "UC Top Up",
    denominations: [
      { amount: "60 UC", price: 15000, label: "60 UC" },
      { amount: "325 UC", price: 75000, label: "325 UC" },
      { amount: "660 UC", price: 149000, label: "660 UC" },
      { amount: "1800 UC", price: 389000, label: "1800 UC" },
    ],
  },
  {
    name: "Valorant",
    slug: "valorant",
    developer: "Riot Games",
    image: "/games/valorant.jpg",
    description: "VP Top Up",
    denominations: [
      { amount: "125 VP", price: 15000, label: "125 VP" },
      { amount: "420 VP", price: 49000, label: "420 VP" },
      { amount: "700 VP", price: 79000, label: "700 VP" },
      { amount: "1375 VP", price: 149000, label: "1375 VP" },
    ],
  },
  {
    name: "Genshin Impact",
    slug: "genshin-impact",
    developer: "HoYoverse",
    image: "/games/genshin-impact.jpg",
    description: "Genesis Crystal Top Up",
    denominations: [
      { amount: "60 Crystals", price: 16000, label: "60 💠" },
      { amount: "330 Crystals", price: 79000, label: "330 💠" },
      { amount: "1090 Crystals", price: 249000, label: "1090 💠" },
      { amount: "2240 Crystals", price: 489000, label: "2240 💠" },
    ],
  },
  {
    name: "Honkai Star Rail",
    slug: "honkai-star-rail",
    developer: "HoYoverse",
    image: "/games/honkai-star-rail.jpg",
    description: "Oneiric Shard Top Up",
    denominations: [
      { amount: "60 Shards", price: 16000, label: "60 ✨" },
      { amount: "330 Shards", price: 79000, label: "330 ✨" },
      { amount: "1090 Shards", price: 249000, label: "1090 ✨" },
      { amount: "2240 Shards", price: 489000, label: "2240 ✨" },
    ],
  },
  {
    name: "ROBLOX",
    slug: "roblox",
    developer: "Roblox Corporation",
    image: "/games/roblox.jpg",
    description: "Robux Top Up",
    denominations: [
      { amount: "80 Robux", price: 15000, label: "80 R$" },
      { amount: "400 Robux", price: 69000, label: "400 R$" },
      { amount: "800 Robux", price: 135000, label: "800 R$" },
      { amount: "1700 Robux", price: 269000, label: "1700 R$" },
    ],
  },
  {
    name: "Mobile Legends Global",
    slug: "mobile-legends-global",
    developer: "Moonton",
    image: "/games/mobile-legends-global.jpg",
    description: "Diamond Global Server",
    denominations: [
      { amount: "86 Diamonds", price: 20000, label: "86 💎" },
      { amount: "172 Diamonds", price: 40000, label: "172 💎" },
      { amount: "257 Diamonds", price: 60000, label: "257 💎" },
      { amount: "514 Diamonds", price: 120000, label: "514 💎" },
    ],
  },
  {
    name: "Magic Chess Go Go",
    slug: "magic-chess-go-go",
    developer: "Vizta Games",
    image: "/games/magic-chess-go-go.jpg",
    description: "Diamond Top Up",
    denominations: [
      { amount: "86 Diamonds", price: 19000, label: "86 💎" },
      { amount: "172 Diamonds", price: 38000, label: "172 💎" },
      { amount: "257 Diamonds", price: 57000, label: "257 💎" },
    ],
  },
  {
    name: "Blood Strike",
    slug: "blood-strike",
    developer: "Wizard Games",
    image: "/games/blood-strike.jpg",
    description: "Gold Top Up",
    denominations: [
      { amount: "60 Gold", price: 15000, label: "60 🪙" },
      { amount: "300 Gold", price: 69000, label: "300 🪙" },
      { amount: "980 Gold", price: 219000, label: "980 🪙" },
    ],
  },
  {
    name: "Call of Duty Mobile",
    slug: "call-of-duty-mobile",
    developer: "Garena",
    image: "/games/call-of-duty-mobile.jpg",
    description: "CP Top Up",
    denominations: [
      { amount: "80 CP", price: 15000, label: "80 CP" },
      { amount: "400 CP", price: 69000, label: "400 CP" },
      { amount: "880 CP", price: 149000, label: "880 CP" },
    ],
  },
  {
    name: "Delta Force Garena",
    slug: "delta-force-garena",
    developer: "Garena",
    image: "/games/delta-force-garena.jpg",
    description: "Token Top Up",
    denominations: [
      { amount: "60 Token", price: 15000, label: "60 🎯" },
      { amount: "300 Token", price: 69000, label: "300 🎯" },
      { amount: "980 Token", price: 219000, label: "980 🎯" },
    ],
  },
  {
    name: "Delta Force Steam",
    slug: "delta-force-steam",
    developer: "Team Jade",
    image: "/games/delta-force-steam.jpg",
    description: "Token Top Up",
    denominations: [
      { amount: "60 Token", price: 15000, label: "60 🎯" },
      { amount: "300 Token", price: 69000, label: "300 🎯" },
      { amount: "980 Token", price: 219000, label: "980 🎯" },
    ],
  },
  {
    name: "Stumble Guys",
    slug: "stumble-guys",
    developer: "Kitka Games",
    image: "/games/stumble-guys.jpg",
    description: "Gems Top Up",
    denominations: [
      { amount: "250 Gems", price: 15000, label: "250 💎" },
      { amount: "1250 Gems", price: 69000, label: "1250 💎" },
      { amount: "2500 Gems", price: 135000, label: "2500 💎" },
    ],
  },
  {
    name: "Clash of Clans",
    slug: "clash-of-clans",
    developer: "Supercell",
    image: "/games/clash-of-clans.jpg",
    description: "Gems Top Up",
    denominations: [
      { amount: "80 Gems", price: 16000, label: "80 💎" },
      { amount: "500 Gems", price: 79000, label: "500 💎" },
      { amount: "1200 Gems", price: 159000, label: "1200 💎" },
      { amount: "2500 Gems", price: 319000, label: "2500 💎" },
    ],
  },
  {
    name: "Apex Legends Mobile",
    slug: "apex-legends-mobile",
    developer: "EA",
    image: "/games/apex-legends-mobile.jpg",
    description: "Coins Top Up",
    denominations: [
      { amount: "150 Coins", price: 25000, label: "150 🪙" },
      { amount: "600 Coins", price: 89000, label: "600 🪙" },
      { amount: "1200 Coins", price: 169000, label: "1200 🪙" },
    ],
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
