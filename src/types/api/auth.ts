import { ApiSuccessResponse } from '../api'
import { NextRequest } from 'next/server'

// 공통 타입
export interface User {
  id: number
  email: string
  username: string
}

// POST /api/auth/login
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginRequest extends NextRequest {
  json(): Promise<LoginCredentials>
}

export function isValidLoginBody(body: unknown): body is LoginCredentials {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as LoginCredentials).email === 'string' &&
    typeof (body as LoginCredentials).password === 'string'
  )
}

export type LoginResponse = ApiSuccessResponse

// POST /api/auth/signup
export interface SignupCredentials {
  email: string
  password: string
  username: string
}

export interface SignupRequest extends NextRequest {
  json(): Promise<SignupCredentials>
}

export function isValidSignupBody(body: unknown): body is SignupCredentials {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as SignupCredentials).email === 'string' &&
    typeof (body as SignupCredentials).password === 'string' &&
    typeof (body as SignupCredentials).username === 'string'
  )
}

export type SignupResponse = ApiSuccessResponse<{
  user: User
}>

// POST /api/auth/refresh
export function isValidRefreshRequest(req: NextRequest): boolean {
  return req.cookies.has('refreshToken')
}

export type RefreshResponse = ApiSuccessResponse<{
  accessToken: string
}> 