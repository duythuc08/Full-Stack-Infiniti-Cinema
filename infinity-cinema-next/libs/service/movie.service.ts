/**
 * Client-side movie API functions (dùng trong Client Components với useEffect).
 * Phân biệt với serverApi.ts dùng trong Server Components.
 */
import type { MovieDetail, ShowtimeDate, ShowtimeData } from "@/types";

const BASE_URL = "/api-proxy";

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

export async function fetchShowtimeDates(movieId: string): Promise<ShowtimeDate[]> {
  try {
    const res = await fetch(`${BASE_URL}/showtimes/getShowTimes/by-movie/${movieId}`);
    const data = await res.json();
    if (data.code !== 0 || !data.result || data.result.length === 0) return [];

    const sorted = (data.result as Array<{ startTime: string }>).sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    const firstDate = new Date(sorted[0].startTime);

    return Array.from({ length: 3 }, (_, i) => {
      const date = new Date(firstDate);
      date.setDate(firstDate.getDate() + i);
      const weekday = date.toLocaleDateString("vi-VN", { weekday: "short" });
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return { date, label: `${weekday}, ${day}/${month}` };
    });
  } catch {
    return [];
  }
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
