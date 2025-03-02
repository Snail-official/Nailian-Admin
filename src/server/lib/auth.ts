import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import redis from './redis'

export async function auth() {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('accessToken')?.value

        if (!accessToken) {
            return null
        }

        // JWT 토큰 검증
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
            id: string
            email: string
            username: string
        }

        // Redis에서 토큰 유효성 체크
        const redisKey = `access_token:${decoded.id}`
        const storedToken = await redis.get(redisKey)

        if (storedToken !== accessToken) {
            return null
        }

        return {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username
        }
    } catch {
        return null
    }
} 