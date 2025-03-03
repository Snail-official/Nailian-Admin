import { api } from './instance'
import type {
  LoginCredentials,
  LoginResponse,
  SignupCredentials,
  SignupResponse,
  RefreshResponse,
  LogoutResponse,
} from '@/types/api/auth'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials)
    return data
  },

  signup: async (userData: SignupCredentials): Promise<SignupResponse> => {
    const { data } = await api.post<SignupResponse>('/auth/signup', userData)
    return data
  },

  refresh: async (): Promise<RefreshResponse> => {
    const { data } = await api.post<RefreshResponse>('/auth/refresh')
    return data
  },

  logout: async (): Promise<LogoutResponse> => {
    const { data } = await api.post<LogoutResponse>('/auth/logout')
    return data
  }
} 