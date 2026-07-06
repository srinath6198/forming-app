import api from './api';
import type { User } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    token: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  profile_image?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await api.put<UpdateProfileResponse>('/profile/update', data);
    return response.data;
  },
};
