"use client";

import { useState } from "react";
import { Play, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      className="relative group cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      <div className="relative aspect-[2/3] rounded overflow-hidden">
        <ImageWithFallback
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {isHovered && (
          <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4 transition-opacity duration-300">
            <h3 className="mb-2">{movie.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{movie.synopsis}</p>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              </div>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{movie.durationText}</span>
            </div>

            <div className="flex gap-2 relative z-10">
              <div className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded cursor-pointer transition-colors hover:bg-red-600 hover:text-white">
                <Play className="w-4 h-4" />
                <span className="text-sm">Đặt Vé</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
