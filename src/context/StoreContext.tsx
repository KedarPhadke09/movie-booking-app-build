import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Movie, Theatre, Show, Booking, LockedSeat } from '../types';

interface StoreContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];

  // Movies
  movies: Movie[];
  addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
  updateMovie: (id: string, movie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;

  // Theatres & Shows
  theatres: Theatre[];
  shows: Show[];
  addShow: (show: Omit<Show, 'id'>) => Promise<void>;

  // Bookings & Seats
  bookings: Booking[];
  lockedSeats: LockedSeat[];
  bookSeats: (showId: string, seats: string[], pricePerSeat: number) => Promise<Booking>;
  lockSeat: (showId: string, seat: string) => Promise<boolean>;
  unlockSeat: (showId: string, seat: string) => Promise<void>;
  getBookedSeatsForShow: (showId: string) => string[];
  
  // App UI state
  loading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

// Seed Data
const defaultMovies: Movie[] = [
  { id: 'm1', title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', genre: ['Sci-Fi', 'Action'], duration: 148, rating: 'UA', posterUrl: 'https://images.unsplash.com/photo-1536440136628-81981e7eaaea?auto=format&fit=crop&q=80&w=400', bannerUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f4e921c4?auto=format&fit=crop&q=80&w=1200', isReleased: true },
  { id: 'm2', title: 'Dune: Part Two', description: 'Paul Atreides unites with the Fremen people while seeking revenge against the conspirators who destroyed his family.', genre: ['Sci-Fi', 'Adventure'], duration: 166, rating: 'UA', posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=400', bannerUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200', isReleased: true },
  { id: 'm3', title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', genre: ['Sci-Fi', 'Drama'], duration: 169, rating: 'U', posterUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=400', bannerUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=1200', isReleased: true },
];

const defaultTheatres: Theatre[] = [
  { id: 't1', name: 'PVR: Icon Cinemas', location: 'Mumbai' },
  { id: 't2', name: 'INOX: Megaplex', location: 'Delhi' },
];

const defaultShows: Show[] = [
  { id: 's1', movieId: 'm1', theatreId: 't1', screenName: 'Audi 1', time: '10:00 AM', date: '2026-06-15', price: 250 },
  { id: 's2', movieId: 'm1', theatreId: 't1', screenName: 'Audi 2', time: '02:00 PM', date: '2026-06-15', price: 300 },
  { id: 's3', movieId: 'm2', theatreId: 't2', screenName: 'Audi 1', time: '06:00 PM', date: '2026-06-15', price: 350 },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cinema_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cinema_users');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'u_admin', name: 'Admin', email: 'admin@test.com', role: 'admin' },
      { id: 'u_user', name: 'User', email: 'user@test.com', role: 'user' }
    ];
  });

  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinema_movies');
    return saved ? JSON.parse(saved) : defaultMovies;
  });

  const [theatres] = useState<Theatre[]>(defaultTheatres);

  const [shows, setShows] = useState<Show[]>(() => {
    const saved = localStorage.getItem('cinema_shows');
    return saved ? JSON.parse(saved) : defaultShows;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cinema_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [lockedSeats, setLockedSeats] = useState<LockedSeat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cinema_users', JSON.stringify(users));
    localStorage.setItem('cinema_movies', JSON.stringify(movies));
    localStorage.setItem('cinema_shows', JSON.stringify(shows));
    localStorage.setItem('cinema_bookings', JSON.stringify(bookings));
  }, [users, movies, shows, bookings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cinema_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cinema_user');
    }
  }, [currentUser]);

  // Cleanup expired locks
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLockedSeats((current) => current.filter((lock) => now - lock.lockedAt < 120000)); // 2 minutes hold
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    await new Promise((res) => setTimeout(res, 500));
    
    // In real app, verify hashed password from DB
    const foundUser = users.find((u) => u.email === email);
    
    if (!foundUser) {
      setError('User not found');
      setLoading(false);
      return false;
    }
    
    // Mock passwords match
    if (password !== 'password' && password !== 'admin123') {
      setError('Invalid password');
      setLoading(false);
      return false;
    }

    setCurrentUser(foundUser);
    setLoading(false);
    return true;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    await new Promise((res) => setTimeout(res, 500));
    console.log("Mock registration for email:", email, "with password length:", password.length);

    if (users.some((u) => u.email === email)) {
      setError('User already exists with this email');
      setLoading(false);
      return false;
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      role: 'user',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addMovie = async (movieData: Omit<Movie, 'id'>) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    const newMovie = { ...movieData, id: `m_${Date.now()}` };
    setMovies((prev) => [...prev, newMovie]);
    setLoading(false);
  };

  const updateMovie = async (id: string, movieData: Partial<Movie>) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...movieData } : m)));
    setLoading(false);
  };

  const deleteMovie = async (id: string) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setMovies((prev) => prev.filter((m) => m.id !== id));
    setLoading(false);
  };

  const addShow = async (showData: Omit<Show, 'id'>) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    const newShow = { ...showData, id: `s_${Date.now()}` };
    setShows((prev) => [...prev, newShow]);
    setLoading(false);
  };

  const getBookedSeatsForShow = (showId: string): string[] => {
    return bookings
      .filter((b) => b.showId === showId)
      .flatMap((b) => b.seats);
  };

  const lockSeat = async (showId: string, seat: string): Promise<boolean> => {
    if (!currentUser) return false;

    // 1. Check if already booked
    const bookedSeats = getBookedSeatsForShow(showId);
    if (bookedSeats.includes(seat)) return false;

    // 2. Check if already locked by someone else
    const now = Date.now();
    const isLockedByOthers = lockedSeats.some(
      (lock) => lock.showId === showId && lock.seat === seat && lock.userId !== currentUser.id && (now - lock.lockedAt < 120000)
    );

    if (isLockedByOthers) return false;

    // 3. Lock it
    setLockedSeats((prev) => [
      ...prev.filter((l) => !(l.showId === showId && l.seat === seat)),
      { showId, seat, lockedAt: Date.now(), userId: currentUser.id }
    ]);

    return true;
  };

  const unlockSeat = async (showId: string, seat: string) => {
    if (!currentUser) return;
    setLockedSeats((prev) => prev.filter((lock) => !(lock.showId === showId && lock.seat === seat && lock.userId === currentUser.id)));
  };

  const bookSeats = async (showId: string, seats: string[], pricePerSeat: number): Promise<Booking> => {
    setLoading(true);
    setError(null);
    await new Promise((res) => setTimeout(res, 1000)); // Simulate payment/network

    if (!currentUser) {
      setLoading(false);
      throw new Error('Unauthorized');
    }

    // Server-side / Verification logic: Prevent double booking
    const bookedSeats = getBookedSeatsForShow(showId);
    const overlappingSeats = seats.filter((seat) => bookedSeats.includes(seat));

    if (overlappingSeats.length > 0) {
      setLoading(false);
      setError(`Double Booking Error: Seat(s) ${overlappingSeats.join(', ')} were already booked by someone else!`);
      throw new Error(`Seats ${overlappingSeats.join(', ')} already booked`);
    }

    const newBooking: Booking = {
      id: `b_${Date.now()}`,
      userId: currentUser.id,
      showId,
      seats,
      totalPrice: seats.length * pricePerSeat,
      bookingTime: new Date().toISOString(),
    };

    setBookings((prev) => [...prev, newBooking]);
    // Clear locks for these seats
    setLockedSeats((prev) => prev.filter((lock) => !(lock.showId === showId && seats.includes(lock.seat))));
    setLoading(false);
    return newBooking;
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser, login, signup, logout, users,
        movies, addMovie, updateMovie, deleteMovie,
        theatres, shows, addShow,
        bookings, lockedSeats, bookSeats, lockSeat, unlockSeat, getBookedSeatsForShow,
        loading, error, setError,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
