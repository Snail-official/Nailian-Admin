import pool from '@/lib/server/db'
import redis from '@/lib/server/redis'
import jwt from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2'
import { cookies } from 'next/headers'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from "@/types/api"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret'
const ACCESS_TOKEN_EXPIRY = '1h'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get('refreshToken')?.value

        if (!refreshToken) {
            return createErrorResponse(
                ApiResponseCode.UNAUTHORIZED,
                "Refresh Token이 없습니다."
            )
        }

        try {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload
            const userId = decoded.id

            // DB에서 Refresh Token 확인
            const [tokens] = await pool.execute<RowDataPacket[]>(
                'SELECT * FROM refresh_token WHERE token = ? AND user_id = ? AND expires_at > NOW()',
                [refreshToken, userId]
            )

            if (tokens.length === 0) {
                return createErrorResponse(
                    ApiResponseCode.UNAUTHORIZED,
                    "유효하지 않은 Refresh Token입니다."
                )
            }

            // 사용자 정보 가져오기
            const [users] = await pool.execute<RowDataPacket[]>(
                'SELECT id, email, username FROM admin WHERE id = ?',
                [userId]
            )

            if (users.length === 0) {
                return createErrorResponse(
                    ApiResponseCode.UNAUTHORIZED,
                    "사용자를 찾을 수 없습니다."
                )
            }

            const user = users[0]

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
            const redisKey = `access_token:${user.id}`
            await redis.set(redisKey, newAccessToken, 'EX', 3600)

            const response = createSuccessResponse(
                ApiResponseCode.SUCCESS,
                "Access Token이 갱신되었습니다."
            );

            // 새로운 Access Token을 쿠키에 설정
            cookieStore.set('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60
            });

            return response;

        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return createErrorResponse(
                    ApiResponseCode.UNAUTHORIZED,
                    "Refresh Token이 만료되었습니다."
                )
            }
            throw error;
        }

    } catch (error) {
        console.error('Token refresh error:', error);
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            "토큰 갱신 중 오류가 발생했습니다.",
            error instanceof Error ? error.message : undefined
        );
    }
} 