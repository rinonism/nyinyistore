import Link from "next/link";
import Image from "next/image";

interface GameCardProps {
  name: string;
  slug: string;
  image: string;
  description: string;
}

export default function GameCard({ name, slug, image, description }: GameCardProps) {
  return (
    <Link href={`/topup/${slug}`}>
      <div className="game-card group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 transition-all hover:border-indigo-500/50">
        {/* Game Image - Portrait 3:4 ratio like ourastore */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
          {/* Game name overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">{name}</h3>
            <p className="mt-0.5 text-xs text-slate-300 drop-shadow">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
