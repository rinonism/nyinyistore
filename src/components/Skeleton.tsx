export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#252525]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#252525] rounded w-3/4" />
        <div className="h-2 bg-[#252525] rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return (
    <div className="w-full aspect-[2/1] sm:aspect-[3/1] lg:aspect-[3.5/1] rounded-xl bg-[#1e1e1e] animate-pulse" />
  );
}

export function SkeletonText({ width = "w-full" }: { width?: string }) {
  return <div className={`h-3 bg-[#252525] rounded ${width} animate-pulse`} />;
}

export function SkeletonTopupPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-3 sm:px-4 py-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-[#252525]" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-[#252525] rounded w-48" />
          <div className="h-3 bg-[#252525] rounded w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-10 bg-[#252525] rounded-xl" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-[#252525] rounded-lg" />
            ))}
          </div>
        </div>
        <div className="h-64 bg-[#252525] rounded-xl" />
      </div>
    </div>
  );
}
