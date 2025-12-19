import axios from 'axios';
import type { User, BetListItem, BetDetail, Wager, LeaderboardEntry, AppConfig } from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = async (username: string, password: string): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', { username, password });
  return data;
};

export const login = async (username: string, password: string): Promise<string> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const { data } = await api.post<{ access_token: string }>('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data.access_token;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/me');
  return data;
};

// Bets
export const listBets = async (status?: string): Promise<BetListItem[]> => {
  const params = status ? { status } : {};
  const { data } = await api.get<BetListItem[]>('/bets', { params });
  return data;
};

export const getBet = async (id: number): Promise<BetDetail> => {
  const { data } = await api.get<BetDetail>(`/bets/${id}`);
  return data;
};

export interface CreateBetData {
  title: string;
  description: string;
  outcomes: { name: string }[];
  close_time: string;
}

export const createBet = async (bet: CreateBetData): Promise<BetDetail> => {
  const { data } = await api.post<BetDetail>('/bets', bet);
  return data;
};

export const placeWager = async (betId: number, outcomeId: number, amount: number): Promise<Wager> => {
  const { data } = await api.post<Wager>(`/bets/${betId}/wager`, {
    outcome_id: outcomeId,
    amount,
  });
  return data;
};

export const resolveBet = async (betId: number, winningOutcomeId: number): Promise<BetDetail> => {
  const { data } = await api.post<BetDetail>(`/bets/${betId}/resolve`, {
    winning_outcome_id: winningOutcomeId,
  });
  return data;
};

// Wagers
export const getMyWagers = async (): Promise<Wager[]> => {
  const { data } = await api.get<Wager[]>('/bets/users/me/wagers');
  return data;
};

// Leaderboard
export const getLeaderboard = async (limit = 10): Promise<LeaderboardEntry[]> => {
  const { data } = await api.get<LeaderboardEntry[]>('/leaderboard', { params: { limit } });
  return data;
};

// Config
export const getConfig = async (): Promise<AppConfig> => {
  const { data } = await api.get<AppConfig>('/config');
  return data;
};

export default api;
