import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Film, User as UserIcon, LogOut, LayoutDashboard, Search, Home, Calendar, History, Ticket, Settings, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { currentUser, logout } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('home', { search: searchQuery });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'movie-details', label: 'Movies', icon: Film },
    { id: 'booking', label: 'Bookings', icon: Ticket },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row: Logo and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <Film className="h-10 w-10 text-red-500" />
              <span className="text-2xl font-bold font-sans tracking-tight">Cine<span className="text-red-500">Tickets</span></span>
            </div>
            <div className="md:hidden">
              {currentUser ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
                >
                  <UserIcon size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto md:mx-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search movies, theatres, showtimes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm">
                Search
              </button>
            </div>
          </form>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => onNavigate('admin')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium ${currentPage === 'admin' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin</span>
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <UserIcon size={18} />
                    <span className="font-medium">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown size={16} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                      >
                        <UserIcon size={16} />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => { onNavigate('profile', { tab: 'history' }); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                      >
                        <History size={16} />
                        <span>Booking History</span>
                      </button>
                      <button
                        onClick={() => { onNavigate('profile', { tab: 'settings' }); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                      <hr className="border-slate-700 my-1" />
                      <button
                        onClick={() => { logout(); onNavigate('home'); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => onNavigate('login', { mode: 'signup' })}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium border border-slate-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Navigation */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2">
          <button 
            onClick={() => onNavigate('home')}
            className={`flex items-center space-x-1 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${currentPage === 'home' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Home size={16} />
            <span>Home</span>
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className={`flex items-center space-x-1 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${currentPage.startsWith('movie') ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Film size={16} />
            <span>Movies</span>
          </button>
          <button 
            onClick={() => currentUser ? onNavigate('profile', { tab: 'history' }) : onNavigate('login')}
            className={`flex items-center space-x-1 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${currentPage === 'booking' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Ticket size={16} />
            <span>My Bookings</span>
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className={`flex items-center space-x-1 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${false ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Calendar size={16} />
            <span>Showtimes</span>
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className={`flex items-center space-x-1 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${false ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <History size={16} />
            <span>Recently Added</span>
          </button>
        </nav>

        {/* Mobile User Menu */}
        {showUserMenu && currentUser && (
          <div className="md:hidden bg-slate-800 border border-slate-700 rounded-lg mt-2 py-2">
            <div className="px-4 py-3 border-b border-slate-700">
              <p className="font-medium text-white">{currentUser.name}</p>
              <p className="text-sm text-slate-400">{currentUser.email}</p>
            </div>
            <button
              onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700"
            >
              My Profile
            </button>
            <button
              onClick={() => { onNavigate('profile', { tab: 'history' }); setShowUserMenu(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700"
            >
              Booking History
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => { onNavigate('admin'); setShowUserMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700"
              >
                Admin Dashboard
              </button>
            )}
            <button
              onClick={() => { logout(); onNavigate('home'); setShowUserMenu(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
