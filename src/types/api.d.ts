// api 관련 타입 선언
declare namespace API {
    // 공통 타입
    export interface ApiResponse {
        code: number
        message: string
    }     

    export interface ApiSuccessResponse<T> extends ApiResponse {
        data?: T
    }

    export interface ApiErrorResponse extends ApiResponse {
        error?: {
            details?: string
        }
    }
} 