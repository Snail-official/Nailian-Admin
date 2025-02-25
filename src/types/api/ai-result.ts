import { NextRequest } from 'next/server'
import { ApiSuccessResponse } from '../api'
import { Shape } from '../nail'

// 공통 타입
export interface AiResultImage {
    id: number
    src: string
    shape: Shape | null
    uploadedBy: string
    createdAt: string
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

export async function isValidUploadAiResultRequest(req: NextRequest): Promise<boolean> {
    try {
        const formData = await req.formData()
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
    color: string | null
    pattern: string | null
    isDeleted: boolean
}

export interface ReviewAiResultBody {
    reviews: ReviewItem[]
}

export interface ReviewAiResultRequest extends NextRequest {
    json(): Promise<ReviewAiResultBody>
}

export async function isValidReviewAiResultRequest(req: NextRequest): Promise<boolean> {
    try {
        const body = await req.json()
        return (
            Array.isArray(body.reviews) &&
            body.reviews.every((review: unknown) =>
                typeof review === 'object' &&
                review !== null &&
                'id' in review &&
                typeof (review as ReviewItem).id === 'number' &&
                ('color' in review ? typeof (review as ReviewItem).color === 'string' || (review as ReviewItem).color === null : true) &&
                ('pattern' in review ? typeof (review as ReviewItem).pattern === 'string' || (review as ReviewItem).pattern === null : true) &&
                'isDeleted' in review &&
                typeof (review as ReviewItem).isDeleted === 'boolean'
            )
        )
    } catch {
        return false
    }
}

export type ReviewAiResultResponse = ApiSuccessResponse

// DELETE /api/ai-result
export interface DeleteAiResultBody {
    ids: number[]
}

export async function isValidDeleteAiResultRequest(req: NextRequest): Promise<boolean> {
    try {
        const body = await req.json()
        return Array.isArray(body.ids) && body.ids.every((id: unknown): id is number => typeof id === 'number')
    } catch {
        return false
    }
}

export interface DeleteAiResultRequest extends NextRequest {
    json(): Promise<DeleteAiResultBody>
}

export type DeleteAiResultResponse = ApiSuccessResponse
