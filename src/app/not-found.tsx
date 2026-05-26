import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-sm text-[#b0b0b0] mb-6">
          Halaman yang kamu cari tidak ditemukan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-gold text-sm px-6 py-3"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
