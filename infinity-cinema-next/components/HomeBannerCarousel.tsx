"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Info, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types";

interface HomeBannerCarouselProps {
  banners: Banner[];
}

export function HomeBannerCarousel({ banners }: HomeBannerCarouselProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, banners.length, paused]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div
      className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[88vh] overflow-hidden group/banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
        loading="eager"
      />

      {/* Cinema dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-black/15" />

      {/* ── Prev Button ─────────────────────────────────── */}
      {banners.length > 1 && (
        <button
          onClick={prev}
          aria-label="Banner trước"
          className="cursor-pointer absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 sm:w-13 sm:h-13 rounded-full
            bg-black/40 backdrop-blur-sm border border-white/25
            flex items-center justify-center
            opacity-0 group-hover/banner:opacity-100
            transition-all duration-200
            hover:bg-black/65 hover:scale-105 hover:border-white/50"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* ── Next Button ─────────────────────────────────── */}
      {banners.length > 1 && (
        <button
          onClick={next}
          aria-label="Banner tiếp theo"
          className="cursor-pointer absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 sm:w-13 sm:h-13 rounded-full
            bg-black/40 backdrop-blur-sm border border-white/25
            flex items-center justify-center
            opacity-0 group-hover/banner:opacity-100
            transition-all duration-200
            hover:bg-black/65 hover:scale-105 hover:border-white/50"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 pb-16 sm:pb-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl leading-tight mb-3">
              {banner.movie ? banner.movie.title : banner.title}
            </h1>

            <p className="text-sm sm:text-base text-white/75 mb-6 line-clamp-2 max-w-lg leading-relaxed drop-shadow-md">
              {banner.movie ? banner.movie.description : banner.description}
            </p>

            {banner.movie && (
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => router.push(`/movie/${banner.movie!.id}`)}
                  size="lg"
                  className="gap-2 cursor-pointer bg-primary hover:bg-primary/90 shadow-xl shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 font-bold"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Đặt Vé Ngay
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-white/10 border-white/30 hover:bg-white/20 cursor-pointer text-white hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                  onClick={() => router.push(`/movie/${banner.movie!.id}`)}
                >
                  <Info className="w-5 h-5" />
                  Chi tiết
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Pagination dots + counter ────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Banner ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? "bg-primary w-7 h-2"
                : "bg-white/40 hover:bg-white/70 w-2 h-2"
            }`}
          />
        ))}
      </div>

      {/* Slide counter top-right */}
      {banners.length > 1 && (
        <div className="absolute top-4 right-4 sm:right-6 z-10 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 border border-white/15">
          <span className="text-white text-xs font-bold">{current + 1}</span>
          <span className="text-white/50 text-xs">/</span>
          <span className="text-white/70 text-xs">{banners.length}</span>
        </div>
      )}
    </div>
  );
}
