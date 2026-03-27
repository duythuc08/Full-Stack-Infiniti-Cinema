"use client";

import { useState, useCallback } from "react";
import type { Movie, PagedMovieResult } from "@/types";
import { fetchMoviesPaged } from "@/libs/service/movie.service";

// Phải khớp với URL path của backend: /movies/showing, /movies/comingSoon, /movies/imax
type MovieStatusKey = "showing" | "comingSoon" | "imax";

interface UseMovieCarouselOptions {
  movieStatus: MovieStatusKey;
  initialMovies: Movie[];
  initialTotalPages: number;
  initialTotalElements: number;
  pageSize?: number;
}

export function useMovieCarousel({
  movieStatus,
  initialMovies,
  initialTotalPages,
  initialTotalElements,
  pageSize = 4,
}: UseMovieCarouselOptions) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalElements, setTotalElements] = useState(initialTotalElements);
  const [loading, setLoading] = useState(false);

  const goToPage = useCallback(
    async (page: number) => {
      if (loading) return;
      // Clamp page index
      const target = Math.max(0, Math.min(page, totalPages - 1));
      if (target === currentPage && movies.length > 0) return;

      setLoading(true);
      try {
        const result: PagedMovieResult = await fetchMoviesPaged(movieStatus, target, pageSize);
        setMovies(result.movies);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch (err) {
        console.error("[useMovieCarousel] goToPage failed:", err);
      } finally {
        setLoading(false);
      }
    },
    [movieStatus, pageSize, totalPages, currentPage, movies.length, loading]
  );

  return {
    movies,
    currentPage,
    totalPages,
    totalElements,
    loading,
    canPrev: currentPage > 0 && !loading,
    canNext: currentPage < totalPages - 1 && !loading,
    goToPage,
    prevPage: () => goToPage(currentPage - 1),
    nextPage: () => goToPage(currentPage + 1),
  };
}
