// Game-specific reviews data
export interface Review {
  name: string;
  rating: number;
  date: string;
  comment: string;
  item: string;
}

const reviewsData: Record<string, Review[]> = {
  "mobile-legends": [
    { name: "Reza A.", rating: 5, date: "2 hari lalu", comment: "Diamond masuk cepat, harga paling murah dibanding toko lain. Recommended!", item: "172 Diamonds" },
    { name: "Dinda S.", rating: 5, date: "3 hari lalu", comment: "Udah 3x top up di sini, selalu lancar. Proses otomatis mantap.", item: "86 Diamonds" },
    { name: "Farhan M.", rating: 4, date: "5 hari lalu", comment: "Proses agak lama sekitar 4 menit tapi tetap masuk. Harga oke.", item: "344 Diamonds" },
    { name: "Aisyah R.", rating: 5, date: "1 minggu lalu", comment: "Top up buat push rank, diamond langsung masuk. Mantap!", item: "568 Diamonds" },
    { name: "Bagus P.", rating: 5, date: "1 minggu lalu", comment: "Bayar pake QRIS langsung proses. Gak ribet sama sekali.", item: "Weekly Diamond Pass" },
  ],
  "mobile-legends-paket-irit": [
    { name: "Rizky H.", rating: 5, date: "1 hari lalu", comment: "Paket irit emang paling worth it, harga di sini paling murah.", item: "Paket Irit 56 Diamonds" },
    { name: "Nadia F.", rating: 5, date: "4 hari lalu", comment: "Lancar jaya, diamond bonus langsung masuk semua.", item: "Paket Irit 172 Diamonds" },
    { name: "Andi W.", rating: 4, date: "6 hari lalu", comment: "Proses sekitar 3 menit, tapi hasilnya sesuai. Worth it.", item: "Paket Irit 344 Diamonds" },
  ],
  "free-fire": [
    { name: "Kevin L.", rating: 5, date: "1 hari lalu", comment: "Top up diamond FF cepat banget, langsung masuk ke akun.", item: "140 Diamonds" },
    { name: "Sinta D.", rating: 5, date: "3 hari lalu", comment: "Harga paling murah buat FF. Udah langganan di sini.", item: "355 Diamonds" },
    { name: "Wahyu S.", rating: 4, date: "5 hari lalu", comment: "Pertama kali top up di sini, agak ragu tapi ternyata beneran masuk. Trusted!", item: "720 Diamonds" },
    { name: "Mega P.", rating: 5, date: "1 minggu lalu", comment: "Beli membership bulanan, proses lancar. Harga bersaing.", item: "Member Mingguan" },
  ],
  "free-fire-max": [
    { name: "Dimas R.", rating: 5, date: "2 hari lalu", comment: "FF MAX diamond langsung masuk, sama aja kayak FF biasa tapi grafik lebih bagus.", item: "100 Diamonds" },
    { name: "Lina K.", rating: 5, date: "4 hari lalu", comment: "Top up buat beli bundle, cepet prosesnya.", item: "310 Diamonds" },
    { name: "Aji N.", rating: 4, date: "1 minggu lalu", comment: "Aman dan terpercaya. Harga juga murah dibanding kompetitor.", item: "520 Diamonds" },
  ],
  "genshin-impact": [
    { name: "Sakura M.", rating: 5, date: "1 hari lalu", comment: "Top up genesis crystal buat pull character, masuk cepat. Mantap!", item: "330 Genesis Crystals" },
    { name: "Raffi A.", rating: 5, date: "3 hari lalu", comment: "Welkin Moon beli di sini lebih murah dari official. Recommended.", item: "Blessing of the Welkin Moon" },
    { name: "Yuki T.", rating: 4, date: "5 hari lalu", comment: "Proses sekitar 5 menit, tapi crystal masuk sesuai jumlah.", item: "1980 Genesis Crystals" },
    { name: "Hana S.", rating: 5, date: "1 minggu lalu", comment: "Langganan beli Welkin tiap bulan di sini. Selalu lancar.", item: "Blessing of the Welkin Moon" },
  ],
  "honkai-star-rail": [
    { name: "Miko R.", rating: 5, date: "2 hari lalu", comment: "Oneiric Shard masuk cepat, bisa langsung pull. Top!", item: "330 Oneiric Shards" },
    { name: "Dani P.", rating: 5, date: "4 hari lalu", comment: "Express Pass beli di sini lebih hemat. Proses lancar.", item: "Express Supply Pass" },
    { name: "Luna W.", rating: 4, date: "1 minggu lalu", comment: "Pertama kali coba, ternyata beneran work. Bakal balik lagi.", item: "990 Oneiric Shards" },
  ],
  "valorant": [
    { name: "Alex G.", rating: 5, date: "1 hari lalu", comment: "VP masuk cepat, langsung bisa beli skin. Harga murah!", item: "475 VP" },
    { name: "Rio S.", rating: 5, date: "3 hari lalu", comment: "Top up buat beli Battle Pass, prosesnya gak sampe 5 menit.", item: "1000 VP" },
    { name: "Tara N.", rating: 4, date: "6 hari lalu", comment: "Harga lebih murah dari official store. Trusted.", item: "2050 VP" },
    { name: "Fajar D.", rating: 5, date: "1 minggu lalu", comment: "Udah 5x top up VP di sini, selalu lancar. Recommended banget.", item: "5350 VP" },
  ],
  "pubg-mobile": [
    { name: "Bima A.", rating: 5, date: "2 hari lalu", comment: "UC masuk langsung, bisa beli Royale Pass. Mantap!", item: "325 UC" },
    { name: "Indra K.", rating: 5, date: "4 hari lalu", comment: "Harga UC paling murah yang pernah gue temuin. Trusted.", item: "660 UC" },
    { name: "Putri L.", rating: 4, date: "1 minggu lalu", comment: "Proses agak lama tapi tetap masuk. Overall puas.", item: "1800 UC" },
  ],
  "stumble-guys": [
    { name: "Citra W.", rating: 5, date: "1 hari lalu", comment: "Gems masuk cepat, langsung bisa beli skin lucu.", item: "250 Gems" },
    { name: "Yoga P.", rating: 5, date: "3 hari lalu", comment: "Anak gue seneng banget, top up lancar.", item: "500 Gems" },
    { name: "Dewi S.", rating: 4, date: "5 hari lalu", comment: "Murah dan cepat, cocok buat game casual.", item: "1000 Gems" },
  ],
  "roblox": [
    { name: "Arya M.", rating: 5, date: "2 hari lalu", comment: "Robux masuk ke akun anak langsung. Aman dan murah.", item: "800 Robux" },
    { name: "Nisa F.", rating: 5, date: "5 hari lalu", comment: "Top up Robux buat anak, prosesnya gampang banget.", item: "400 Robux" },
    { name: "Bayu R.", rating: 4, date: "1 minggu lalu", comment: "Pertama kali coba, lancar. Harga lebih murah dari official.", item: "1700 Robux" },
  ],
};

// Default reviews for games not in the list
const defaultReviews: Review[] = [
  { name: "User N.", rating: 5, date: "3 hari lalu", comment: "Top up cepat dan murah. Recommended!", item: "Premium Item" },
  { name: "Gamer X.", rating: 5, date: "5 hari lalu", comment: "Proses lancar, item langsung masuk ke akun.", item: "In-Game Currency" },
  { name: "Player Y.", rating: 4, date: "1 minggu lalu", comment: "Harga bersaing, pelayanan oke.", item: "Game Voucher" },
];

export function getGameReviews(slug: string): Review[] {
  return reviewsData[slug] || defaultReviews;
}

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
