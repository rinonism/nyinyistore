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
      <div className="game-card overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] transition-all">
        {/* Game Image - Portrait 3:4 ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          {/* Game name */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="text-sm font-bold text-white leading-tight">{name}</h3>
            <p className="mt-0.5 text-[11px] text-[#b0b0b0]">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
