/**
 * Server-side API functions (dùng trong Server Components / Route Handlers).
 * Không dùng localStorage, cookies hoặc window.
 */

const API_BASE = "http://localhost:8080/duythuc";

// ─── Helper ───────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  const data = await res.json();
  return data;
}

// ─── Movies ───────────────────────────────────────────────
export async function getShowingMovies() {
  const data = await apiFetch<{ result: unknown[] }>("/movies/showing");
  return (data.result ?? []).map(mapMovie);
}

export async function getComingSoonMovies() {
  const data = await apiFetch<{ result: unknown[] }>("/movies/comingSoon");
  return (data.result ?? []).map(mapMovie);
}

export async function getImaxMovies() {
  const data = await apiFetch<{ result: unknown[] }>("/movies/imax");
  return (data.result ?? []).map(mapMovie);
}

export async function getMovieById(id: string) {
  const data = await apiFetch<{ code: number; result: Record<string, unknown> }>(`/movies/${id}`);
  if (data.code !== 0) throw new Error("Movie not found");
  const m = data.result;
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

// ─── Banners ──────────────────────────────────────────────
export async function getBanners() {
  const data = await apiFetch<{ result: unknown[] }>("/banners/getBanners");
  return (data.result ?? []).map(mapBanner);
}

export async function getBannerByMovieId(movieId: string) {
  try {
    const data = await apiFetch<{ code: number; result: { imageUrl: string } }>(
      `/banners/getBannerByMovieId/${movieId}`
    );
    if (data.code === 0 && data.result) return data.result.imageUrl;
    return null;
  } catch {
    return null;
  }
}

// ─── Showtimes ────────────────────────────────────────────
export async function getShowtimeDatesByMovie(movieId: string) {
  try {
    const data = await apiFetch<{ code: number; result: Array<{ startTime: string }> }>(
      `/showtimes/getShowTimes/by-movie/${movieId}`
    );
    if (data.code !== 0 || !data.result || data.result.length === 0) return [];

    const sorted = data.result.sort(
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

// ─── Mappers ──────────────────────────────────────────────
function mapMovie(m: unknown) {
  const movie = m as Record<string, unknown>;
  return {
    id: movie.movieId as number,
    title: movie.title as string,
    synopsis: movie.description as string,
    duration: movie.duration as number,
    durationText: `${movie.duration} phút`,
    poster: movie.posterUrl as string,
    trailer: movie.trailerUrl as string,
    releaseDate: movie.releaseDate as string,
    cast: ((movie.castPersons as Array<{ name: string }>) ?? []).map((p) => p.name),
    director: ((movie.directors as Array<{ name: string }>) ?? []).length > 0
      ? (movie.directors as Array<{ name: string }>)[0].name
      : null,
    language: movie.language as string,
    subTitle: movie.subTitle as string,
    genres: ((movie.genre as Array<{ name: string }>) ?? []).map((g) => g.name),
    genreDescriptions: ((movie.genre as Array<{ description: string }>) ?? []).map((g) => g.description),
    ageRating: movie.ageRating as string,
    status: movie.movieStatus as string,
  };
}

function mapBanner(b: unknown) {
  const banner = b as Record<string, unknown>;
  const movies = banner.movies as Record<string, unknown> | null | undefined;
  const event = banner.event as Record<string, unknown> | null | undefined;
  return {
    id: banner.id as number,
    imageUrl: banner.imageUrl as string,
    title: banner.title as string,
    description: banner.description as string,
    linkUrl: banner.linkUrl as string,
    priority: banner.priority as number,
    active: banner.active as boolean,
    bannerType: banner.bannerType as string,
    movie: movies
      ? { id: movies.movieId as number, title: movies.title as string, description: movies.description as string }
      : null,
    event: event
      ? { id: event.id as number, title: event.title as string, description: event.description as string }
      : null,
  };
}
