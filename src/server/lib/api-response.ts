import 'server-only'    

import { NextResponse } from 'next/server'
import { ApiResponseCode, ApiSuccessResponse, ApiErrorResponse } from '@/types/api'

export function createSuccessResponse<T = null>(
    code: ApiResponseCode = ApiResponseCode.SUCCESS,
    message: string,
    data?: T
) {
    const response: ApiSuccessResponse<T> = {
        code,
        message,
        ...(data && { data })
    }
    
    return NextResponse.json(response, { status: code })
}

export function createErrorResponse(
    code: ApiResponseCode,
    message: string,
    details?: string
) {
    const response: ApiErrorResponse = {
        code,
        message,
        ...(details && { error: { details } })
    }
    
    return NextResponse.json(response, { status: code })
} 