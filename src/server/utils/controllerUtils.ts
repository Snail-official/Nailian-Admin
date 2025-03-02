import { createErrorResponse } from '@/server/lib/api-response'
import { ApiResponseCode } from '@/types/api/response'

export async function controllerHandler<T>(
  handler: () => Promise<T>,
  errorMessage: string = '서버 오류가 발생했습니다.'
) {
  try {
    return await handler();
  } catch (error) {
    console.error(`Controller error: ${errorMessage}`, error);
    
    if (error instanceof Error) {
      // 인증 관련 에러
      if (error.message.includes('인증') || error.message.includes('토큰')) {
        return createErrorResponse(
          ApiResponseCode.UNAUTHORIZED,
          error.message
        );
      }
      
      // 일반적인 클라이언트 에러
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        error.message
      );
    }
    
    // 서버 내부 에러
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      errorMessage,
      error instanceof Error ? error.message : undefined
    );
  }
} 