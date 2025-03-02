import { prisma } from '@/server/lib/prisma'
import { getRedisClient } from '@/server/lib/redis'

export class AuthRepository {
  // 이메일로 관리자 조회
  async findAdminByEmail(email: string) {
    const admin = await prisma.admin.findFirst({
      where: { 
        email,
        deleted_at: null
      },
      select: {
        id: true,
        email: true,
        username: true,
        password_hash: true,
        created_at: true
      }
    })
    
    return admin
  }

  // 사용자 ID로 관리자 조회
  async findAdminById(id: number) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true
      }
    })
    
    return admin
  }

  // 리프레시 토큰 저장
  async saveRefreshToken(token: string, userId: number, expiryDays: number = 7) {
    // 현재 시간과 만료 시간 계산
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(now.getDate() + expiryDays)
    
    await prisma.refresh_token.create({
      data: {
        token,
        user_id: userId,
        expires_at: expiresAt
      }
    })
  }

  // 리프레시 토큰 조회
  async findRefreshToken(token: string, userId: number) {
    const refreshToken = await prisma.refresh_token.findFirst({
      where: {
        token,
        user_id: userId,
        expires_at: {
          gt: new Date() // 현재 시간보다 만료 시간이 더 큰 경우 (아직 만료되지 않은 토큰)
        }
      }
    })
    
    return refreshToken
  }

  // 액세스 토큰을 Redis에 저장
  async saveAccessToken(userId: number, token: string, expirySeconds: number = 3600) {
    const redisKey = `access_token:${userId}`
    const redis = getRedisClient()
    await redis.set(redisKey, token, 'EX', expirySeconds)
  }

  // 새 사용자 생성 
  async createUser(email: string, username: string, hashedPassword: string) {
    // 트랜잭션 사용
    return prisma.$transaction(async (tx) => {
      // 1. user 테이블에 먼저 생성
      const user = await tx.user.create({
        data: {
          nickname: username,
          user_type: 'ADMIN',
          onboarding_steps_bitmask: 0
        }
      })

      // 2. admin 테이블에 생성
      await tx.admin.create({
        data: {
          id: user.id,
          email,
          username,
          password_hash: hashedPassword
        }
      })

      return {
        id: user.id,
        email,
        username
      }
    })
  }
}

// 싱글톤 인스턴스 생성
export const authRepository = new AuthRepository() 