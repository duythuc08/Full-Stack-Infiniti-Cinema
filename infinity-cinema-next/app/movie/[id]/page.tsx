"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Play, Share2 } from "lucide-react";
import { Showtimes } from "@/components/MovieShowTime";
import { saveBookingState } from "@/utils/bookingStorage";
import {
  fetchMovieBanner,
  fetchMovieDetail,
  fetchShowtimeDates,
  fetchShowtimesByDate,
} from "@/libs/service/movie.service";
import type { MovieDetail, ShowtimeDate, ShowtimeData } from "@/types";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [bannerUrl, setBannerUrl] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [availableDates, setAvailableDates] = useState<ShowtimeDate[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [currentShowtimes, setCurrentShowtimes] = useState<ShowtimeData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const trailerRef = useRef<HTMLDivElement>(null);

  // Fetch banner
  useEffect(() => {
    fetchMovieBanner(id).then(setBannerUrl).catch((err) => console.error("Error fetching banner:", err));
  }, [id]);

  // Fetch movie detail
  useEffect(() => {
    fetchMovieDetail(id)
      .then((movieDetail) => {
        setMovie(movieDetail);
        setTrailerUrl(movieDetail.trailerUrl);
      })
      .catch((err) => console.error("Error fetching movie:", err));
  }, [id]);

  // Fetch available showtime dates (6 ngày từ hôm nay, không cần movieId)
  useEffect(() => {
    fetchShowtimeDates()
      .then((dates) => {
        setAvailableDates(dates);
        setSelectedDateIndex(0);
      })
      .catch((err) => console.error("Error finding start date:", err));
  }, []);

  // Fetch showtimes for selected date
  useEffect(() => {
    if (availableDates.length === 0 || !availableDates[selectedDateIndex]) return;

    const dateObj = availableDates[selectedDateIndex].date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    setCurrentShowtimes(null);
    fetchShowtimesByDate(
      id,
      `${dateString}T00:00:00`,
      `${dateString}T23:59:59`,
      availableDates[selectedDateIndex].label
    )
      .then(setCurrentShowtimes)
      .catch((err) => console.error("Error fetching showtimes by date:", err));
  // availableDates.length thay vì cả array để tránh re-run khi reference thay đổi nhưng data giống nhau
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateIndex, availableDates.length, id]);

  const handleWatchTrailer = () => {
    if (trailerRef.current) {
      trailerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (movie) {
      const urlWithAutoplay = movie.trailerUrl.includes("?")
        ? movie.trailerUrl + "&autoplay=1"
        : movie.trailerUrl + "?autoplay=1";
      setTrailerUrl(urlWithAutoplay);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen">
        <div className="w-full h-[500px] lg:h-[600px] bg-muted animate-pulse" />
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1920px] mx-auto flex gap-6">
          <div className="hidden sm:block w-48 sm:w-56 lg:w-72 flex-none">
            <div className="aspect-[2/3] bg-muted animate-pulse rounded-xl" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-10 w-2/3 bg-muted animate-pulse rounded-xl" />
            <div className="h-5 w-1/3 bg-muted animate-pulse rounded-xl" />
            <div className="h-24 w-full bg-muted animate-pulse rounded-xl" />
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-muted animate-pulse rounded-xl" />
              <div className="h-10 w-24 bg-muted animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner + Movie Info */}
      <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bannerUrl || movie.poster}
            className="w-full h-full object-cover object-[center_20%]"
            alt={movie.title}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-[1920px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
            {/* Poster */}
            <div className="hidden sm:block flex-none w-48 sm:w-56 lg:w-72">
              <img
                src={movie.poster}
                className="w-full rounded-lg shadow-2xl border border-white/10"
                alt={movie.title}
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 font-bold drop-shadow-lg">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-sm sm:text-base text-white/90">
                <span>{movie.releaseDate}</span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <span>{movie.ageRating}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-xs sm:text-sm bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="mb-4 sm:mb-6">
                <p
                  className={`text-sm sm:text-base lg:text-lg text-white/90 transition-all duration-300 ${
                    !isExpanded ? "line-clamp-2" : ""
                  }`}
                >
                  {movie.synopsis}
                </p>
                {movie.synopsis && movie.synopsis.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-blue-400 font-semibold text-sm hover:underline focus:outline-none cursor-pointer"
                  >
                    {isExpanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <button
                  className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-primary hover:bg-primary/90 hover:-translate-y-0.5 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-primary/30"
                  onClick={handleWatchTrailer}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> Xem trailer
                </button>
                <button className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white/15 hover:bg-white/25 hover:-translate-y-0.5 text-white rounded-xl font-semibold transition-all duration-200 border border-white/30 backdrop-blur-sm">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" /> Share
                </button>
              </div>

              <div className="text-white/90 text-xs sm:text-sm lg:text-base space-y-2">
                <p className="font-semibold">Đạo diễn</p>
                <div className="flex flex-wrap gap-2">
                  {movie.directors && movie.directors.length > 0 ? (
                    movie.directors.map((director) => (
                      <span
                        key={director.id || director.name}
                        className="px-3 py-1 text-xs sm:text-sm bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                      >
                        {director.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/60">Đang cập nhật</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 py-3 max-w-[1920px] mx-auto border-b border-border/10">
          <h2 className="text-2xl font-bold mb-8 text-left">Diễn viên</h2>
          <div className="flex justify-start overflow-x-auto gap-6 pb-4">
            {movie.cast.map((actor) => (
              <div
                key={actor.id || actor.name}
                className="flex flex-col items-center text-center gap-3 group flex-none w-32 sm:w-36"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-800 border-2 border-transparent group-hover:border-primary transition-all overflow-hidden flex items-center justify-center">
                  {actor.avatarUrl ? (
                    <img src={actor.avatarUrl} alt={actor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-semibold text-white/50">
                      {actor.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <span className="text-sm font-medium block truncate">{actor.name}</span>
                  <span className="text-xs text-muted-foreground">Diễn viên</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trailer */}
      <div ref={trailerRef} className="px-4 sm:px-6 lg:px-8 py-12 max-w-[1920px] mx-auto">
        <div className="max-w-5xl mx-auto">
          <h2 className="mb-6 text-2xl font-bold">Trailer</h2>
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={trailerUrl}
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Showtimes */}
      <Showtimes
        data={currentShowtimes}
        days={availableDates}
        selectedDate={selectedDateIndex}
        onSelectDate={(i) => setSelectedDateIndex(i)}
        onSelect={(bookingInfo) => {
          saveBookingState({
            movie: movie.title,
            movieDuration: movie.duration,
            moviePoster: movie.poster,
            ...bookingInfo,
          });
          router.push(`/seat-selection/${movie.id}`);
        }}
      />
    </div>
  );
}
