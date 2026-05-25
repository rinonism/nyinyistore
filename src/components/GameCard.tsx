import Link from "next/link";

interface GameCardProps {
  name: string;
  slug: string;
  image: string;
  developer: string;
}

export default function GameCard({ name, slug, image, developer }: GameCardProps) {
  return (
    <Link href={`/topup/${slug}`}>
      <div className="game-card flex items-center gap-3 rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-3 transition-all hover:border-[#c8a45c40] active:scale-[0.98]">
        {/* Square game icon */}
        <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-xl border border-[#3a3a3a]">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        {/* Name + Developer */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white truncate">{name}</h3>
          <p className="text-[11px] text-[#777] truncate">{developer}</p>
        </div>
      </div>
    </Link>
  );
}
