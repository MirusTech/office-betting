import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Coins, Sparkles, Trophy, AlertCircle } from 'lucide-react';
import { getBet, placeWager, resolveBet } from '../api/client';
import type { BetDetail } from '../types';
import { useAuth } from '../hooks/useAuth';
import OddsDisplay from '../components/OddsDisplay';
import Countdown from '../components/Countdown';

export default function BetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [bet, setBet] = useState<BetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [wagerAmount, setWagerAmount] = useState(50);
  const [isPlacingWager, setIsPlacingWager] = useState(false);
  const [wagerError, setWagerError] = useState('');
  const [wagerSuccess, setWagerSuccess] = useState('');

  const [isResolving, setIsResolving] = useState(false);
  const [resolveOutcome, setResolveOutcome] = useState<number | null>(null);

  const fetchBet = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getBet(parseInt(id));
      setBet(data);
    } catch {
      setError('Failed to load bet');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBet();
  }, [fetchBet]);

  const handlePlaceWager = async () => {
    if (!bet || !selectedOutcome || !isAuthenticated) return;

    setWagerError('');
    setWagerSuccess('');
    setIsPlacingWager(true);

    try {
      const wager = await placeWager(bet.id, selectedOutcome, wagerAmount);
      setWagerSuccess(
        `Wager placed! ${wager.weight > 1 ? `Early bet bonus: ${wager.weight}x weight!` : ''}`
      );
      setSelectedOutcome(null);
      await fetchBet();
      await refreshUser();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setWagerError(axiosErr.response?.data?.detail || 'Failed to place wager');
      } else {
        setWagerError('Failed to place wager');
      }
    } finally {
      setIsPlacingWager(false);
    }
  };

  const handleResolve = async () => {
    if (!bet || !resolveOutcome) return;

    setIsResolving(true);
    try {
      await resolveBet(bet.id, resolveOutcome);
      await fetchBet();
      await refreshUser();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setError(axiosErr.response?.data?.detail || 'Failed to resolve bet');
      } else {
        setError('Failed to resolve bet');
      }
    } finally {
      setIsResolving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !bet) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error || 'Bet not found'}</p>
          <button onClick={() => navigate('/')} className="btn-secondary mt-4">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOpen = bet.status === 'open';
  const isClosed = bet.status === 'closed';
  const isResolved = bet.status === 'resolved';
  const isCreator = user?.id === bet.creator_id;
  const canResolve = isCreator && isClosed;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Bets
      </Link>

      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{bet.title}</h1>
            <span
              className={`badge ${
                isOpen ? 'badge-open' : isClosed ? 'badge-closed' : 'badge-resolved'
              }`}
            >
              {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
            </span>
          </div>

          {bet.description && <p className="text-gray-600 mb-4">{bet.description}</p>}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Created by {bet.creator_username}</span>

            {isOpen && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Closes in:</span>
                <Countdown targetDate={bet.close_time} onExpire={fetchBet} />
              </div>
            )}

            {bet.is_early_betting && isOpen && (
              <div className="flex items-center gap-1 text-amber-600">
                <Sparkles className="w-4 h-4" />
                <span>Early bet bonus active (1.2x)</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <OddsDisplay
            outcomes={bet.outcomes}
            totalPool={bet.total_pool}
            winningOutcomeId={bet.winning_outcome_id}
            selectedOutcome={selectedOutcome}
            onSelect={isOpen && isAuthenticated ? setSelectedOutcome : undefined}
            isOpen={isOpen}
          />

          {/* Place Wager Section */}
          {isOpen && isAuthenticated && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Place Your Wager</h3>

              {wagerError && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-3 text-sm">
                  {wagerError}
                </div>
              )}

              {wagerSuccess && (
                <div className="bg-green-50 text-green-600 px-4 py-2 rounded mb-3 text-sm">
                  {wagerSuccess}
                </div>
              )}

              {selectedOutcome ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Selected:</span>
                    <span className="font-medium">
                      {bet.outcomes.find((o) => o.id === selectedOutcome)?.name}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (min 50)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={50}
                        max={user?.balance}
                        value={wagerAmount}
                        onChange={(e) => setWagerAmount(parseInt(e.target.value) || 50)}
                        className="input w-32"
                      />
                      <span className="text-gray-500">
                        / {user?.balance.toLocaleString()} available
                      </span>
                    </div>
                  </div>

                  {bet.is_early_betting && (
                    <div className="text-sm text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      <span>
                        Weighted: {Math.round(wagerAmount * 1.2).toLocaleString()} (1.2x bonus)
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handlePlaceWager}
                      disabled={isPlacingWager || wagerAmount < 50 || wagerAmount > (user?.balance || 0)}
                      className="btn-success"
                    >
                      <Coins className="w-4 h-4 mr-1" />
                      {isPlacingWager ? 'Placing...' : `Place ${wagerAmount} Coins`}
                    </button>
                    <button onClick={() => setSelectedOutcome(null)} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Click on an outcome above to place a wager</p>
              )}
            </div>
          )}

          {/* Resolve Section */}
          {canResolve && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Resolve This Bet
              </h3>

              <p className="text-blue-700 text-sm mb-3">
                As the creator, select the winning outcome to distribute payouts.
              </p>

              <div className="space-y-2 mb-4">
                {bet.outcomes.map((outcome) => (
                  <label
                    key={outcome.id}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      resolveOutcome === outcome.id
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resolveOutcome"
                      checked={resolveOutcome === outcome.id}
                      onChange={() => setResolveOutcome(outcome.id)}
                      className="mr-3"
                    />
                    <span>{outcome.name}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleResolve}
                disabled={!resolveOutcome || isResolving}
                className="btn-primary"
              >
                {isResolving ? 'Resolving...' : 'Declare Winner'}
              </button>
            </div>
          )}

          {/* Winner Display */}
          {isResolved && bet.winning_outcome_id && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-semibold">
                Winner: {bet.outcomes.find((o) => o.id === bet.winning_outcome_id)?.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
