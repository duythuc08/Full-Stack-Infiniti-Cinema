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
export interface OrderTicket {
  orderTicketId: number;
  seatName: string;
  seatType: string;
  price: number;
  roomName: string | null;
  movieName: string | null;
  showTime: string | null;
}

export interface OrderFood {
  foodId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  orderId: number;
  userId: string | null;
  fullName: string;
  orderStatus: string;
  bookingTime: string;
  expiredTime: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  totalTicketPrice: number;
  totalFoodPrice: number;
  discountAmount: number;
  memberDiscountAmount: number | null;
  finalPrice: number;
  promotionCode: string | null;
  qrCode: string | null;
  pointsEarned: number;
  tickets: OrderTicket[];
  foods: OrderFood[];
  // Trích xuất từ vé đầu tiên (populated by @AfterMapping)
  movieTitle: string | null;
  cinemaName: string | null;
  cinemaAddress: string | null;
  showTime: string | null;
  roomName: string | null;
}

// ─── User ─────────────────────────────────────────────────
export interface UserInfo {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  birthday: string | null;
  memberShipTierName: string;
  loyaltyPoints: number;
}

export interface MembershipTier {
  name: string;
  pointsRequired: number;
  discountPercent: number;
  birthdayDiscount: number;
}
