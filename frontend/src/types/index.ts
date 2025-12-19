export interface User {
  id: number;
  username: string;
  balance: number;
  created_at: string;
}

export interface OutcomeWithOdds {
  id: number;
  name: string;
  pool_total: number;
  weighted_total: number;
  odds: number;
  payout_multiplier: number;
}

export type BetStatus = 'open' | 'closed' | 'resolved';

export interface BetListItem {
  id: number;
  title: string;
  description: string;
  close_time: string;
  status: BetStatus;
  created_at: string;
  creator_username: string;
  total_pool: number;
  outcome_count: number;
}

export interface BetDetail {
  id: number;
  title: string;
  description: string;
  close_time: string;
  status: BetStatus;
  created_at: string;
  creator_id: number;
  creator_username: string;
  total_pool: number;
  outcomes: OutcomeWithOdds[];
  winning_outcome_id: number | null;
  is_early_betting: boolean;
}

export interface Wager {
  id: number;
  outcome_id: number;
  outcome_name: string;
  bet_id: number;
  bet_title: string;
  amount: number;
  weight: number;
  payout: number | null;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  balance: number;
}

export interface AppConfig {
  minimum_wager: number;
  early_bet_bonus: number;
  initial_balance: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
