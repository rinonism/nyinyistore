export interface Denomination {
  amount: string;
  price: number;
  label: string;
  sku?: string;
  comingSoon?: boolean;
  bonusLabel?: string;
}

export interface Game {
  name: string;
  slug: string;
  developer: string;
  image: string;
  description: string;
  region?: string;
  needsServerId?: boolean;
  idLabel?: string;
  idPlaceholder?: string;
  denominations: Denomination[];
}

export const games: Game[] = [
  {
    name: "Mobile Legends",
    slug: "mobile-legends",
    developer: "Moonton",
    image: "/games/mobile-legends.jpg",
    description: "Diamond Top Up",
    region: "INDONESIA",
    needsServerId: true,
    denominations: [
      { amount: "5 Diamonds", price: 1750, label: "5 💎", sku: "ml5" },
      { amount: "10 Diamonds", price: 3200, label: "10 💎", sku: "ml10" },
      { amount: "12 Diamonds", price: 3650, label: "12 💎", sku: "ml12" },
      { amount: "42 Diamonds", price: 12400, label: "42 💎", sku: "ml42" },
      { amount: "86 Diamonds", price: 23100, label: "86 💎", sku: "ML86." },
      { amount: "112 Diamonds", price: 31000, label: "112 💎", sku: "ml112" },
      { amount: "144 Diamonds", price: 39900, label: "144 💎", sku: "ml144" },
      { amount: "172 Diamonds", price: 47700, label: "172 💎", sku: "ml172" },
      { amount: "210 Diamonds", price: 58500, label: "210 💎", sku: "ml210" },
      { amount: "225 Diamonds", price: 62800, label: "225 💎", sku: "ml225" },
      { amount: "252 Diamonds", price: 70300, label: "252 💎", sku: "ml252" },
      { amount: "275 Diamonds", price: 77400, label: "275 💎", sku: "ml275" },
      { amount: "284 Diamonds", price: 79000, label: "284 💎", sku: "ml284" },
      { amount: "305 Diamonds", price: 85300, label: "305 💎", sku: "ml305" },
      { amount: "344 Diamonds", price: 95900, label: "344 💎", sku: "ml344" },
      { amount: "355 Diamonds", price: 98500, label: "355 💎", sku: "ml355" },
      { amount: "381 Diamonds", price: 105700, label: "381 💎", sku: "ml381" },
      { amount: "406 Diamonds", price: 112800, label: "406 💎", sku: "ml406" },
      { amount: "427 Diamonds", price: 118500, label: "427 💎", sku: "ml427" },
      { amount: "Weekly Elite Bundle", price: 15800, label: "Weekly Elite Bundle", sku: "mlelite" },
      { amount: "Weekly Diamond Pass", price: 29400, label: "Weekly Diamond Pass", sku: "mlweek" },
      { amount: "Weekly Diamond Pass 2x", price: 58100, label: "Weekly Diamond Pass 2x", sku: "mlweek2" },
      { amount: "Monthly Epic Bundle", price: 69100, label: "Monthly Epic Bundle", sku: "mlbndle" },
      { amount: "Coupon Pass", price: 74100, label: "Coupon Pass", sku: "mlcoupon" },
      { amount: "Starlight Member", price: 81900, label: "Starlight Member", sku: "mlstar" },
      { amount: "Weekly Diamond Pass 3x", price: 87300, label: "Weekly Diamond Pass 3x", sku: "mlweek3" },
      { amount: "Weekly Diamond Pass 4x", price: 116200, label: "Weekly Diamond Pass 4x", sku: "mlweek4" },
      { amount: "Weekly Diamond Pass 5x", price: 145500, label: "Weekly Diamond Pass 5x", sku: "mlweek5" },
      { amount: "Twilight Pass", price: 151800, label: "Twilight Pass", sku: "mltwig" },
      { amount: "Starlight Member Plus", price: 201600, label: "Starlight Member Plus", sku: "mlslplus" },
    ],
  },
  {
    name: "Mobile Legends Paket Irit",
    slug: "mobile-legends-paket-irit",
    developer: "Moonton",
    needsServerId: true,
    image: "/games/mobile-legends-paket-irit.jpg",
    description: "Paket Irit Diamond",
    denominations: [
      { amount: "5 Diamonds", price: 1750, label: "5 💎", sku: "ml5" },
      { amount: "10 Diamonds", price: 3200, label: "10 💎", sku: "ml10" },
      { amount: "12 Diamonds", price: 3850, label: "12 💎", sku: "ml12" },
      { amount: "86 Diamonds", price: 18000, label: "86 💎", comingSoon: true },
      { amount: "172 Diamonds", price: 36000, label: "172 💎", comingSoon: true },
      { amount: "257 Diamonds", price: 54000, label: "257 💎", comingSoon: true },
      { amount: "344 Diamonds", price: 72000, label: "344 💎", comingSoon: true },
    ],
  },
  {
    name: "Free Fire",
    slug: "free-fire",
    developer: "Garena",
    image: "/games/free-fire.jpg",
    description: "Diamond Top Up",
    denominations: [
      { amount: "12 Diamonds", price: 2000, label: "12 💎", sku: "ff12" },
      { amount: "50 Diamonds", price: 8400, label: "50 💎", sku: "ff50" },
      { amount: "70 Diamonds", price: 9500, label: "70 💎", sku: "ff70" },
      { amount: "140 Diamonds", price: 19800, label: "140 💎", sku: "ff140" },
      { amount: "355 Diamonds", price: 47850, label: "355 💎", sku: "ff355" },
      { amount: "720 Diamonds", price: 99750, label: "720 💎", comingSoon: true },
    ],
  },
  {
    name: "Free Fire MAX",
    slug: "free-fire-max",
    developer: "Garena",
    image: "/games/free-fire-max.jpg",
    description: "Diamond Top Up",
    denominations: [
      { amount: "12 Diamonds", price: 2000, label: "12 💎", sku: "ff12" },
      { amount: "50 Diamonds", price: 8400, label: "50 💎", sku: "ff50" },
      { amount: "70 Diamonds", price: 9500, label: "70 💎", sku: "ff70" },
      { amount: "140 Diamonds", price: 19800, label: "140 💎", sku: "ff140" },
      { amount: "355 Diamonds", price: 47850, label: "355 💎", sku: "ff355" },
      { amount: "720 Diamonds", price: 99750, label: "720 💎", comingSoon: true },
    ],
  },
  {
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    developer: "Tencent Games",
    image: "/games/pubg-mobile.png",
    description: "UC Top Up",
    denominations: [
      { amount: "60 UC", price: 15000, label: "60 UC", comingSoon: true },
      { amount: "325 UC", price: 75000, label: "325 UC", comingSoon: true },
      { amount: "660 UC", price: 149000, label: "660 UC", comingSoon: true },
      { amount: "1800 UC", price: 389000, label: "1800 UC", comingSoon: true },
    ],
  },
  {
    name: "Valorant",
    slug: "valorant",
    developer: "Riot Games",
    image: "/games/valorant.jpg",
    idLabel: "Riot ID",
    idPlaceholder: "Name#TAG",
    description: "VP Top Up",
    denominations: [
      { amount: "125 VP", price: 15000, label: "125 VP", comingSoon: true },
      { amount: "420 VP", price: 49000, label: "420 VP", comingSoon: true },
      { amount: "700 VP", price: 79000, label: "700 VP", comingSoon: true },
      { amount: "1375 VP", price: 149000, label: "1375 VP", comingSoon: true },
    ],
  },
  {
    name: "Genshin Impact",
    slug: "genshin-impact",
    developer: "HoYoverse",
    image: "/games/genshin-impact.jpg",
    idLabel: "UID",
    idPlaceholder: "Masukkan UID",
    description: "Genesis Crystal Top Up",
    denominations: [
      { amount: "60 Crystals", price: 16000, label: "60 💠", comingSoon: true },
      { amount: "330 Crystals", price: 79000, label: "330 💠", comingSoon: true },
      { amount: "1090 Crystals", price: 249000, label: "1090 💠", comingSoon: true },
      { amount: "2240 Crystals", price: 489000, label: "2240 💠", comingSoon: true },
    ],
  },
  {
    name: "Honkai Star Rail",
    slug: "honkai-star-rail",
    developer: "HoYoverse",
    image: "/games/honkai-star-rail.jpg",
    idLabel: "UID",
    idPlaceholder: "Masukkan UID",
    description: "Oneiric Shard Top Up",
    denominations: [
      { amount: "60 Shards", price: 16000, label: "60 ✨", comingSoon: true },
      { amount: "330 Shards", price: 79000, label: "330 ✨", comingSoon: true },
      { amount: "1090 Shards", price: 249000, label: "1090 ✨", comingSoon: true },
      { amount: "2240 Shards", price: 489000, label: "2240 ✨", comingSoon: true },
    ],
  },
  {
    name: "ROBLOX",
    slug: "roblox",
    developer: "Roblox Corporation",
    image: "/games/roblox.jpg",
    idLabel: "Username",
    idPlaceholder: "Masukkan Username",
    description: "Robux Top Up",
    denominations: [
      { amount: "80 Robux", price: 15000, label: "80 R$", comingSoon: true },
      { amount: "400 Robux", price: 69000, label: "400 R$", comingSoon: true },
      { amount: "800 Robux", price: 135000, label: "800 R$", comingSoon: true },
      { amount: "1700 Robux", price: 269000, label: "1700 R$", comingSoon: true },
    ],
  },
  {
    name: "Mobile Legends Global",
    slug: "mobile-legends-global",
    developer: "Moonton",
    needsServerId: true,
    image: "/games/mobile-legends-global.jpg",
    description: "Diamond Global Server",
    denominations: [
      { amount: "86 Diamonds", price: 20000, label: "86 💎", comingSoon: true },
      { amount: "172 Diamonds", price: 40000, label: "172 💎", comingSoon: true },
      { amount: "257 Diamonds", price: 60000, label: "257 💎", comingSoon: true },
      { amount: "514 Diamonds", price: 120000, label: "514 💎", comingSoon: true },
    ],
  },
  {
    name: "Magic Chess Go Go",
    slug: "magic-chess-go-go",
    developer: "Vizta Games",
    image: "/games/magic-chess-go-go.jpg",
    description: "Diamond Top Up",
    denominations: [
      { amount: "86 Diamonds", price: 20450, label: "86 💎", comingSoon: true },
      { amount: "172 Diamonds", price: 40850, label: "172 💎", comingSoon: true },
      { amount: "257 Diamonds", price: 61300, label: "257 💎", comingSoon: true },
    ],
  },
  {
    name: "Blood Strike",
    slug: "blood-strike",
    developer: "Wizard Games",
    image: "/games/blood-strike.jpg",
    description: "Gold Top Up",
    denominations: [
      { amount: "60 Gold", price: 15000, label: "60 🪙", comingSoon: true },
      { amount: "300 Gold", price: 69000, label: "300 🪙", comingSoon: true },
      { amount: "980 Gold", price: 219000, label: "980 🪙", comingSoon: true },
    ],
  },
  {
    name: "Call of Duty Mobile",
    slug: "call-of-duty-mobile",
    developer: "Garena",
    image: "/games/call-of-duty-mobile.jpg",
    description: "CP Top Up",
    denominations: [
      { amount: "80 CP", price: 15000, label: "80 CP", comingSoon: true },
      { amount: "400 CP", price: 69000, label: "400 CP", comingSoon: true },
      { amount: "880 CP", price: 149000, label: "880 CP", comingSoon: true },
    ],
  },
  {
    name: "Delta Force Garena",
    slug: "delta-force-garena",
    developer: "Garena",
    image: "/games/delta-force-garena.jpg",
    description: "Token Top Up",
    denominations: [
      { amount: "60 Token", price: 15000, label: "60 🎯", comingSoon: true },
      { amount: "300 Token", price: 69000, label: "300 🎯", comingSoon: true },
      { amount: "980 Token", price: 219000, label: "980 🎯", comingSoon: true },
    ],
  },
  {
    name: "Delta Force Steam",
    slug: "delta-force-steam",
    developer: "Team Jade",
    image: "/games/delta-force-steam.jpg",
    description: "Token Top Up",
    denominations: [
      { amount: "60 Token", price: 15000, label: "60 🎯", comingSoon: true },
      { amount: "300 Token", price: 69000, label: "300 🎯", comingSoon: true },
      { amount: "980 Token", price: 219000, label: "980 🎯", comingSoon: true },
    ],
  },
  {
    name: "Stumble Guys",
    slug: "stumble-guys",
    developer: "Kitka Games",
    image: "/games/stumble-guys.jpg",
    description: "Gems Top Up",
    denominations: [
      { amount: "250 Gems", price: 15000, label: "250 💎", comingSoon: true },
      { amount: "1250 Gems", price: 69000, label: "1250 💎", comingSoon: true },
      { amount: "2500 Gems", price: 135000, label: "2500 💎", comingSoon: true },
    ],
  },
  {
    name: "Clash of Clans",
    slug: "clash-of-clans",
    developer: "Supercell",
    image: "/games/clash-of-clans.jpg",
    idLabel: "Player Tag",
    idPlaceholder: "#XXXXXXXX",
    description: "Gems Top Up",
    denominations: [
      { amount: "80 Gems", price: 16000, label: "80 💎", comingSoon: true },
      { amount: "500 Gems", price: 79000, label: "500 💎", comingSoon: true },
      { amount: "1200 Gems", price: 159000, label: "1200 💎", comingSoon: true },
      { amount: "2500 Gems", price: 319000, label: "2500 💎", comingSoon: true },
    ],
  },
  {
    name: "Apex Legends Mobile",
    slug: "apex-legends-mobile",
    developer: "EA",
    image: "/games/apex-legends-mobile.jpg",
    description: "Coins Top Up",
    denominations: [
      { amount: "150 Coins", price: 25000, label: "150 🪙", comingSoon: true },
      { amount: "600 Coins", price: 89000, label: "600 🪙", comingSoon: true },
      { amount: "1200 Coins", price: 169000, label: "1200 🪙", comingSoon: true },
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
