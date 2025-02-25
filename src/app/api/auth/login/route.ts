import { cookies } from 'next/headers'
import pool from '@/lib/server/db'
import redis from '@/lib/server/redis'
import { RowDataPacket } from 'mysql2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from "@/types/api"
import { NextResponse } from 'next/server'
import { LoginRequest, LoginResponse, isValidLoginBody } from '@/types/api/auth'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret'

const ACCESS_TOKEN_EXPIRY = '1h'  // 1시간
const REFRESH_TOKEN_EXPIRY = '7d' // 7일

export async function POST(req: LoginRequest) {
    try {
        const body = await req.json()
        
        if (!isValidLoginBody(body)) {
            return createErrorResponse(
                ApiResponseCode.BAD_REQUEST,
                '잘못된 요청 형식입니다.'
            )
        }

        const { email, password } = body

        // 데이터베이스에서 admin 확인
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, email, username, password_hash, created_at FROM admin WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            // 찾은 사용자의 해시된 비밀번호와 입력된 비밀번호를 bcrypt로 비교
            const isValidPassword = await bcrypt.compare(password, rows[0].password_hash);

            if (isValidPassword) {
                const admin = rows[0];

                // Access Token 생성
                const accessToken = jwt.sign(
                    { 
                        id: admin.id,
                        email: admin.email,
                        username: admin.username
                    },
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: ACCESS_TOKEN_EXPIRY }
                );

                // Refresh Token 생성
                const refreshToken = jwt.sign(
                    { id: admin.id },
                    REFRESH_TOKEN_SECRET,
                    { expiresIn: REFRESH_TOKEN_EXPIRY }
                );

                // Refresh Token을 데이터베이스에 저장
                await pool.execute(
                    'INSERT INTO refresh_token (token, user_id, created_at, expires_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))',
                    [refreshToken, admin.id]
                );

                // Access Token을 Redis에 저장
                const redisKey = `access_token:${admin.id}`;
                await redis.set(redisKey, accessToken, 'EX', 3600); // 1시간 유효

                const response = createSuccessResponse<LoginResponse['data']>(
                    ApiResponseCode.SUCCESS,
                    "로그인 성공"
                );

                // 쿠키 설정
                const cookieStore = await cookies();
                
                // Access Token 쿠키 설정
                cookieStore.set('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 // 1시간
                });

                // Refresh Token 쿠키 설정
                cookieStore.set('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 // 7일
                });

                return response;
            }
        }

        return createErrorResponse(
            ApiResponseCode.UNAUTHORIZED,
            "이메일 또는 비밀번호가 올바르지 않습니다."
        );

    } catch (error) {
        console.error('Login error:', error);
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            "서버 오류가 발생했습니다.",
            error instanceof Error ? error.message : undefined
        );
    }
} 