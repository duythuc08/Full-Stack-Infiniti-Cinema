"use client";

import { Play, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl">
        <ImageWithFallback
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Always-on gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2 leading-tight">
            {movie.title}
          </h3>
          <p className="text-white/70 text-xs mb-2 line-clamp-2">{movie.synopsis}</p>

          <div className="flex items-center gap-2 mb-3">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white/60 text-xs">•</span>
            <span className="text-white/60 text-xs">{movie.durationText}</span>
          </div>

          <div className="flex gap-2 relative z-10">
            <div className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 shadow-lg">
              <Play className="w-3 h-3 fill-current" />
              <span className="text-xs font-semibold">Đặt Vé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
