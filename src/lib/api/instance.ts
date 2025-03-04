import axios, { AxiosError, AxiosResponse } from 'axios'
import { ApiSuccessResponse, ApiResponseCode, ApiErrorResponse } from '@/types/api/response'
import { redirect } from 'next/navigation'

// 응답 타입
export interface ApiResponse<T> {
    code: ApiResponseCode
    message: string
    data?: T
    error?: {
        details?: string
    }
}

// API 에러 클래스
export class ApiError extends Error {
    constructor(
        public code: ApiResponseCode,
        message: string,
        public details?: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

// axios 인스턴스 생성
export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// 응답 인터셉터
api.interceptors.response.use(
    (response: AxiosResponse<ApiSuccessResponse<unknown>>) => {
        const { data } = response
        if (data.code !== ApiResponseCode.SUCCESS && data.code !== ApiResponseCode.CREATED) {
            throw new ApiError(
                ApiResponseCode.INTERNAL_ERROR,
                'Invalid response code'
            )
        }
        return {
            ...response,
            data: data.data
        }
    },
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
            const { code, message, error: responseError } = error.response.data

            // 401 Unauthorized 처리
            if (code === ApiResponseCode.UNAUTHORIZED) {
                redirect('/login')
            }

            throw new ApiError(code, message, responseError?.details)
        }
        
        throw new ApiError(
            ApiResponseCode.INTERNAL_ERROR,
            '서버와 통신 중 오류가 발생했습니다.',
            error.message
        )
    }
) 