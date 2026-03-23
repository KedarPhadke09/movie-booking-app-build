import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash, PlusCircle, Film, Calendar, LayoutDashboard } from 'lucide-react';

interface AdminProps {
  onNavigate: (page: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  const { currentUser, movies, shows, theatres, bookings, addMovie, deleteMovie, addShow } = useStore();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'movies' | 'shows'>('dashboard');

  // Form states
  const [newMovie, setNewMovie] = useState({ title: '', description: '', genre: [] as string[], duration: 120, rating: 'UA', posterUrl: '', bannerUrl: '', isReleased: true });
  const [newShow, setNewShow] = useState({ movieId: '', theatreId: '', screenName: '', time: '', date: '', price: 250 });

  if (!currentUser || currentUser.role !== 'admin') {
    onNavigate('login');
    return null;
  }

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMovie(newMovie);
    setNewMovie({ title: '', description: '', genre: [], duration: 120, rating: 'UA', posterUrl: '', bannerUrl: '', isReleased: true });
  };

  const handleAddShow = async (e: React.FormEvent) => {
    e.preventDefault();
    await addShow(newShow);
    setNewShow({ movieId: '', theatreId: '', screenName: '', time: '', date: '', price: 250 });
  };

  const getMovieTitle = (id: string) => movies.find(m => m.id === id)?.title || 'Unknown';
  const getTheatreName = (id: string) => theatres.find(t => t.id === id)?.name || 'Unknown';

  return (
    <div className="bg-slate-900 min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center space-x-2">
          <LayoutDashboard className="text-red-500" />
          <span>Admin Workspace</span>
        </h1>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === 'movies' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Film size={16} />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setActiveTab('shows')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === 'shows' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calendar size={16} />
            <span>Shows</span>
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Movie</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Show & Seats</th>
                    <th className="px-6 py-4">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {bookings.map((booking) => {
                    const show = shows.find(s => s.id === booking.showId);
                    const movieTitle = show ? getMovieTitle(show.movieId) : 'Unknown';
                    return (
                      <tr key={booking.id} className="hover:bg-slate-750">
                        <td className="px-6 py-4 font-mono text-xs">{booking.id}</td>
                        <td className="px-6 py-4 font-semibold text-white">{movieTitle}</td>
                        <td className="px-6 py-4">{booking.userId}</td>
                        <td className="px-6 py-4">
                          <span className="text-white font-mono text-xs tracking-wider">{booking.seats.join(', ')}</span>
                          <span className="block text-xs text-slate-500">{show ? show.time : ''}</span>
                        </td>
                        <td className="px-6 py-4 text-green-400">₹{booking.totalPrice}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="p-12 text-center text-slate-400">No bookings found yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'movies' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <PlusCircle className="text-red-500" />
                <span>Add Movie</span>
              </h2>
              <form onSubmit={handleAddMovie} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Title</label>
                  <input type="text" required value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Description</label>
                  <textarea rows={3} required value={newMovie.description} onChange={e => setNewMovie({...newMovie, description: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Duration (mins)</label>
                    <input type="number" required value={newMovie.duration} onChange={e => setNewMovie({...newMovie, duration: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Rating</label>
                    <select value={newMovie.rating} onChange={e => setNewMovie({...newMovie, rating: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                      <option value="U">U</option>
                      <option value="UA">UA</option>
                      <option value="A">A</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Genre (comma separated)</label>
                  <input type="text" required value={newMovie.genre.join(', ')} onChange={e => setNewMovie({...newMovie, genre: e.target.value.split(',').map(s => s.trim())})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Poster URL</label>
                  <input type="text" required value={newMovie.posterUrl} onChange={e => setNewMovie({...newMovie, posterUrl: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Banner URL</label>
                  <input type="text" required value={newMovie.bannerUrl} onChange={e => setNewMovie({...newMovie, bannerUrl: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Add Movie
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold mb-6">Existing Movies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movies.map((movie) => (
                  <div key={movie.id} className="bg-slate-900 p-4 rounded-lg flex items-center space-x-4">
                    <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white truncate max-w-[150px]">{movie.title}</h3>
                      <p className="text-xs text-slate-400">{movie.duration} mins | {movie.rating}</p>
                      <span className="text-xs text-slate-500">{movie.genre.join(', ')}</span>
                    </div>
                    <button onClick={() => deleteMovie(movie.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shows' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <PlusCircle className="text-red-500" />
                <span>Add Show Timing</span>
              </h2>
              <form onSubmit={handleAddShow} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Select Movie</label>
                  <select required value={newShow.movieId} onChange={e => setNewShow({...newShow, movieId: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                    <option value="">Select Movie</option>
                    {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Select Theatre</label>
                  <select required value={newShow.theatreId} onChange={e => setNewShow({...newShow, theatreId: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                    <option value="">Select Theatre</option>
                    {theatres.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Screen Name (e.g., Audi 1)</label>
                  <input type="text" required value={newShow.screenName} onChange={e => setNewShow({...newShow, screenName: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Date</label>
                    <input type="date" required value={newShow.date} onChange={e => setNewShow({...newShow, date: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Time (e.g., 10:00 AM)</label>
                    <input type="text" required value={newShow.time} onChange={e => setNewShow({...newShow, time: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Ticket Price (₹)</label>
                  <input type="number" required value={newShow.price} onChange={e => setNewShow({...newShow, price: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Add Show
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold mb-6">Existing Shows</h2>
              <div className="space-y-4">
                {shows.map((show) => (
                  <div key={show.id} className="bg-slate-900 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white">{getMovieTitle(show.movieId)}</h3>
                      <p className="text-xs text-slate-400">{getTheatreName(show.theatreId)} | {show.screenName}</p>
                      <span className="text-xs text-slate-500">{show.date} at {show.time}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-semibold text-green-400 mb-1">₹{show.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
