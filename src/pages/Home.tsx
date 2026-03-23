import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Film, Clock, Star, Calendar, Play, ChevronLeft, ChevronRight, MapPin, Users, Ticket } from 'lucide-react';
import { Movie } from '../types';
import { motion } from 'framer-motion';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
}

const featuredMovies = [
  {
    id: 'm1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    bannerUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f4e921c4?auto=format&fit=crop&q=80&w=1200',
    genre: ['Sci-Fi', 'Action'],
    duration: 148,
    rating: 'UA',
  },
  {
    id: 'm2',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with the Fremen people while seeking revenge against the conspirators.',
    bannerUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200',
    genre: ['Sci-Fi', 'Adventure'],
    duration: 166,
    rating: 'UA',
  },
  {
    id: 'm3',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    bannerUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=1200',
    genre: ['Sci-Fi', 'Drama'],
    duration: 169,
    rating: 'U',
  },
];

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { movies, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  const genres = ['All', 'Sci-Fi', 'Action', 'Adventure', 'Drama', 'Comedy', 'Thriller'];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const featured = featuredMovies[currentFeaturedIndex];

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      {/* Hero Carousel */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div
          key={currentFeaturedIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${featured.bannerUrl}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{featured.title}</h1>
              <p className="text-xl text-slate-300 mb-6">{featured.description}</p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock size={16} className="text-red-500" />
                  <span>{featured.duration} mins</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Ticket size={16} className="text-yellow-500" />
                  <span>{featured.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featured.genre.map((g) => (
                    <span key={g} className="px-3 py-1 bg-slate-800/80 text-slate-300 rounded-full text-xs">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => onNavigate('movie-details', { movieId: featured.id })}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-transform transform hover:scale-105"
                >
                  <Film size={20} />
                  <span>Book Tickets</span>
                </button>
                <button className="bg-slate-800/80 hover:bg-slate-700 text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-transform transform hover:scale-105">
                  <Play size={20} />
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        <button
          onClick={prevFeatured}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextFeatured}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full"
        >
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentFeaturedIndex(idx)}
              className={`w-3 h-3 rounded-full ${idx === currentFeaturedIndex ? 'bg-red-600' : 'bg-slate-500'}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3">
                <MapPin className="text-red-500" size={24} />
                <div>
                  <h3 className="text-2xl font-bold">15+</h3>
                  <p className="text-slate-400">Theatres</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3">
                <Film className="text-yellow-500" size={24} />
                <div>
                  <h3 className="text-2xl font-bold">50+</h3>
                  <p className="text-slate-400">Movies</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3">
                <Users className="text-green-500" size={24} />
                <div>
                  <h3 className="text-2xl font-bold">10k+</h3>
                  <p className="text-slate-400">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie List Section */}
      <div id="movies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold">Recommended Movies</h2>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-red-500 w-full sm:w-64"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedGenre === genre ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center text-slate-400 py-12">No movies found matching your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMovies.map((movie: Movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 transition-all transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                onClick={() => onNavigate('movie-details', { movieId: movie.id })}
              >
                <div className="relative h-[360px]">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="bg-red-600 w-full py-2.5 text-white font-semibold rounded-lg text-center hover:bg-red-700">
                      Book Tickets
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold truncate pr-2">{movie.title}</h3>
                    <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-200">{movie.rating}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} className="text-red-500" />
                      <span>{movie.duration} mins</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span>4.5</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.map((g) => (
                      <span key={g} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for an unforgettable movie experience?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Book your tickets in seconds, choose your favorite seats, and enjoy the show!
          </p>
          <button
            onClick={() => document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-xl font-semibold inline-flex items-center space-x-3 transition-transform transform hover:scale-105"
          >
            <Ticket size={24} />
            <span>Book Your Tickets Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};