import { NextResponse } from 'next/server'
import pool from '@/lib/server/db'
import bcrypt from 'bcryptjs'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from "@/types/api"
import { SignupRequest, SignupResponse, isValidSignupRequest } from '@/types/api/auth'

export async function POST(req: SignupRequest) {
    try {
        if (!await isValidSignupRequest(req)) {
            return createErrorResponse(
                ApiResponseCode.BAD_REQUEST,
                '잘못된 요청 형식입니다.'
            )
        }

        const { email, password, username } = await req.json()

        // 이메일 중복 체크
        const [existingUsers] = await pool.execute(
            'SELECT id FROM admin WHERE email = ?',
            [email]
        )

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return createErrorResponse(
                ApiResponseCode.BAD_REQUEST,
                "이미 사용 중인 이메일입니다."
            )
        }

        // 비밀번호 해싱
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // 트랜잭션 시작
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. user 테이블에 먼저 생성
            const [userResult] = await connection.execute(
                'INSERT INTO user (nickname, user_type, created_at, onboarding_steps_bitmask) VALUES (?, "ADMIN", NOW(), 0)',
                [username]
            );
            const userId = (userResult as any).insertId;

            // 2. admin 테이블에 생성
            await connection.execute(
                'INSERT INTO admin (id, email, username, password_hash, created_at) VALUES (?, ?, ?, ?, NOW())',
                [userId, email, username, hashedPassword]
            );

            // 트랜잭션 커밋
            await connection.commit();
            connection.release();

            const user = {
                id: userId,
                email,
                username
            }

            return createSuccessResponse<SignupResponse['data']>(
                ApiResponseCode.CREATED,
                "회원가입이 완료되었습니다.",
                { user }
            )

        } catch (error) {
            // 에러 발생시 롤백
            await connection.rollback();
            connection.release();
            throw error;
        }

    } catch (error) {
        console.error('Signup error:', error);
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            "서버 오류가 발생했습니다.",
            error instanceof Error ? error.message : undefined
        );
    }
} 