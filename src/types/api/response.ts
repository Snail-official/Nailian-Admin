export enum ApiResponseCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
}

// 기본 응답 타입
export interface ApiResponse {
  code: ApiResponseCode;
  message: string;
}

// 성공 응답 타입
export interface ApiSuccessResponse<T = null> extends ApiResponse {
  data?: T;
}

// 실패 응답 타입
export interface ApiErrorResponse extends ApiResponse {
  error?: {
    details?: string;
  };
} 