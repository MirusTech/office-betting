import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coins, Calendar, TrendingUp, Trophy, Clock } from 'lucide-react';
import { getMyWagers } from '../api/client';
import type { Wager } from '../types';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const [wagers, setWagers] = useState<Wager[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWagers = async () => {
      try {
        const data = await getMyWagers();
        setWagers(data);
      } catch (err) {
        console.error('Failed to fetch wagers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWagers();
  }, []);

  const stats = {
    totalWagers: wagers.length,
    totalWagered: wagers.reduce((sum, w) => sum + w.amount, 0),
    totalWon: wagers.filter((w) => w.payout && w.payout > 0).reduce((sum, w) => sum + (w.payout || 0), 0),
    wins: wagers.filter((w) => w.payout && w.payout > 0).length,
    losses: wagers.filter((w) => w.payout === 0).length,
    pending: wagers.filter((w) => w.payout === null).length,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Balance Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Current Balance</p>
            <div className="flex items-center gap-2 mt-1">
              <Coins className="w-8 h-8 text-coin-gold" />
              <span className="text-3xl font-bold text-gray-900">
                {user?.balance.toLocaleString()}
              </span>
              <span className="text-gray-500">OfficeCoins</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Username</p>
            <p className="text-xl font-semibold text-gray-900">{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-gray-500 text-sm">Total Wagered</p>
          <p className="text-xl font-semibold text-gray-900">{stats.totalWagered.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-gray-500 text-sm">Total Won</p>
          <p className="text-xl font-semibold text-green-600">{stats.totalWon.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-gray-500 text-sm">Win Rate</p>
          <p className="text-xl font-semibold text-gray-900">
            {stats.wins + stats.losses > 0
              ? `${Math.round((stats.wins / (stats.wins + stats.losses)) * 100)}%`
              : '-'}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-gray-500 text-sm">Pending Bets</p>
          <p className="text-xl font-semibold text-amber-600">{stats.pending}</p>
        </div>
      </div>

      {/* Wager History */}
      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Wager History</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : wagers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't placed any wagers yet</p>
            <Link to="/" className="btn-primary">
              Browse Bets
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {wagers.map((wager) => (
              <Link
                key={wager.id}
                to={`/bet/${wager.bet_id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{wager.bet_title}</p>
                  <p className="text-sm text-gray-500">
                    Picked: <span className="font-medium">{wager.outcome_name}</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(wager.created_at), 'MMM d, yyyy')}
                    </span>
                    {wager.weight > 1 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <TrendingUp className="w-3 h-3" />
                        {wager.weight}x bonus
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-gray-900">{wager.amount.toLocaleString()} wagered</p>
                  {wager.payout === null ? (
                    <span className="text-sm text-amber-600 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  ) : wager.payout > 0 ? (
                    <span className="text-sm text-green-600 flex items-center justify-end gap-1">
                      <Trophy className="w-3 h-3" />
                      Won {wager.payout.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-sm text-red-600">Lost</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
