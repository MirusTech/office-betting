import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { listBets } from '../api/client';
import type { BetListItem, BetStatus } from '../types';
import BetCard from '../components/BetCard';
import { useAuth } from '../hooks/useAuth';

type FilterStatus = BetStatus | 'all';

export default function Home() {
  const [bets, setBets] = useState<BetListItem[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchBets = async () => {
    setIsLoading(true);
    try {
      const status = filter === 'all' ? undefined : filter;
      const data = await listBets(status);
      setBets(data);
    } catch (err) {
      console.error('Failed to fetch bets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, [filter]);

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'Closed', value: 'closed' },
    { label: 'Resolved', value: 'resolved' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Active Bets</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBets}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {isAuthenticated && (
            <Link to="/create" className="btn-primary">
              <Plus className="w-4 h-4 mr-1" />
              Create Bet
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No bets found</p>
          {isAuthenticated && (
            <Link to="/create" className="btn-primary">
              <Plus className="w-4 h-4 mr-1" />
              Create the first bet
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bets.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>
      )}
    </div>
  );
}
