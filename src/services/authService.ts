import { authRepository } from '@/repositories/authRepository'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret'
const ACCESS_TOKEN_EXPIRY = '1h'
const REFRESH_TOKEN_EXPIRY = '7d'

export class AuthService {
  private repository = authRepository

  // 로그인
  async login(email: string, password: string) {
    // 사용자 조회
    const admin = await this.repository.findAdminByEmail(email)
    
    if (!admin) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
    
    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    
    if (!isValidPassword) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
    
    // Access Token 생성
    const accessToken = jwt.sign(
      { 
        id: admin.id,
        email: admin.email,
        username: admin.username
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    )
    
    // Refresh Token 생성
    const refreshToken = jwt.sign(
      { id: admin.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    )
    
    // Refresh Token을 데이터베이스에 저장
    await this.repository.saveRefreshToken(refreshToken, admin.id)
    
    // Access Token을 Redis에 저장
    await this.repository.saveAccessToken(admin.id, accessToken)
    
    return {
      accessToken,
      refreshToken,
    }
  }
  
  // 토큰 갱신
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload
      const userId = decoded.id
      
      // DB에서 Refresh Token 확인
      const token = await this.repository.findRefreshToken(refreshToken, userId)
      
      if (!token) {
        throw new Error('유효하지 않은 Refresh Token입니다.')
      }
      
      // 사용자 정보 가져오기
      const user = await this.repository.findAdminById(userId)
      
      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.')
      }
      
      // 새로운 Access Token 발급
      const newAccessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      )
      
      // Redis에 새 Access Token 저장
      await this.repository.saveAccessToken(user.id, newAccessToken)
      
      return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh Token이 만료되었습니다.')
      }
      throw error
    }
  }

  // 회원가입
  async signup(email: string, username: string, password: string) {
    // 이메일 중복 확인
    const existingUser = await this.repository.findAdminByEmail(email)
    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.')
    }
    
    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    // 사용자 생성
    const user = await this.repository.createUser(email, username, hashedPassword)
    
    return user
  }
}

// 싱글톤 인스턴스 생성
export const authService = new AuthService() 