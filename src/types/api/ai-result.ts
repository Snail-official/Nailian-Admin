import { NextRequest } from 'next/server'
import { ApiSuccessResponse } from '../api'
import { Category, Color, Shape } from '../nail'

// 공통 타입
export interface AiResultImage {
    id: number
    src: string
    shape: Shape | null
    uploadedBy: string
    deletedBy?: string
    createdAt: string
}

export interface AiResultReview {
    id: number;    
    isDeleted: boolean;   
    category: Category | null;  
    color: Color | null;       
  }

// GET /api/ai-result
export function isValidGetAiResultRequest(req: NextRequest): boolean {
    const shape = req.nextUrl.searchParams.get('shape')
    return shape === null || typeof shape === 'string'
}

export type GetAiResultResponse = ApiSuccessResponse<{
    images: AiResultImage[]
}>

// POST /api/ai-result/upload
export interface UploadAiResultFormData {
    files: File[]
    shape: Shape | null
}

export interface UploadAiResultRequest extends NextRequest {
    formData(): Promise<FormData & {
        getAll(key: 'files'): File[]
        get(key: 'shape'): Shape | null
    }>
}

export function isValidUploadAiResultRequest(formData: FormData): boolean {
    try {
        const files = formData.getAll('files')
        const shape = formData.get('shape')

        return (
            files.length > 0 &&
            files.every(file => file instanceof File) &&
            (shape === null || typeof shape === 'string')
        )
    } catch {
        return false
    }
}

export type UploadAiResultResponse = ApiSuccessResponse

// POST /api/ai-result/review
export interface ReviewItem {
    id: number
    color: Color | null
    category: Category | null
    isDeleted: boolean
}

export interface ReviewAiResultBody {
    reviews: ReviewItem[]
}

export interface ReviewAiResultRequestBody {
    reviews: {
        id: number
        isDeleted: boolean
        category?: Category
        color?: Color
    }[]
}

export interface ReviewAiResultRequest extends NextRequest {
    json(): Promise<ReviewAiResultRequestBody>
}

export function isValidReviewAiResultRequest(body: ReviewAiResultRequestBody): boolean {
    return (
        Array.isArray(body.reviews) &&
        body.reviews.every(review => 
            typeof review.id === 'number' &&
            typeof review.isDeleted === 'boolean'
        )
    )
}

export type ReviewAiResultResponse = ApiSuccessResponse
