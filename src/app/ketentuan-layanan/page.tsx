"use client";

export default function KetentuanLayanan() {
  return (
    <div className="mx-auto max-w-[700px] px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Ketentuan Layanan</h1>
      <div className="space-y-4 text-sm text-[#ccc] leading-relaxed">
        <p className="text-[10px] text-[#888]">Terakhir diperbarui: 28 Mei 2026</p>

        <h2 className="text-base font-semibold text-white mt-6">1. Ketentuan Umum</h2>
        <p>Dengan menggunakan layanan NyinyiStore, Anda menyetujui ketentuan layanan ini. NyinyiStore adalah platform top-up game online yang menyediakan layanan pembelian item digital seperti diamond, voucher, dan mata uang dalam game.</p>

        <h2 className="text-base font-semibold text-white mt-6">2. Layanan</h2>
        <p>NyinyiStore menyediakan layanan:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Top-up diamond dan item game (Mobile Legends, Free Fire, Genshin Impact, dll)</li>
          <li>Pembayaran melalui cryptocurrency (USDT, USDC) dan metode pembayaran lokal</li>
          <li>Pengiriman otomatis setelah pembayaran terverifikasi</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">3. Proses Pemesanan</h2>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Pilih game dan item yang diinginkan</li>
          <li>Masukkan User ID dan Server ID yang benar</li>
          <li>Pilih metode pembayaran dan selesaikan pembayaran</li>
          <li>Item akan dikirim otomatis setelah pembayaran dikonfirmasi</li>
          <li>Waktu pembayaran maksimal 30 menit setelah order dibuat</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">4. Pembayaran</h2>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Pembayaran crypto harus dikirim dengan nominal yang tepat sesuai yang tertera</li>
          <li>Pastikan mengirim token dan network yang benar</li>
          <li>Pembayaran yang salah nominal, token, atau network tidak dapat dikembalikan</li>
          <li>Order yang tidak dibayar dalam 30 menit akan otomatis expired</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">5. Kebijakan Pengembalian Dana</h2>
        <p>Pengembalian dana (refund) dapat dilakukan dalam kondisi berikut:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Item gagal dikirim karena kesalahan sistem kami</li>
          <li>Pembayaran berhasil tetapi order tidak diproses</li>
        </ul>
        <p>Refund tidak berlaku untuk:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Kesalahan input User ID atau Server ID oleh pembeli</li>
          <li>Pengiriman token/network yang salah</li>
          <li>Item yang sudah berhasil dikirim dan diterima</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">6. Tanggung Jawab Pengguna</h2>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Memastikan User ID dan Server ID yang dimasukkan benar</li>
          <li>Mengirim pembayaran dengan nominal, token, dan network yang tepat</li>
          <li>Tidak menggunakan layanan untuk aktivitas ilegal</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">7. Batasan Tanggung Jawab</h2>
        <p>NyinyiStore tidak bertanggung jawab atas:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Kerugian akibat kesalahan input data oleh pengguna</li>
          <li>Gangguan layanan dari pihak ketiga (game publisher, blockchain network)</li>
          <li>Perubahan harga yang dilakukan oleh penyedia layanan game</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">8. Perubahan Ketentuan</h2>
        <p>NyinyiStore berhak mengubah ketentuan layanan ini sewaktu-waktu. Perubahan akan berlaku efektif setelah dipublikasikan di halaman ini.</p>

        <h2 className="text-base font-semibold text-white mt-6">9. Kontak</h2>
        <p>Untuk pertanyaan atau keluhan, hubungi kami melalui:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Email: support@nyinyistore.com</li>
          <li>Telegram: @NyinyiStore_bot</li>
        </ul>
      </div>
    </div>
  );
}
