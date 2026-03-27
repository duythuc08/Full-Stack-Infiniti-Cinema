/**
 * Client-side movie API functions (dùng trong Client Components với useEffect).
 * Phân biệt với serverApi.ts dùng trong Server Components.
 */
import type { Movie, MovieDetail, PagedMovieResult, ShowtimeDate, ShowtimeData } from "@/types";

const BASE_URL = "/api-proxy";

// ─── Pagination (client-side — dùng khi carousel chuyển trang) ──────────────

// Phải khớp với URL path của backend: /movies/showing, /movies/comingSoon, /movies/imax
type MovieStatusKey = "showing" | "comingSoon" | "imax";

function mapMovieFromRaw(m: Record<string, unknown>): Movie {
  return {
    id: m.movieId as number,
    title: m.title as string,
    synopsis: m.description as string,
    duration: m.duration as number,
    durationText: `${m.duration} phút`,
    poster: m.posterUrl as string,
    trailer: m.trailerUrl as string,
    releaseDate: m.releaseDate as string,
    cast: ((m.castPersons as Array<{ name: string }>) ?? []).map((p) => p.name),
    director:
      ((m.directors as Array<{ name: string }>) ?? []).length > 0
        ? (m.directors as Array<{ name: string }>)[0].name
        : null,
    language: m.language as string,
    subTitle: m.subTitle as string,
    genres: ((m.genre as Array<{ name: string }>) ?? []).map((g) => g.name),
    genreDescriptions: ((m.genre as Array<{ description: string }>) ?? []).map((g) => g.description),
    ageRating: m.ageRating as string,
    status: m.movieStatus as string,
  };
}

export async function fetchMoviesPaged(
  status: MovieStatusKey,
  page: number,
  size = 4
): Promise<PagedMovieResult> {
  const res = await fetch(`${BASE_URL}/movies/${status}/paged?page=${page}&size=${size}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[fetchMoviesPaged] HTTP ${res.status} — status=${status} page=${page}`, body);
    throw new Error(`Lỗi tải danh sách phim (${res.status})`);
  }
  const data = await res.json();
  const r = data.result as Record<string, unknown>;
  return {
    movies: ((r.content ?? []) as Record<string, unknown>[]).map(mapMovieFromRaw),
    currentPage: r.currentPage as number,
    pageSize: r.pageSize as number,
    totalPages: r.totalPages as number,
    totalElements: r.totalElements as number,
  };
}

export async function fetchMovieBanner(movieId: string): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/banners/getBannerByMovieId/${movieId}`);
    const data = await res.json();
    if (data.code === 0 && data.result) return data.result.imageUrl as string;
    return "";
  } catch {
    return "";
  }
}

export async function fetchMovieDetail(movieId: string): Promise<MovieDetail> {
  const res = await fetch(`${BASE_URL}/movies/${movieId}`);
  const data = await res.json();
  if (data.code !== 0) throw new Error("Movie not found");

  const m = data.result as Record<string, unknown>;
  const trailerUrl = typeof m.trailerUrl === "string"
    ? m.trailerUrl.replace("watch?v=", "embed/")
    : "";

  return {
    id: m.movieId as number,
    title: m.title as string,
    synopsis: m.description as string,
    duration: `${Math.floor((m.duration as number) / 60)}h ${(m.duration as number) % 60}min`,
    releaseDate: m.releaseDate as string,
    poster: m.posterUrl as string,
    trailerUrl,
    directors: (m.directors as Array<{ id?: number; name: string }>) || [],
    cast: (m.castPersons as Array<{ id?: number; name: string; avatarUrl?: string }>) || [],
    genres: ((m.genre as Array<{ name: string }>) ?? []).map((g) => g.name),
    language: m.language as string,
    subTitle: m.subTitle as string,
    ageRating: m.ageRating as string,
    status: m.movieStatus as string,
  };
}

const WEEKDAY_LABELS = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

/**
 * Sinh 6 ngày liên tiếp từ hôm nay.
 * Ngày đầu: "Hôm nay (DD/MM)" — các ngày tiếp: "Thứ X (DD/MM)".
 * Không gọi API — hoàn toàn client-side.
 */
export async function fetchShowtimeDates(): Promise<ShowtimeDate[]> {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const label =
      i === 0
        ? `Hôm nay (${dd}/${mm})`
        : `${WEEKDAY_LABELS[date.getDay()]} (${dd}/${mm})`;
    return { date, label };
  });
}

export async function fetchShowtimesByDate(
  movieId: string,
  start: string,
  end: string,
  dateLabel: string
): Promise<ShowtimeData> {
  try {
    const res = await fetch(
      `${BASE_URL}/showtimes/getShowTimes/by-movie-time/${movieId}?start=${start}&end=${end}`
    );
    const data = await res.json();

    if (data.code !== 0) return { date: dateLabel, cinemas: [] };

    const grouped: Record<string, { name: string; location: string; times: { id: number; time: string; roomName: string }[] }> = {};

    (data.result as Record<string, unknown>[]).forEach((show) => {
      const rooms = show.rooms as Record<string, unknown>;
      if (
        rooms.roomStatus !== "ACTIVE" ||
        show.showTimeStatus === "CLOSED" ||
        show.showTimeStatus === "MAINTENANCE"
      ) return;

      const cinema = rooms.cinemas as Record<string, unknown>;
      const cinemaKey = cinema.cinemaId as string;
      const timeString = new Date(show.startTime as string).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      if (!grouped[cinemaKey]) {
        grouped[cinemaKey] = {
          name: cinema.name as string,
          location: cinema.address as string,
          times: [],
        };
      }

      grouped[cinemaKey].times.push({
        id: show.showTimeId as number,
        time: timeString,
        roomName: rooms.name as string,
      });
    });

    Object.values(grouped).forEach((c) =>
      c.times.sort((a, b) => a.time.localeCompare(b.time))
    );

    return { date: dateLabel, cinemas: Object.values(grouped) };
  } catch {
    return { date: dateLabel, cinemas: [] };
  }
}
