import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Calendar, Clock, MapPin, Ticket, Users, ArrowLeft, Download, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookingHistoryProps {
  onNavigate: (page: string, params?: any) => void;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({ onNavigate }) => {
  const { bookings, movies, shows, theatres, currentUser } = useStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const userBookings = bookings.filter(b => b.userId === currentUser?.id).map(booking => {
    const show = shows.find(s => s.id === booking.showId);
    const movie = movies.find(m => m.id === show?.movieId);
    const theatre = theatres.find(t => t.id === show?.theatreId);
    const showTime = show ? `${show.date} ${show.time}` : '';
    const isUpcoming = new Date(show?.date || '') > new Date();

    return {
      ...booking,
      show,
      movie,
      theatre,
      showTime,
      isUpcoming,
    };
  });

  const filteredBookings = userBookings.filter(b => {
    if (filter === 'upcoming') return b.isUpcoming;
    if (filter === 'past') return !b.isUpcoming;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    return timeString; // Assuming already formatted
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-2 text-slate-400 hover:text-white mb-4"
            >
              <ArrowLeft size={20} />
              <span>Back to Profile</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">Booking History</h1>
            <p className="text-slate-400">View and manage all your past and upcoming bookings</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{userBookings.length}</div>
              <div className="text-sm text-slate-400">Total Bookings</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{userBookings.filter(b => b.isUpcoming).length}</div>
              <div className="text-sm text-slate-400">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filter === 'upcoming' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Upcoming Shows
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filter === 'past' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Past Shows
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-2xl">
            <Ticket className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No bookings found</h3>
            <p className="text-slate-500 mb-6">You haven't made any bookings yet.</p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Movie Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{booking.movie?.title}</h3>
                          <div className="flex items-center space-x-4 text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Calendar size={16} />
                              <span>{formatDate(booking.show?.date || '')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={16} />
                              <span>{formatTime(booking.show?.time || '')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Ticket size={16} />
                              <span>{booking.seats.length} seats</span>
                            </div>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          booking.isUpcoming ? 'bg-green-900/30 text-green-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {booking.isUpcoming ? 'Upcoming' : 'Completed'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-400 mb-1">Theatre</h4>
                            <div className="flex items-center space-x-2">
                              <MapPin className="text-red-500" size={18} />
                              <span className="text-lg">{booking.theatre?.name}</span>
                            </div>
                            <p className="text-slate-500 mt-1">{booking.theatre?.location}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-400 mb-1">Screen</h4>
                            <p className="text-lg">{booking.show?.screenName}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-400 mb-1">Seats</h4>
                            <div className="flex flex-wrap gap-2">
                              {booking.seats.map((seat) => (
                                <span key={seat} className="px-3 py-1.5 bg-slate-700 rounded-lg font-mono">
                                  {seat}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-400 mb-1">Total Price</h4>
                            <p className="text-2xl font-bold text-green-400">₹{booking.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-3 lg:w-48">
                      <button
                        onClick={() => onNavigate('ticket', { bookingId: booking.id })}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                      >
                        <Ticket size={20} />
                        <span>View Ticket</span>
                      </button>
                      <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                        <Download size={20} />
                        <span>Download</span>
                      </button>
                      {booking.isUpcoming && (
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold border border-slate-700">
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-500">
                    <div>
                      Booking ID: <span className="font-mono text-slate-300">{booking.id}</span>
                      <span className="mx-2">•</span>
                      Booked on {formatDate(booking.bookingTime)}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                      <button className="flex items-center space-x-1 text-slate-400 hover:text-white">
                        <Printer size={16} />
                        <span>Print</span>
                      </button>
                      <button className="flex items-center space-x-1 text-slate-400 hover:text-white">
                        <Users size={16} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Total Spending</h3>
            <p className="text-3xl font-bold">₹{userBookings.reduce((sum, b) => sum + b.totalPrice, 0)}</p>
            <p className="text-slate-500 text-sm mt-1">Across {userBookings.length} bookings</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Favorite Genre</h3>
            <p className="text-3xl font-bold">Sci-Fi</p>
            <p className="text-slate-500 text-sm mt-1">Based on your booking history</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Average Tickets</h3>
            <p className="text-3xl font-bold">
              {userBookings.length > 0 
                ? (userBookings.reduce((sum, b) => sum + b.seats.length, 0) / userBookings.length).toFixed(1)
                : '0'
              }
            </p>
            <p className="text-slate-500 text-sm mt-1">Tickets per booking</p>
          </div>
        </div>
      </div>
    </div>
  );
};