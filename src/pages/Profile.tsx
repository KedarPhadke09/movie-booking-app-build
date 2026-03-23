import React from 'react';
import { useStore } from '../context/StoreContext';
import { Ticket, Calendar, Clock, MapPin } from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { currentUser, bookings, shows, movies, theatres } = useStore();

  if (!currentUser) {
    onNavigate('login');
    return null;
  }

  const userBookings = bookings.filter((b) => b.userId === currentUser.id);

  return (
    <div className="bg-slate-900 min-h-screen text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 mb-8 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center font-bold text-2xl text-white">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-sm text-slate-400">{currentUser.email}</p>
              <span className="inline-block mt-1 text-xs bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full capitalize">{currentUser.role} Account</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Browse Movies
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
          <Ticket className="text-red-500" />
          <span>My Ticket History ({userBookings.length})</span>
        </h2>

        {userBookings.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-xl text-center text-slate-400 border border-slate-700">
            You haven't booked any tickets yet. 
            <button onClick={() => onNavigate('home')} className="block mx-auto text-red-500 underline mt-2">Book Now</button>
          </div>
        ) : (
          <div className="space-y-6">
            {userBookings.map((booking) => {
              const show = shows.find((s) => s.id === booking.showId);
              const movie = show ? movies.find((m) => m.id === show.movieId) : null;
              const theatre = show ? theatres.find((t) => t.id === show.theatreId) : null;

              if (!show || !movie || !theatre) return null;

              return (
                <div key={booking.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 left-1/3 border-l-2 border-dashed border-slate-700 h-full"></div>
                  
                  <div className="grid grid-cols-3 h-full">
                    <div className="col-span-2 p-6 flex flex-col justify-between h-full">
                      <div>
                        <span className="text-xs font-semibold text-red-500 tracking-wider">CONFIRMED TICKET</span>
                        <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <MapPin size={16} className="text-red-500" />
                            <span>{theatre.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} className="text-red-500" />
                            <span>{show.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={16} className="text-red-500" />
                            <span>{show.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-xs text-slate-500">Seats Booked</span>
                          <p className="font-bold text-red-500 text-lg tracking-wider">{booking.seats.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Total Price</span>
                          <p className="font-bold text-green-400 text-lg">₹{booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 p-6 bg-slate-850 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-24 h-24 bg-white p-2 rounded-lg">
                        {/* Fake QR code */}
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-mono p-1">
                          Booking ID: {booking.id.split('_')[1]}
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-xs text-slate-500 block">Show Screen</span>
                        <span className="font-bold text-white text-lg">{show.screenName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
