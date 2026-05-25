export default function UlasanPage() {
  // Mock reviews - will be replaced with real data later
  const reviews = [
    { id: 1, name: "Rizky A.", game: "Mobile Legends", rating: 5, comment: "Proses cepat banget, ga sampe 5 detik diamond udah masuk. Recommended!", date: "25 Mei 2026" },
    { id: 2, name: "Andika P.", game: "Free Fire", rating: 5, comment: "Harga murah, proses instan. Langganan di sini terus.", date: "24 Mei 2026" },
    { id: 3, name: "Fahri M.", game: "PUBG Mobile", rating: 5, comment: "UC langsung masuk, CS nya juga fast response. Top!", date: "24 Mei 2026" },
    { id: 4, name: "Dewi S.", game: "Genshin Impact", rating: 4, comment: "Crystal masuk cepat, cuma kadang agak lama pas jam sibuk.", date: "23 Mei 2026" },
    { id: 5, name: "Bagusp.", game: "Valorant", rating: 5, comment: "VP langsung masuk, harga paling murah dibanding toko lain.", date: "23 Mei 2026" },
    { id: 6, name: "Yusuf R.", game: "Mobile Legends", rating: 5, comment: "Udah berkali-kali top up di sini, ga pernah mengecewakan.", date: "22 Mei 2026" },
    { id: 7, name: "Adi W.", game: "ROBLOX", rating: 5, comment: "Robux langsung masuk, anak saya seneng banget. Makasih!", date: "22 Mei 2026" },
    { id: 8, name: "Putri N.", game: "Honkai Star Rail", rating: 5, comment: "Oneiric shard masuk cepat, harga bersaing. Mantap!", date: "21 Mei 2026" },
    { id: 9, name: "Rendi K.", game: "Free Fire", rating: 4, comment: "Overall bagus, proses cepat. Semoga ada promo lebih sering.", date: "21 Mei 2026" },
    { id: 10, name: "Alfian D.", game: "Mobile Legends", rating: 5, comment: "Diamond masuk instan, CS ramah. 10/10!", date: "20 Mei 2026" },
  ];

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);
  const totalReviews = reviews.length;

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-xl font-bold text-white mb-2">⭐ Ulasan & Rating</h1>
      <p className="text-xs text-[#777] mb-6">
        Lihat apa kata pelanggan kami tentang NyinyiStore.
      </p>

      {/* Rating Summary */}
      <div className="mb-6 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5 flex items-center gap-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{avgRating}</p>
          <div className="flex text-[#e8b730] mt-1">
            {"★★★★★".split("").map((s, i) => (
              <span key={i} className="text-lg">{s}</span>
            ))}
          </div>
          <p className="text-[10px] text-[#777] mt-1">Berdasarkan {totalReviews} ulasan</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = (count / totalReviews) * 100;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] text-[#777] w-3">{star}</span>
                <span className="text-[10px] text-[#e8b730]">★</span>
                <div className="flex-1 h-2 rounded-full bg-[#252525] overflow-hidden">
                  <div className="h-full rounded-full bg-[#c8a45c]" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-[#777] w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c8a45c]/20 text-xs font-bold text-[#c8a45c]">
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{review.name}</p>
                  <p className="text-[10px] text-[#777]">{review.game}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex text-[#e8b730]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, i) => (
                    <span key={i} className="text-xs text-[#3a3a3a]">★</span>
                  ))}
                </div>
                <p className="text-[10px] text-[#777] mt-0.5">{review.date}</p>
              </div>
            </div>
            <p className="text-xs text-[#b0b0b0]">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
