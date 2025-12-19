import { Coins, TrendingUp, Trophy } from 'lucide-react';
import type { OutcomeWithOdds } from '../types';

interface OddsDisplayProps {
  outcomes: OutcomeWithOdds[];
  totalPool: number;
  winningOutcomeId?: number | null;
  selectedOutcome?: number | null;
  onSelect?: (outcomeId: number) => void;
  isOpen?: boolean;
}

export default function OddsDisplay({
  outcomes,
  totalPool,
  winningOutcomeId,
  selectedOutcome,
  onSelect,
  isOpen = false,
}: OddsDisplayProps) {
  const isSelectable = isOpen && onSelect;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Outcomes</span>
        <div className="flex items-center gap-1">
          <Coins className="w-4 h-4 text-coin-gold" />
          <span>Total Pool: {totalPool.toLocaleString()}</span>
        </div>
      </div>

      {outcomes.map((outcome) => {
        const isWinner = winningOutcomeId === outcome.id;
        const isSelected = selectedOutcome === outcome.id;
        const percentage =
          totalPool > 0 ? ((outcome.pool_total / totalPool) * 100).toFixed(1) : '0';

        return (
          <div
            key={outcome.id}
            onClick={() => isSelectable && onSelect(outcome.id)}
            className={`
              relative overflow-hidden rounded-lg border-2 p-4 transition-all
              ${isWinner ? 'border-green-500 bg-green-50' : ''}
              ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
              ${isSelectable ? 'cursor-pointer hover:border-primary-300' : ''}
            `}
          >
            {/* Progress bar background */}
            <div
              className={`absolute inset-0 opacity-10 ${isWinner ? 'bg-green-500' : 'bg-primary-500'}`}
              style={{ width: `${percentage}%` }}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isWinner && <Trophy className="w-5 h-5 text-green-600" />}
                <span className={`font-medium ${isWinner ? 'text-green-700' : 'text-gray-800'}`}>
                  {outcome.name}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="text-gray-500">
                  <span className="font-medium">{outcome.pool_total.toLocaleString()}</span>
                  <span className="ml-1">coins</span>
                </div>

                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {outcome.payout_multiplier > 0 ? `${outcome.payout_multiplier.toFixed(2)}x` : '-'}
                  </span>
                </div>

                <div className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                  {percentage}%
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
