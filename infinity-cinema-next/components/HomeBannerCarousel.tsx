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
    /* Full-width hero – không có px padding, không có rounded góc để đạt Netflix style */
    <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[88vh] overflow-hidden">
      {/* Background image – object-cover + object-center đảm bảo không bị méo */}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
        loading="eager"
      />

      {/* === Cinema dark overlays – LUÔN TỐI bất kể theme sáng/tối === */}
      {/* Gradient từ dưới lên: text zone luôn dark */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      {/* Gradient từ trái sang: tạo chiều sâu cho text bên trái */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      {/* Lớp tối nhẹ phủ toàn bộ giúp đồng đều */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Content – text nằm ở góc dưới bên trái, luôn rõ nét trên nền tối */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 pb-16 sm:pb-20">
          <div className="max-w-2xl">
            {/*/!* Badge thể loại *!/*/}
            {/*{banner.movie && (*/}
            {/*  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/25 border border-primary/50 backdrop-blur-sm">*/}
            {/*    <span className="text-primary text-xs font-bold uppercase tracking-wider">Đang chiếu</span>*/}
            {/*  </div>*/}
            {/*)}*/}

            {/* Tiêu đề phim – text-white vì nền luôn tối (overlay cinema) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl leading-tight mb-3">
              {banner.movie ? banner.movie.title : banner.title}
            </h1>

            {/* Mô tả phim */}
            <p className="text-sm sm:text-base text-white/75 mb-6 line-clamp-2 max-w-lg leading-relaxed drop-shadow-md">
              {banner.movie ? banner.movie.description : banner.description}
            </p>

            {/* Nút CTA */}
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

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 items-center">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? "bg-primary w-7 h-2" : "bg-white/40 hover:bg-white/70 w-2 h-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
