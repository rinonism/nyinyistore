"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Terjadi Kesalahan</h1>
        <p className="text-sm text-[#b0b0b0] mb-6 max-w-md">
          Maaf, terjadi kesalahan saat memuat halaman. Silahkan coba lagi atau hubungi customer service kami.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-gold text-sm px-6 py-3"
          >
            Coba Lagi
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#1e1e1e] px-6 py-3 text-sm text-[#b0b0b0] hover:text-white hover:border-[#555] transition-colors"
          >
            Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
