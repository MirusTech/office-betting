import { Link, useNavigate } from 'react-router-dom';
import { Coins, Home, Trophy, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Disclaimer from './Disclaimer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Disclaimer />

      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
              <Coins className="w-8 h-8 text-coin-gold" />
              <span>Office Betting</span>
            </Link>

            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Bets</span>
                  </Link>

                  <Link
                    to="/create"
                    className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create</span>
                  </Link>

                  <Link
                    to="/leaderboard"
                    className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="hidden sm:inline">Leaderboard</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="flex items-center gap-1 bg-coin-light px-3 py-1 rounded-full">
                      <Coins className="w-4 h-4 text-coin-gold" />
                      <span className="font-semibold text-gray-800">
                        {user?.balance.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>

      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          Office Betting Platform - Play Money Only
        </div>
      </footer>
    </div>
  );
}
