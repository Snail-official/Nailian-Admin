import pool from '@/lib/server/db'
import redis from '@/lib/server/redis'
import { RowDataPacket } from 'mysql2'

export class AuthRepository {
  // 이메일로 관리자 조회
  async findAdminByEmail(email: string) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email, username, password_hash, created_at FROM admin WHERE email = ?',
      [email]
    )
    return rows.length > 0 ? rows[0] : null
  }

  // 사용자 ID로 관리자 조회
  async findAdminById(id: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email, username FROM admin WHERE id = ?',
      [id]
    )
    return rows.length > 0 ? rows[0] : null
  }

  // 리프레시 토큰 저장
  async saveRefreshToken(token: string, userId: number, expiryDays: number = 7) {
    await pool.execute(
      'INSERT INTO refresh_token (token, user_id, created_at, expires_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))',
      [token, userId, expiryDays]
    )
  }

  // 리프레시 토큰 조회
  async findRefreshToken(token: string, userId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM refresh_token WHERE token = ? AND user_id = ? AND expires_at > NOW()',
      [token, userId]
    )
    return rows.length > 0 ? rows[0] : null
  }

  // 액세스 토큰을 Redis에 저장
  async saveAccessToken(userId: number, token: string, expirySeconds: number = 3600) {
    const redisKey = `access_token:${userId}`
    await redis.set(redisKey, token, 'EX', expirySeconds)
  }

  // 새 사용자 생성 
  async createUser(email: string, username: string, hashedPassword: string) {
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // 1. user 테이블에 먼저 생성
      const [userResult] = await connection.execute(
        'INSERT INTO user (nickname, user_type, created_at, onboarding_steps_bitmask) VALUES (?, "ADMIN", NOW(), 0)',
        [username]
      )
      const userId = (userResult as any).insertId

      // 2. admin 테이블에 생성
      await connection.execute(
        'INSERT INTO admin (id, email, username, password_hash, created_at) VALUES (?, ?, ?, ?, NOW())',
        [userId, email, username, hashedPassword]
      )

      // 트랜잭션 커밋
      await connection.commit()
      connection.release()

      return {
        id: userId,
        email,
        username
      }
    } catch (error) {
      // 에러 발생시 롤백
      await connection.rollback()
      connection.release()
      throw error
    }
  }
}

// 싱글톤 인스턴스 생성
export const authRepository = new AuthRepository() 