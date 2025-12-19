import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Sparkles } from 'lucide-react';
import { createBet } from '../api/client';

export default function CreateBet() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [outcomes, setOutcomes] = useState(['Yes', 'No']);
  const [closeDays, setCloseDays] = useState(1);
  const [closeHours, setCloseHours] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addOutcome = () => {
    if (outcomes.length < 10) {
      setOutcomes([...outcomes, '']);
    }
  };

  const removeOutcome = (index: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  const updateOutcome = (index: number, value: string) => {
    setOutcomes(outcomes.map((o, i) => (i === index ? value : o)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    const validOutcomes = outcomes.filter((o) => o.trim().length > 0);
    if (validOutcomes.length < 2) {
      setError('At least 2 outcomes are required');
      return;
    }

    const totalHours = closeDays * 24 + closeHours;
    if (totalHours < 1) {
      setError('Close time must be at least 1 hour in the future');
      return;
    }

    setIsLoading(true);

    try {
      const closeTime = new Date();
      closeTime.setHours(closeTime.getHours() + totalHours);

      const bet = await createBet({
        title,
        description,
        outcomes: validOutcomes.map((name) => ({ name })),
        close_time: closeTime.toISOString(),
      });

      navigate(`/bet/${bet.id}`);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setError(axiosErr.response?.data?.detail || 'Failed to create bet');
      } else {
        setError('Failed to create bet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const totalHours = closeDays * 24 + closeHours;
  const earlyBetWindow = Math.round(totalHours / 2);

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Bets
      </Link>

      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Create New Bet</h1>
          <p className="text-gray-500 mt-1">Set up a new betting event for the office</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Question / Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="e.g., Will the deploy succeed on first try?"
              required
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[100px]"
              placeholder="Optional details about the bet, resolution criteria, etc."
              maxLength={2000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outcomes * (min 2, max 10)
            </label>
            <div className="space-y-2">
              {outcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => updateOutcome(index, e.target.value)}
                    className="input flex-1"
                    placeholder={`Outcome ${index + 1}`}
                    required
                    maxLength={100}
                  />
                  {outcomes.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOutcome(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {outcomes.length < 10 && (
              <button
                type="button"
                onClick={addOutcome}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Outcome
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Betting Window (when betting closes)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={closeDays}
                  onChange={(e) => setCloseDays(parseInt(e.target.value) || 0)}
                  className="input w-20"
                />
                <span className="text-gray-600">days</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={closeHours}
                  onChange={(e) => setCloseHours(parseInt(e.target.value) || 0)}
                  className="input w-20"
                />
                <span className="text-gray-600">hours</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Betting closes in {totalHours} hour{totalHours !== 1 ? 's' : ''}
            </p>
          </div>

          {totalHours > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Early Bet Bonus</span>
              </div>
              <p className="text-sm text-amber-600 mt-1">
                Wagers placed in the first {earlyBetWindow} hour{earlyBetWindow !== 1 ? 's' : ''}{' '}
                receive 1.2x weight for payout calculations.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Bet'}
            </button>
            <Link to="/" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
