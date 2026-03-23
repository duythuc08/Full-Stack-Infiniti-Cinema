import { HomeBannerCarousel } from "@/components/HomeBannerCarousel";
import { MovieCarousel } from "@/components/MovieCarousel";
import { getBanners, getShowingMovies, getComingSoonMovies, getImaxMovies } from "@/libs/service/serverApi";

export default async function HomePage() {
  const [banners, showing, comingSoon, imax] = await Promise.all([
    getBanners(),
    getShowingMovies(),
    getComingSoonMovies(),
    getImaxMovies(),
  ]);

  return (
    <div className="min-h-screen pt-5">
      {/* Banner Carousel */}
      <HomeBannerCarousel banners={banners} />

      {/* Carousels phim */}
      <div className="py-8 sm:py-12">
        <MovieCarousel title="Phim đang chiếu" movies={showing} />
        <MovieCarousel title="Phim sắp chiếu" movies={comingSoon} />
        <MovieCarousel title="Phim IMAX" movies={imax} />
      </div>
    </div>
  );
}
