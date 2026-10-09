import { apiClient } from './apiClient';
import { User, Profile, UserRole } from '@/types';

export interface LoginParams {
  email: string;
  pass: string;
}

export interface SignupParams {
  email: string;
  pass: string;
  full_name: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  user: User;
  profile: Profile;
}

export interface SessionResponse {
  user: User;
  profile: Profile;
}

export interface UpdateProfileParams {
  bio?: string | null;
  portfolio_link?: string | null;
  open_to_mentoring?: boolean;
  interested_tags?: string[];
}

export const authApi = {
  login: async (params: LoginParams): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', params);
    return response.data;
  },

  signup: async (params: SignupParams): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/signup', params);
    return response.data;
  },

  getSession: async (): Promise<SessionResponse> => {
    const response = await apiClient.get<SessionResponse>('/api/auth/session');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/auth/logout');
    return response.data;
  },

  updateProfile: async (params: UpdateProfileParams): Promise<{ message: string; profile: Profile }> => {
    const response = await apiClient.patch<{ message: string; profile: Profile }>('/api/auth/profile', params);
    return response.data;
  },

  deleteAccount: async (userId: string): Promise<void> => {
    await apiClient.delete(`/api/auth/delete/${userId}`);
  },
};

