import { NextResponse } from "next/server"
import pool from '@/lib/db'
import redis from '@/lib/redis'
import { RowDataPacket } from 'mysql2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret'

const ACCESS_TOKEN_EXPIRY = '1h'  // 1시간
const REFRESH_TOKEN_EXPIRY = '7d' // 7일

export async function POST(request: Request) {
    try {
        const body = await request.json()
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

                // 로그인 성공
                return NextResponse.json(
                    {
                        success: true,
                        message: "로그인 성공",
                        accessToken,
                        refreshToken,
                    },
                    { status: 200 }
                )
            }
        }

        // 로그인 실패
        return NextResponse.json(
            {
                success: false,
                message: "이메일 또는 비밀번호가 올바르지 않습니다.",
            },
            { status: 401 }
        )
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                message: "서버 오류가 발생했습니다.",
            },
            { status: 500 }
        )
    }
} 