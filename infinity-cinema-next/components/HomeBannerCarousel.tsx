"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Info, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Banner } from "@/types";

interface HomeBannerCarouselProps {
  banners: Banner[];
}

export function HomeBannerCarousel({ banners }: HomeBannerCarouselProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="relative h-[75vh] lg:h-[85vh] px-[50px]">
      <div className="relative h-full w-full overflow-hidden">
        {/* Ảnh banner */}
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover transition-opacity duration-700"
          loading="lazy"
        />
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />

        {/* Nội dung */}
        <div className="absolute inset-0 flex items-end px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto pb-[50px] pl-[40px]">
          <div className="max-w-2xl py-16 text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
              {banner.movie ? banner.movie.title : banner.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 line-clamp-3">
              {banner.movie ? banner.movie.description : banner.description}
            </p>

            {banner.movie && (
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => router.push(`/movie/${banner.movie!.id}`)}
                  size="lg"
                  className="gap-2 cursor-pointer bg-primary hover:bg-primary/90"
                >
                  <Play className="w-5 h-5" />
                  Đặt Vé Ngay
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-white/10 border-white/30 hover:bg-white/20 cursor-pointer"
                  onClick={() => router.push(`/movie/${banner.movie!.id}`)}
                >
                  <Info className="w-5 h-5" />
                  Chi tiết
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Chỉ số pagination */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === current ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
