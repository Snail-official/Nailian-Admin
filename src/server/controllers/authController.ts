import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { authService } from '@/server/services/authService'
import { createSuccessResponse } from '@/server/lib/api-response'
import { ApiResponseCode } from '@/types/api'
import { isValidLoginBody, isValidSignupBody, LoginResponse, RefreshResponse, SignupResponse } from '@/types/api/auth'
import { isValidRefreshRequest } from '@/types/api/auth'
import { controllerHandler } from '@/server/utils/controllerUtils'

export class AuthController {
  private service = authService

  // 로그인
  async login(req: NextRequest) {
    return controllerHandler(async () => {
      const body = await req.json()
      
      if (!isValidLoginBody(body)) {
        throw new Error('잘못된 요청 형식입니다.')
      }
      
      const { email, password } = body
      
      const result = await this.service.login(email, password)
      
      const cookieStore = await cookies()
      
      // Access Token 쿠키 설정
      cookieStore.set('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 // 1시간
      })
      
      // Refresh Token 쿠키 설정
      cookieStore.set('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7일
      })
      
      return createSuccessResponse<LoginResponse>(
        ApiResponseCode.SUCCESS,
        '로그인 성공'
      )
    }, '로그인 중 오류가 발생했습니다.')
  }
  
  // 토큰 갱신
  async refreshToken(req: NextRequest) {
    return controllerHandler(async () => {
      if (!isValidRefreshRequest(req)) {
        throw new Error('잘못된 요청 형식입니다.')
      }
      
      const cookieStore = await cookies()
      const refreshToken = req.cookies.get('refreshToken')?.value
      
      if (!refreshToken) {
        throw new Error('Refresh Token이 없습니다.')
      }
      
      const result = await this.service.refreshToken(refreshToken)
      
      // 새로운 Access Token을 쿠키에 설정
      cookieStore.set('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 // 1시간
      })
      
      return createSuccessResponse<RefreshResponse>(
        ApiResponseCode.SUCCESS,
        '토큰이 갱신되었습니다.',
      )
    }, '토큰 갱신 중 오류가 발생했습니다.')
  }
  
  // 회원가입
  async signup(req: NextRequest) {
    return controllerHandler(async () => {
      const body = await req.json()
      
      if (!isValidSignupBody(body)) {
        throw new Error('잘못된 요청 형식입니다.')
      }
      
      const { email, username, password } = body
      
      const user = await this.service.signup(email, username, password)
      
      return createSuccessResponse<SignupResponse['data']>(
        ApiResponseCode.CREATED,
        '회원가입이 완료되었습니다.',
        { user }
      )
    }, '회원가입 중 오류가 발생했습니다.')
  }
}

// 싱글톤 인스턴스 생성
export const authController = new AuthController() 