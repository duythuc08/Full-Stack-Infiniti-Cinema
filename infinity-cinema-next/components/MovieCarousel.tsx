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
    <div className="mb-10 sm:mb-14 group/carousel">
      {/* Section title with gradient text */}
      <div className="px-4 sm:px-6 lg:px-8 mb-5 flex items-center gap-3">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
          {title}
        </h2>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="cursor-pointer absolute left-0 top-0 bottom-0 z-10 w-14 bg-gradient-to-r from-black/70 to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          >
            <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg">
              <ChevronLeft className="w-5 h-5 text-white" />
            </div>
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkArrows}
          className="flex gap-2.5 sm:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 scroll-smooth pb-2"
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
            className="cursor-pointer absolute right-0 top-0 bottom-0 z-10 w-14 bg-gradient-to-l from-black/70 to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          >
            <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
