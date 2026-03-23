import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Ticket, CreditCard, Loader2 } from 'lucide-react';

interface BookingProps {
  params: { showId: string };
  onNavigate: (page: string, params?: any) => void;
}

const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const Booking: React.FC<BookingProps> = ({ params, onNavigate }) => {
  const { shows, movies, theatres, currentUser, lockSeat, unlockSeat, getBookedSeatsForShow, bookSeats, setError } = useStore();
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingStep, setBookingStep] = useState<'seats' | 'payment' | 'success'>('seats');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) {
      onNavigate('login');
    }
  }, [currentUser, onNavigate]);

  const show = shows.find((s) => s.id === params.showId);
  const movie = show ? movies.find((m) => m.id === show.movieId) : null;
  const theatre = show ? theatres.find((t) => t.id === show.theatreId) : null;

  if (!show || !movie || !theatre) {
    return <div className="text-white text-center p-12">Show not found!</div>;
  }

  const bookedSeats = getBookedSeatsForShow(show.id);

  const handleSeatClick = async (seat: string) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seat));
      await unlockSeat(show.id, seat);
    } else {
      // Try to lock seat
      const success = await lockSeat(show.id, seat);
      if (success) {
        setSelectedSeats((prev) => [...prev, seat]);
      } else {
        alert(`Seat ${seat} is already locked by someone else. Please select another seat.`);
      }
    }
  };

  const totalAmount = selectedSeats.length * show.price;

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }
    setBookingStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate real-time validation: backend will check if seats are already booked
      const booking = await bookSeats(show.id, selectedSeats, show.price);
      setBookingDetails(booking);
      setBookingStep('success');
    } catch (err: any) {
      setError(err.message || 'Booking failed');
      setBookingStep('seats'); // Rollback if double booking or failure
      setSelectedSeats([]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${bookingStep === 'seats' ? 'bg-red-600 scale-110' : 'bg-slate-700'}`}>1</div>
            <div className="h-1 w-24 bg-slate-700"></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${bookingStep === 'payment' ? 'bg-red-600 scale-110' : 'bg-slate-700'}`}>2</div>
            <div className="h-1 w-24 bg-slate-700"></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${bookingStep === 'success' ? 'bg-red-600 scale-110' : 'bg-slate-700'}`}>3</div>
          </div>
        </div>

        {bookingStep === 'seats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <Ticket className="text-red-500" />
                <span>Select Your Seats</span>
              </h2>

              {/* Screen Display */}
              <div className="w-full flex justify-center mb-12">
                <div className="relative w-[80%]">
                  <div className="h-1.5 w-full bg-cyan-400 rounded-lg shadow-[0_4px_12px_rgba(34,211,238,0.5)] mb-1"></div>
                  <div className="text-center text-xs text-slate-500 font-mono tracking-widest uppercase">Screen Direction</div>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="flex flex-col items-center space-y-3">
                {rows.map((row) => (
                  <div key={row} className="flex space-x-3 items-center">
                    <span className="w-4 text-xs text-slate-500 font-bold">{row}</span>
                    {cols.map((col) => {
                      const seatId = `${row}${col}`;
                      const isBooked = bookedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      let seatClasses = "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 ";
                      if (isBooked) seatClasses += "bg-red-600 cursor-not-allowed opacity-60";
                      else if (isSelected) seatClasses += "bg-yellow-500 text-slate-900 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
                      else seatClasses += "bg-slate-700 hover:bg-slate-600 text-slate-200";

                      return (
                        <div
                          key={seatId}
                          onClick={() => handleSeatClick(seatId)}
                          className={seatClasses}
                        >
                          {col}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-12 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-slate-700"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-yellow-500"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-red-600"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
                <div className="space-y-4 text-slate-300">
                  <div>
                    <span className="text-xs text-slate-500">Movie</span>
                    <p className="font-semibold text-white">{movie.title}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Cinema & Screen</span>
                    <p className="font-semibold text-white">{theatre.name} ({show.screenName})</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Date & Time</span>
                    <p className="font-semibold text-white">{show.date} at {show.time}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Seats ({selectedSeats.length})</span>
                    <p className="font-semibold text-white text-sm tracking-wider">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-green-400">₹{totalAmount}</span>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {bookingStep === 'payment' && (
          <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <CreditCard className="text-red-500" />
              <span>Mock Payment System</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-slate-900 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500">Payable Amount</div>
                  <div className="text-2xl font-bold text-white">₹{totalAmount}</div>
                </div>
                <div className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">Razorpay/Stripe</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Card Number</label>
                <input type="text" value="4242 4242 4242 4242" disabled className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Expiry</label>
                  <input type="text" value="12/28" disabled className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">CVV</label>
                  <input type="text" value="***" disabled className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400" />
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2 disabled:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {isProcessing && <Loader2 className="animate-spin h-5 w-5" />}
              <span>{isProcessing ? 'Processing Payment...' : `Pay ₹${totalAmount}`}</span>
            </button>
            
            <button
              onClick={() => setBookingStep('seats')}
              disabled={isProcessing}
              className="w-full text-sm text-slate-400 hover:text-white mt-4 disabled:text-slate-600"
            >
              Go Back
            </button>
          </div>
        )}

        {bookingStep === 'success' && bookingDetails && (
          <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
              <Ticket size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-sm text-slate-400 mb-8">Your tickets have been booked successfully. Enjoy your movie!</p>

            <div className="bg-slate-900 p-6 rounded-lg text-left space-y-3 mb-8 border border-slate-700 relative">
              {/* Ticket cutouts simulation */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-slate-800 rounded-full"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-slate-800 rounded-full"></div>

              <div>
                <span className="text-xs text-slate-500">Ticket ID</span>
                <p className="font-mono text-sm text-white">{bookingDetails.id}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Movie</span>
                <p className="font-semibold text-white">{movie.title}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Cinema & Screen</span>
                <p className="font-semibold text-white">{theatre.name} ({show.screenName})</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-500">Date</span>
                  <p className="font-semibold text-white text-sm">{show.date}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Time</span>
                  <p className="font-semibold text-white text-sm">{show.time}</p>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500">Seats</span>
                <p className="font-bold text-red-500 tracking-wider">{selectedSeats.join(', ')}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Go to Home Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
