import Link from "next/link";
import Image from "next/image";

interface GameCardProps {
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
}

export default function GameCard({ name, slug, image, description }: GameCardProps) {
  return (
    <Link href={`/topup/${slug}`}>
      <div className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-6 transition-all duration-300 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-3 h-16 w-16 overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
