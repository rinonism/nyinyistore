"use client";

export default function KebijakanPrivasi() {
  return (
    <div className="mx-auto max-w-[700px] px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Kebijakan Privasi</h1>
      <div className="space-y-4 text-sm text-[#ccc] leading-relaxed">
        <p className="text-[10px] text-[#888]">Terakhir diperbarui: 28 Mei 2026</p>

        <h2 className="text-base font-semibold text-white mt-6">1. Informasi yang Kami Kumpulkan</h2>
        <p>NyinyiStore mengumpulkan informasi berikut saat Anda melakukan transaksi:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>User ID dan Server ID game</li>
          <li>Nomor telepon (opsional, untuk konfirmasi order)</li>
          <li>Alamat email (opsional)</li>
          <li>Alamat wallet crypto (untuk pembayaran)</li>
          <li>Data transaksi (item, nominal, waktu)</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">2. Penggunaan Informasi</h2>
        <p>Informasi yang dikumpulkan digunakan untuk:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Memproses dan mengirimkan pesanan Anda</li>
          <li>Memverifikasi pembayaran</li>
          <li>Menghubungi Anda terkait status pesanan</li>
          <li>Meningkatkan layanan kami</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">3. Perlindungan Data</h2>
        <p>Kami berkomitmen melindungi data pribadi Anda. Langkah-langkah keamanan yang kami terapkan:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Enkripsi data saat transmisi (SSL/TLS)</li>
          <li>Penyimpanan data di server yang aman</li>
          <li>Akses data dibatasi hanya untuk keperluan operasional</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">4. Pembagian Data kepada Pihak Ketiga</h2>
        <p>Kami tidak menjual atau membagikan data pribadi Anda kepada pihak ketiga, kecuali:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Penyedia layanan pembayaran (untuk memproses transaksi)</li>
          <li>Penyedia layanan game (untuk pengiriman item)</li>
          <li>Jika diwajibkan oleh hukum yang berlaku</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">5. Penyimpanan Data</h2>
        <p>Data transaksi disimpan selama diperlukan untuk keperluan operasional dan kepatuhan hukum. Anda dapat meminta penghapusan data dengan menghubungi kami.</p>

        <h2 className="text-base font-semibold text-white mt-6">6. Hak Pengguna</h2>
        <p>Anda berhak untuk:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Mengakses data pribadi yang kami simpan</li>
          <li>Meminta koreksi data yang tidak akurat</li>
          <li>Meminta penghapusan data pribadi</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">7. Kontak</h2>
        <p>Jika ada pertanyaan mengenai kebijakan privasi ini, hubungi kami melalui:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Email: support@nyinyistore.com</li>
          <li>Telegram: @NyinyiStore_bot</li>
        </ul>
      </div>
    </div>
  );
}
