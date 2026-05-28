export default function TopupLoading() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 animate-pulse">
      {/* Game header skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-[#2a2a2a]" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-[#2a2a2a]" />
          <div className="h-3 w-24 rounded bg-[#222]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Items grid */}
        <div className="lg:col-span-2">
          <div className="h-4 w-32 rounded bg-[#2a2a2a] mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4 space-y-2">
                <div className="h-3 w-20 rounded bg-[#2a2a2a]" />
                <div className="h-4 w-16 rounded bg-[#333]" />
              </div>
            ))}
          </div>
        </div>

        {/* Right - Order form */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5 space-y-4">
            <div className="h-4 w-28 rounded bg-[#2a2a2a]" />
            <div className="h-10 w-full rounded-lg bg-[#222]" />
            <div className="h-10 w-full rounded-lg bg-[#222]" />
            <div className="h-4 w-36 rounded bg-[#2a2a2a]" />
            <div className="h-10 w-full rounded-lg bg-[#222]" />
            <div className="h-12 w-full rounded-xl bg-[#333]" />
          </div>
        </div>
      </div>
    </div>
  );
}
