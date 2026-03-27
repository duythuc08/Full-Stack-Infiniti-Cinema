import type { Cinema, Movie, QuickBookingSlot } from "@/types";

const BASE = "/api-proxy";

async function safeFetch(url: string, label: string): Promise<Response> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "(empty body)");
    console.error(`[QuickBooking] ${label} failed — HTTP ${res.status} ${res.statusText}\nURL: ${url}\nBody: ${body}`);
    throw new Error(`HTTP ${res.status}: ${label}`);
  }
  return res;
}

// Bước 1 (Movie-first): tải phim NOW_SHOWING/IMAX còn suất chiếu chưa qua
// Dùng endpoint riêng để tự động loại phim hết suất trong ngày khỏi dropdown
export async function fetchNowShowingMovies(): Promise<Movie[]> {
  const res = await safeFetch(`${BASE}/showtimes/now-showing-movies`, "fetchNowShowingMovies");
  const data = await res.json();
  return ((data.result ?? []) as Record<string, unknown>[]).map(mapMovie);
}

// Bước 2 (Movie-first): tải rạp đang có suất chiếu cho phim đã chọn
export async function fetchCinemasByMovieId(movieId: number): Promise<Cinema[]> {
  const res = await safeFetch(
    `${BASE}/showtimes/cinemas-by-movie/${movieId}`,
    `fetchCinemasByMovieId(${movieId})`
  );
  const data = await res.json();
  return ((data.result ?? []) as Record<string, unknown>[]).map((c) => ({
    id: c.cinemaId as number,
    name: c.name as string,
    address: c.address as string,
  }));
}

export async function fetchCinemasClient(): Promise<Cinema[]> {
  const res = await safeFetch(`${BASE}/cinemas/getCinemas`, "fetchCinemas");
  const data = await res.json();
  return ((data.result ?? []) as Record<string, unknown>[]).map((c) => ({
    id: c.cinemaId as number,
    name: c.name as string,
    address: c.address as string,
  }));
}

export async function fetchMoviesByCinemaId(cinemaId: number): Promise<Movie[]> {
  const res = await safeFetch(
    `${BASE}/showtimes/movies-by-cinema/${cinemaId}`,
    `fetchMoviesByCinemaId(${cinemaId})`
  );
  const data = await res.json();
  return ((data.result ?? []) as Record<string, unknown>[]).map(mapMovie);
}

export async function fetchDatesByCinemaAndMovie(
  cinemaId: number,
  movieId: number
): Promise<string[]> {
  const res = await safeFetch(
    `${BASE}/showtimes/dates?cinemaId=${cinemaId}&movieId=${movieId}`,
    `fetchDates(cinema=${cinemaId}, movie=${movieId})`
  );
  const data = await res.json();
  return (data.result ?? []) as string[];
}

export async function fetchSlotsByCinemaMovieDate(
  cinemaId: number,
  movieId: number,
  date: string
): Promise<QuickBookingSlot[]> {
  const res = await safeFetch(
    `${BASE}/showtimes/slots?cinemaId=${cinemaId}&movieId=${movieId}&date=${date}`,
    `fetchSlots(cinema=${cinemaId}, movie=${movieId}, date=${date})`
  );
  const data = await res.json();
  return ((data.result ?? []) as Record<string, unknown>[]).map((s) => ({
    showTimeId: s.showTimeId as number,
    startTime: s.startTime as string,
    roomName: s.roomName as string,
    roomType: s.roomType as string,
  }));
}

function mapMovie(m: Record<string, unknown>): Movie {
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
    genreDescriptions: ((m.genre as Array<{ description: string }>) ?? []).map(
      (g) => g.description
    ),
    ageRating: m.ageRating as string,
    status: m.movieStatus as string,
  };
}
