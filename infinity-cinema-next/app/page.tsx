import { HomeBannerCarousel } from "@/components/HomeBannerCarousel";
import { MovieCarousel } from "@/components/MovieCarousel";
import { QuickBookingBar } from "@/components/QuickBookingBar";
import {
  getBanners,
  getShowingMoviesPaged,
  getComingSoonMoviesPaged,
  getImaxMoviesPaged,
} from "@/libs/service/serverApi";

export default async function HomePage() {
  const [banners, showing, comingSoon, imax] = await Promise.all([
    getBanners(),
    getShowingMoviesPaged(0, 4),
    getComingSoonMoviesPaged(0, 4),
    getImaxMoviesPaged(0, 4),
  ]);

  return (
    <div className="min-h-screen">
      {/* Banner Carousel */}
      <HomeBannerCarousel banners={banners} />

      {/* Thanh đặt vé nhanh — tự load phim NOW_SHOWING phía client */}
      <QuickBookingBar />

      {/* Carousels phim — server-side pagination */}
      <div className="py-8 sm:py-12">
        <MovieCarousel
          title="Phim đang chiếu"
          movieStatus="showing"
          initialMovies={showing.movies}
          initialTotalPages={showing.totalPages}
          initialTotalElements={showing.totalElements}
        />
        <MovieCarousel
          title="Phim sắp chiếu"
          movieStatus="comingSoon"
          initialMovies={comingSoon.movies}
          initialTotalPages={comingSoon.totalPages}
          initialTotalElements={comingSoon.totalElements}
        />
        <MovieCarousel
          title="Phim IMAX"
          movieStatus="imax"
          initialMovies={imax.movies}
          initialTotalPages={imax.totalPages}
          initialTotalElements={imax.totalElements}
        />
      </div>
    </div>
  );
}
