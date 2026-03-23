import { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { Booking } from './pages/Booking';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [routeParams, setRouteParams] = useState<any>({});

  const navigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setRouteParams(params);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'movie-details':
        return <MovieDetails params={routeParams} onNavigate={navigate} />;
      case 'booking':
        return <Booking params={routeParams} onNavigate={navigate} />;
      case 'admin':
        return <Admin onNavigate={navigate} />;
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'profile':
        return <Profile onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans">
      <Header onNavigate={navigate} currentPage={currentPage} />
      <main className="pb-12">
        {renderPage()}
      </main>
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>© 2026 CineTickets - BookMyShow Clone. All rights reserved.</p>
        <p className="mt-1">Proudly built with React, Vite & Tailwind CSS.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

export default App;
