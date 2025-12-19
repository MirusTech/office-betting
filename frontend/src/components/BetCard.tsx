import { Link } from 'react-router-dom';
import { Clock, Coins, Users } from 'lucide-react';
import type { BetListItem } from '../types';
import Countdown from './Countdown';

interface BetCardProps {
  bet: BetListItem;
}

const statusBadgeClass: Record<string, string> = {
  open: 'badge-open',
  closed: 'badge-closed',
  resolved: 'badge-resolved',
};

const statusLabel: Record<string, string> = {
  open: 'Open',
  closed: 'Closed',
  resolved: 'Resolved',
};

export default function BetCard({ bet }: BetCardProps) {
  const isOpen = bet.status === 'open';

  return (
    <Link to={`/bet/${bet.id}`} className="card hover:shadow-md transition-shadow block">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{bet.title}</h3>
          <span className={statusBadgeClass[bet.status]}>{statusLabel[bet.status]}</span>
        </div>

        {bet.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bet.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{bet.outcome_count} outcomes</span>
          </div>

          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-coin-gold" />
            <span>{bet.total_pool.toLocaleString()} in pool</span>
          </div>

          {isOpen && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <Countdown targetDate={bet.close_time} />
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          Created by {bet.creator_username}
        </div>
      </div>
    </Link>
  );
}
