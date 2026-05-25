import Link from "next/link";

interface GameCardProps {
  name: string;
  slug: string;
  image: string;
  description: string;
}

export default function GameCard({ name, slug, image, description }: GameCardProps) {
  return (
    <Link href={`/topup/${slug}`}>
      <div className="game-card flex items-center gap-3 rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-3 transition-all hover:border-[#c8a45c40]">
        {/* Square game icon */}
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-[#3a3a3a]">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        {/* Name + Developer */}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{name}</h3>
          <p className="text-[11px] text-[#777] truncate">{description}</p>
        </div>
      </div>
    </Link>
  );
}
