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

export const games: Game[] = [{
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
  },{
    name: "Mobile Legends Paket Irit",
    slug: "mobile-legends-paket-irit",
    developer: "Moonton",
    image: "/games/mobile-legends-paket-irit.jpg",
    description: "Paket Irit Diamond",
    denominations: [
      { amount: "86 Diamonds", price: 18000, label: "86 💎" },
      { amount: "172 Diamonds", price: 36000, label: "172 💎" },
      { amount: "257 Diamonds", price: 54000, label: "257 💎" },
    ],
  },{
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
      { amount: "1450 Diamonds", price: 279000, label: "1450 💎" },
    ],
  },{
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
  },{
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    developer: "Tencent Games",
    image: "/games/pubg-mobile.png",
    description: "UC Top Up",
    denominations: [
      { amount: "60 UC", price: 15000, label: "60 UC" },
      { amount: "325 UC", price: 75000, label: "325 UC" },
      { amount: "660 UC", price: 149000, label: "660 UC" },
      { amount: "1800 UC", price: 379000, label: "1800 UC" },
    ],
  },{
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
      { amount: "2400 VP", price: 249000, label: "2400 VP" },
    ],
  },{
    name: "Genshin Impact",
    slug: "genshin-impact",
    developer: "HoYoverse",
    image: "/games/genshin-impact.jpg",
    description: "Genesis Crystal Top Up",
    denominations: [
      { amount: "60 Crystals", price: 16000, label: "60 💠" },
      { amount: "330 Crystals", price: 79000, label: "330 💠" },
      { amount: "1090 Crystals", price: 249000, label: "1090 💠" },
      { amount: "2240 Crystals", price: 479000, label: "2240 💠" },
      { amount: "3880 Crystals", price: 799000, label: "3880 💠" },
    ],
  },{
    name: "Honkai Star Rail",
    slug: "honkai-star-rail",
    developer: "HoYoverse",
    image: "/games/honkai-star-rail.jpg",
    description: "Oneiric Shard Top Up",
    denominations: [
      { amount: "60 Shards", price: 16000, label: "60 ✨" },
      { amount: "330 Shards", price: 79000, label: "330 ✨" },
      { amount: "1090 Shards", price: 249000, label: "1090 ✨" },
      { amount: "2240 Shards", price: 479000, label: "2240 ✨" },
      { amount: "3880 Shards", price: 799000, label: "3880 ✨" },
    ],
  },{
    name: "ROBLOX",
    slug: "roblox",
    developer: "Roblox Corporation",
    image: "/games/roblox.jpg",
    description: "Robux Top Up",
    denominations: [
      { amount: "80 Robux", price: 15000, label: "80 R$" },
      { amount: "200 Robux", price: 35000, label: "200 R$" },
      { amount: "400 Robux", price: 69000, label: "400 R$" },
      { amount: "800 Robux", price: 135000, label: "800 R$" },
      { amount: "1700 Robux", price: 269000, label: "1700 R$" },
    ],
  },{
    name: "Mobile Legends Global",
    slug: "mobile-legends-global",
    developer: "Moonton",
    image: "/games/mobile-legends-global.jpg",
    description: "Diamond Global Server",
    denominations: [
      { amount: "86 Diamonds", price: 20000, label: "86 💎" },
      { amount: "172 Diamonds", price: 40000, label: "172 💎" },
      { amount: "257 Diamonds", price: 60000, label: "257 💎" },
    ],
  },{
    name: "Magic Chess Go Go",
    slug: "magic-chess-go-go",
    developer: "Vizta Games",
    image: "/games/magic-chess-go-go.jpg",
    description: "Diamond Top Up",
    denominations: [
      { amount: "86 Diamonds", price: 19000, label: "86 💎" },
      { amount: "172 Diamonds", price: 38000, label: "172 💎" },
    ],
  },{
    name: "Blood Strike",
    slug: "blood-strike",
    developer: "Wizard Games",
    image: "/games/blood-strike.jpg",
    description: "Gold Top Up",
    denominations: [
      { amount: "60 Gold", price: 15000, label: "60 🪙" },
      { amount: "325 Gold", price: 75000, label: "325 🪙" },
      { amount: "660 Gold", price: 149000, label: "660 🪙" },
    ],
  },{
    name: "Call of Duty Mobile",
    slug: "call-of-duty-mobile",
    developer: "Garena",
    image: "/games/call-of-duty-mobile.jpg",
    description: "CP Top Up",
    denominations: [
      { amount: "80 CP", price: 15000, label: "80 CP" },
      { amount: "400 CP", price: 69000, label: "400 CP" },
      { amount: "880 CP", price: 149000, label: "880 CP" },
      { amount: "2400 CP", price: 379000, label: "2400 CP" },
    ],
  },{
    name: "Delta Force Garena",
    slug: "delta-force-garena",
    developer: "Garena",
    image: "/games/delta-force-garena.jpg",
    description: "Token Top Up",
    denominations: [
      { amount: "60 Token", price: 15000, label: "60 🎯" },
      { amount: "325 Token", price: 75000, label: "325 🎯" },
      { amount: "660 Token", price: 149000, label: "660 🎯" },
    ],
  },{
    name: "Delta Force Steam",
    slug: "delta-force-steam",
    developer: "Team Jade",
    image: "/games/delta-force-steam.jpg",
    description: "Token Top Up",
    denominations: [
      { amount: "60 Token", price: 15000, label: "60 🎯" },
      { amount: "325 Token", price: 75000, label: "325 🎯" },
    ],
  },{
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
  },{
    name: "Arena of Valor",
    slug: "arena-of-valor",
    developer: "Garena",
    image: "/games/arena-of-valor.jpg",
    description: "Voucher Top Up",
    denominations: [
      { amount: "90 Voucher", price: 15000, label: "90 🎫" },
      { amount: "230 Voucher", price: 35000, label: "230 🎫" },
      { amount: "470 Voucher", price: 69000, label: "470 🎫" },
      { amount: "950 Voucher", price: 135000, label: "950 🎫" },
    ],
  },{
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
  },{
    name: "Clash Royale",
    slug: "clash-royale",
    developer: "Supercell",
    image: "/games/clash-royale.jpg",
    description: "Gems Top Up",
    denominations: [
      { amount: "80 Gems", price: 16000, label: "80 💎" },
      { amount: "500 Gems", price: 79000, label: "500 💎" },
      { amount: "1200 Gems", price: 159000, label: "1200 💎" },
    ],
  },{
    name: "Honor of Kings",
    slug: "honor-of-kings",
    developer: "TiMi Studio",
    image: "/games/honor-of-kings.jpg",
    description: "Token Top Up",
    denominations: [
      { amount: "60 Token", price: 15000, label: "60 🪙" },
      { amount: "325 Token", price: 75000, label: "325 🪙" },
      { amount: "660 Token", price: 149000, label: "660 🪙" },
    ],
  },{
    name: "Zenless Zone Zero",
    slug: "zenless-zone-zero",
    developer: "HoYoverse",
    image: "/games/zenless-zone-zero.jpg",
    description: "Polychrome Top Up",
    denominations: [
      { amount: "60 Polychrome", price: 16000, label: "60 🔮" },
      { amount: "330 Polychrome", price: 79000, label: "330 🔮" },
      { amount: "1090 Polychrome", price: 249000, label: "1090 🔮" },
      { amount: "2240 Polychrome", price: 479000, label: "2240 🔮" },
    ],
  },{
    name: "Super Sus",
    slug: "super-sus",
    developer: "PI Studio",
    image: "/games/super-sus.jpg",
    description: "Golden Star Top Up",
    denominations: [
      { amount: "60 Stars", price: 15000, label: "60 ⭐" },
      { amount: "300 Stars", price: 69000, label: "300 ⭐" },
      { amount: "680 Stars", price: 149000, label: "680 ⭐" },
    ],
  },{
    name: "Tower of Fantasy",
    slug: "tower-of-fantasy",
    developer: "Level Infinite",
    image: "/games/tower-of-fantasy.jpg",
    description: "Tanium Top Up",
    denominations: [
      { amount: "60 Tanium", price: 16000, label: "60 💠" },
      { amount: "330 Tanium", price: 79000, label: "330 💠" },
      { amount: "1090 Tanium", price: 249000, label: "1090 💠" },
    ],
  },{
    name: "Ragnarok M",
    slug: "ragnarok-m",
    developer: "Gravity",
    image: "/games/ragnarok-m.jpg",
    description: "BCC Top Up",
    denominations: [
      { amount: "75 BCC", price: 15000, label: "75 BCC" },
      { amount: "370 BCC", price: 69000, label: "370 BCC" },
      { amount: "750 BCC", price: 135000, label: "750 BCC" },
    ],
  },{
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
  },{
    name: "League of Legends Wild Rift",
    slug: "league-of-legends-wild-rift",
    developer: "Riot Games",
    image: "/games/league-of-legends-wild-rift.jpg",
    description: "Wild Cores Top Up",
    denominations: [
      { amount: "125 Cores", price: 15000, label: "125 🔮" },
      { amount: "420 Cores", price: 49000, label: "420 🔮" },
      { amount: "700 Cores", price: 79000, label: "700 🔮" },
      { amount: "1375 Cores", price: 149000, label: "1375 🔮" },
    ],
  },{
    name: "Minecraft",
    slug: "minecraft",
    developer: "Mojang",
    image: "/games/minecraft.jpg",
    description: "Minecoins Top Up",
    denominations: [
      { amount: "320 Minecoins", price: 25000, label: "320 🪙" },
      { amount: "700 Minecoins", price: 49000, label: "700 🪙" },
      { amount: "1720 Minecoins", price: 109000, label: "1720 🪙" },
    ],
  },{
    name: "Point Blank",
    slug: "point-blank",
    developer: "Zepetto",
    image: "/games/point-blank.jpg",
    description: "Cash Top Up",
    denominations: [
      { amount: "1200 Cash", price: 15000, label: "1200 💰" },
      { amount: "6000 Cash", price: 69000, label: "6000 💰" },
      { amount: "12000 Cash", price: 135000, label: "12000 💰" },
    ],
  },{
    name: "Undawn",
    slug: "undawn",
    developer: "Garena",
    image: "/games/undawn.jpg",
    description: "RC Top Up",
    denominations: [
      { amount: "60 RC", price: 16000, label: "60 🪙" },
      { amount: "325 RC", price: 79000, label: "325 🪙" },
      { amount: "660 RC", price: 149000, label: "660 🪙" },
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
