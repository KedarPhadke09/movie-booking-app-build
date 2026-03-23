export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number; // in minutes
  rating: string;
  posterUrl: string;
  bannerUrl: string;
  isReleased: boolean;
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screenName: string;
  time: string;
  date: string;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  seats: string[];
  totalPrice: number;
  bookingTime: string;
}

export interface LockedSeat {
  showId: string;
  seat: string;
  lockedAt: number;
  userId: string;
}
