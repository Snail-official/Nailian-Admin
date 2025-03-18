import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ApiSuccessResponse, ApiResponseCode, ApiErrorResponse } from '@/types/api/response'
import { redirect } from 'next/navigation'

// Axios 설정 타입 확장
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

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
    // 쿠키를 요청에 포함하도록 설정
    withCredentials: true
})

// 토큰 재발급 요청 중인지 확인하는 플래그
let isRefreshing = false
// 토큰 재발급 대기 중인 요청들을 저장하는 배열
let refreshSubscribers: ((token: string) => void)[] = []

// 토큰 재발급 후 대기 중인 요청들을 처리하는 함수
const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token))
    refreshSubscribers = []
}

// 토큰 재발급을 기다리는 함수
const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback)
}

// 응답 인터셉터
api.interceptors.response.use(
    (response: AxiosResponse<ApiSuccessResponse<unknown>>) => {
        const { data } = response
        
        // SUCCESS나 CREATED가 아닌 다른 에러 코드 처리
        if (data.code !== ApiResponseCode.SUCCESS && data.code !== ApiResponseCode.CREATED) {
            throw new ApiError(
                data.code,
                data.message || 'Invalid response code'
            )
        }

        return {
            ...response,
            data: data.data
        }
    },
    async (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
            const { status } = error.response
            const { code, message, error: responseError } = error.response.data
            const originalRequest = error.config as ExtendedAxiosRequestConfig

            // 401 Unauthorized 처리
            if (status === 401 && originalRequest && !originalRequest._retry) {
                if (!isRefreshing) {
                    isRefreshing = true
                    originalRequest._retry = true

                    console.log('토큰 재발급 시작')
                    try {
                        // 토큰 재발급 요청 (withCredentials 명시적 설정)
                        await api.post('/auth/refresh', {}, { 
                            withCredentials: true 
                        })

                        // 대기 중인 요청들 처리
                        onRefreshed('') // 토큰 값은 쿠키에 있으므로 빈 문자열 전달
                        isRefreshing = false

                        // 모든 후속 요청에도 withCredentials 설정
                        originalRequest.withCredentials = true;
                        
                        // 실패했던 요청 재시도
                        return api(originalRequest)
                    } catch {
                        isRefreshing = false
                        refreshSubscribers = []
                        // 리프레시 토큰도 만료된 경우 로그인 페이지로 리다이렉트
                        redirect('/login')
                    }
                }

                // 토큰 재발급 중인 경우, 새로운 Promise 반환
                return new Promise(resolve => {
                    addRefreshSubscriber(() => {
                        resolve(api(originalRequest))
                    })
                })
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