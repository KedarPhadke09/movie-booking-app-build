import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, signup, loading, error, setError } = useStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) onNavigate('home');
    } else {
      const success = await signup(formData.name, formData.email, formData.password);
      if (success) onNavigate('home');
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center px-4">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-slate-400 text-sm text-center mb-8">
          {isLogin ? 'Login to browse and book tickets for your favorite movies.' : 'Sign up to get started and book movie tickets!'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setError(null);
                  setFormData({ ...formData, email: e.target.value });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="test@test.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => {
                  setError(null);
                  setFormData({ ...formData, password: e.target.value });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                placeholder={isLogin ? "admin123 or password" : "Create password"}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">{isLogin ? "Don't have an account?" : "Already have an account?"} </span>
          <button
            onClick={() => {
              setError(null);
              setIsLogin(!isLogin);
            }}
            className="text-red-500 hover:underline font-semibold"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">Demo Credentials:</p>
          <div className="flex justify-between mt-2 text-xs text-slate-400 px-4">
            <span>Admin: admin@test.com / admin123</span>
            <span>User: user@test.com / password</span>
          </div>
        </div>
      </div>
    </div>
  );
};
