import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Coins } from 'lucide-react';
import { getLeaderboard } from '../api/client';
import type { LeaderboardEntry } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(20);
        setEntries(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-gray-400">{rank}</span>;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200';
      default:
        return 'bg-white border-gray-100';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-500 mt-1">Top OfficeCoins holders</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-500">No users yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const isCurrentUser = user?.username === entry.username;

            return (
              <div
                key={entry.username}
                className={`card p-4 border-2 ${getRankClass(entry.rank)} ${
                  isCurrentUser ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8">{getRankIcon(entry.rank)}</div>

                  <div className="flex-1">
                    <p className={`font-medium ${isCurrentUser ? 'text-primary-600' : 'text-gray-900'}`}>
                      {entry.username}
                      {isCurrentUser && <span className="ml-2 text-sm text-gray-500">(You)</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-gray-700">
                    <Coins className="w-5 h-5 text-coin-gold" />
                    <span className="font-semibold">{entry.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
