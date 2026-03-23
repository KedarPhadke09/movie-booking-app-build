import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Clock, Star, Calendar, MapPin, Ticket } from 'lucide-react';
import { Show, Theatre } from '../types';

interface MovieDetailsProps {
  params: { movieId: string };
  onNavigate: (page: string, params?: any) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ params, onNavigate }) => {
  const { movies, shows, theatres } = useStore();
  const [selectedDate, setSelectedDate] = useState('2026-06-15');

  const movie = movies.find((m) => m.id === params.movieId);
  if (!movie) return <div className="text-white text-center p-12">Movie not found!</div>;

  const movieShows = shows.filter((s) => s.movieId === params.movieId && s.date === selectedDate);

  // Group shows by theatre
  const theatreGroupedShows = movieShows.reduce((acc, show) => {
    const theatre = theatres.find((t) => t.id === show.theatreId);
    if (!theatre) return acc;

    if (!acc[theatre.id]) {
      acc[theatre.id] = { theatre, shows: [] };
    }
    acc[theatre.id].shows.push(show);
    return acc;
  }, {} as Record<string, { theatre: Theatre; shows: Show[] }>);

  const dates = ['2026-06-15', '2026-06-16', '2026-06-17'];

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      {/* Banner */}
      <div className="relative h-[45vh] flex items-center bg-cover bg-center" style={{ backgroundImage: `url('${movie.bannerUrl}')` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 w-full h-full flex items-end">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-8 w-full">
            <img src={movie.posterUrl} alt={movie.title} className="w-48 h-72 object-cover rounded-xl shadow-2xl border-2 border-slate-700 hidden md:block" />
            <div className="flex-1 pb-4">
              <span className="bg-red-600 text-xs px-2.5 py-1 rounded-md font-semibold tracking-wider mb-2 inline-block">TRENDING</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-slate-300 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock size={16} className="text-red-500" />
                  <span>{movie.duration} mins</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span>4.8 / 5</span>
                </div>
                <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-200">{movie.rating}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <span key={g} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* About */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">About the Movie</h2>
              <p className="text-slate-400 leading-relaxed">{movie.description}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-semibold mb-3 flex items-center space-x-2">
                <Ticket className="text-red-500" size={18} />
                <span>Offers Available</span>
              </h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Flat 20% off with CineCard</li>
                <li>• Buy 1 Get 1 on select credit cards</li>
              </ul>
            </div>
          </div>

          {/* Shows */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Calendar className="text-red-500" size={20} />
              <span>Book Tickets</span>
            </h2>

            {/* Date Select */}
            <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
              {dates.map((date) => {
                const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 px-5 py-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                      selectedDate === date ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm font-semibold">{day.split(' ')[0]}</span>
                    <span className="text-lg font-bold">{day.split(' ')[1]} {day.split(' ')[2]}</span>
                  </button>
                );
              })}
            </div>

            {/* Theatre List with Timings */}
            {Object.keys(theatreGroupedShows).length === 0 ? (
              <div className="bg-slate-800 p-8 rounded-xl text-center text-slate-400">
                No shows available for the selected date. Please check another date.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.values(theatreGroupedShows).map(({ theatre, shows }) => (
                  <div key={theatre.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="text-red-500" size={18} />
                      <div>
                        <h3 className="text-lg font-bold">{theatre.name}</h3>
                        <p className="text-xs text-slate-400">{theatre.location}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {shows.map((show) => (
                        <button
                          key={show.id}
                          onClick={() => onNavigate('booking', { showId: show.id })}
                          className="bg-slate-900 border border-slate-700 hover:border-red-500 rounded-lg p-3 text-center transition-colors group"
                        >
                          <span className="block text-sm font-semibold group-hover:text-red-500 transition-colors">{show.time}</span>
                          <span className="block text-xs text-slate-500 mt-1">{show.screenName}</span>
                          <span className="block text-xs text-green-400 mt-1">₹{show.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
