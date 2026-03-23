"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import type { Movie } from "@/types";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
}

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    setTimeout(() => checkArrows(), 300);
  };

  const checkArrows = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
    );
  };

  return (
    <div className="mb-8 sm:mb-12 group/carousel">
      <h2 className="mb-4 px-4 sm:px-6 lg:px-8">{title}</h2>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="cursor-pointer absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkArrows}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 scroll-smooth"
        >
          {movies.map((movie, index) => (
            <div key={movie.id || index} className="flex-none w-36 sm:w-44 md:w-52">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="cursor-pointer absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
