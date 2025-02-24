import { api } from './instance'

interface LoginCredentials {
    email: string
    password: string
}

interface SignupData {
    email: string
    password: string
    username: string
}

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const { data } = await api.post('/auth/login', credentials)
        return data
    },
    signup: async (userData: SignupData) => {
        const { data } = await api.post('/auth/signup', userData)
        return data
    },
    refresh: async () => {
        const { data } = await api.post('/auth/refresh')
        return data
    }
} 