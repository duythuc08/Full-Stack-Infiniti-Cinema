// ─── Movie ───────────────────────────────────────────────
export interface Movie {
  id: number;
  title: string;
  synopsis: string;
  duration: number;
  durationText: string;
  poster: string;
  trailer: string;
  releaseDate: string;
  cast: string[];
  director: string | null;
  language: string;
  subTitle: string;
  genres: string[];
  genreDescriptions: string[];
  ageRating: string;
  status: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  synopsis: string;
  duration: string;
  releaseDate: string;
  poster: string;
  trailerUrl: string;
  directors: { id?: number; name: string }[];
  cast: { id?: number; name: string; avatarUrl?: string }[];
  genres: string[];
  language: string;
  subTitle: string;
  ageRating: string;
  status: string;
}

// ─── Banner ───────────────────────────────────────────────
export interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  linkUrl: string;
  priority: number;
  active: boolean;
  bannerType: string;
  movie: { id: number; title: string; description: string } | null;
  event: { id: number; title: string; description: string } | null;
}

// ─── Showtime ─────────────────────────────────────────────
export interface ShowtimeDate {
  date: Date;
  label: string;
}

export interface ShowtimeEntry {
  id: number;
  time: string;
  roomName: string;
}

export interface CinemaShowtime {
  name: string;
  location: string;
  times: ShowtimeEntry[];
}

export interface ShowtimeData {
  date: string;
  cinemas: CinemaShowtime[];
}

// ─── Booking ──────────────────────────────────────────────
export interface SeatDetail {
  seatId: number;
  seatRow: string;
  seatNumber: number;
  seatType: string;
  price: number;
  seatShowTimeId?: number;
  partnerId?: number;
  seatShowTimeStatus?: string;
}

export interface FoodDetail {
  id: number;
  foodId: number;
  name: string;
  desc?: string;
  price: number;
  img?: string;
  qty: number;
  totalPrice: number;
  isCombo?: boolean;
}

export interface BookingState {
  movie?: string;
  movieDuration?: string;
  moviePoster?: string;
  cinema?: string;
  location?: string;
  time?: string;
  showTimeId?: number;
  date?: string;
  roomName?: string;
  seats?: SeatDetail[];
  seatTotal?: number;
  foods?: FoodDetail[];
  foodTotal?: number;
  total?: number;
  promotionCode?: string;
  orderId?: string;
}

// ─── Food ─────────────────────────────────────────────────
export interface FoodProduct {
  id: number;
  name: string;
  desc: string;
  price: number;
  img: string;
  stock: number;
  isCombo: boolean;
}

// ─── Seat ─────────────────────────────────────────────────
export interface SeatShowTime {
  seatId: number;
  seatRow: string;
  seatNumber: number;
  seatType: string;
  seatShowTimeStatus: string;
  seatShowTimeId?: number;
  partnerId?: number;
}

// ─── Order ────────────────────────────────────────────────
export interface Order {
  orderId: string;
  orderStatus: string;
  bookingTime: string;
  totalTicketPrice: number;
  totalFoodPrice: number;
  discountAmount: number;
  finalPrice: number;
  qrCode?: string;
  tickets?: { seatName: string; seatType: string; price: number }[];
  foods?: { name: string; quantity: number; totalPrice: number }[];
  fullName?: string;
}

// ─── User ─────────────────────────────────────────────────
export interface UserInfo {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  birthday: string;
  membetShipTierName: string;
  memberShipTierName: string;
  loyaltyPoints: number;
}

export interface MembershipTier {
  name: string;
  pointsRequired: number;
  discountPercent: number;
  birthdayDiscount: number;
}
