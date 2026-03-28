"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieCarousel } from "@/hooks/use-movie-carousel";
import type { Movie } from "@/types";

type MovieStatusKey = "showing" | "comingSoon" | "imax";

interface MovieCarouselProps {
  title: string;
  movieStatus: MovieStatusKey;
  initialMovies: Movie[];
  initialTotalPages: number;
  initialTotalElements: number;
}

/**
 * Carousel với server-side pagination:
 *  - Desktop (lg): 4 phim/trang trong grid 4 cột
 *  - Mobile: 2 cột (2×2 grid)
 *  - Prev/Next gọi API → fetch đúng trang từ Backend
 *  - Skeleton loading khi đang fetch
 *  - Dot indicators bên dưới
 */
export function MovieCarousel({
  title,
  movieStatus,
  initialMovies,
  initialTotalPages,
  initialTotalElements,
}: MovieCarouselProps) {
  const {
    movies,
    currentPage,
    totalPages,
    loading,
    canPrev,
    canNext,
    prevPage,
    nextPage,
    goToPage,
  } = useMovieCarousel({
    movieStatus,
    initialMovies,
    initialTotalPages,
    initialTotalElements,
  });

  return (
    <div className="mb-10 sm:mb-14">
      {/* ── Section header ─────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
        </div>

        {totalPages > 1 && (
          <span className="hidden sm:inline text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            Trang {currentPage + 1}/{totalPages}
          </span>
        )}
      </div>

      {/* ── Cards grid with side Prev/Next buttons ────────── */}
      <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-4">
        {/* Prev button */}
        <button
          onClick={prevPage}
          disabled={!canPrev || totalPages <= 1}
          aria-label="Trang trước"
          className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-background
            flex items-center justify-center
            transition-all duration-200
            hover:bg-muted hover:scale-105
            disabled:opacity-20 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>

        {/* Cards */}
        <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[2/3]">
                  <Skeleton className="w-full h-full rounded-xl" />
                </div>
              ))
            : movies.map((movie, i) => (
                <div key={movie.id || i}>
                  <MovieCard movie={movie} />
                </div>
              ))}
        </div>
        </div>

        {/* Next button */}
        <button
          onClick={nextPage}
          disabled={!canNext || totalPages <= 1}
          aria-label="Trang tiếp"
          className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-background
            flex items-center justify-center
            transition-all duration-200
            hover:bg-muted hover:scale-105
            disabled:opacity-20 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* ── Dot indicators ──────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-label={`Trang ${i + 1}`}
              disabled={loading}
              className={`rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                i === currentPage
                  ? "bg-primary w-6 h-2"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60 w-2 h-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
