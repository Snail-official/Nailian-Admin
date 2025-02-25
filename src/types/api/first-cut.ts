import { ApiSuccessResponse } from '../api'
import { NextRequest } from 'next/server'
import { Shape, SHAPES } from '../nail'

export interface FirstCutImage {
    id: number
    src: string
    shape: Shape | null
    uploadedBy: string
    createdAt: string
}

// GET /api/first-cut
export function isValidGetFirstCutRequest(req: NextRequest): boolean {
    const shape = req.nextUrl.searchParams.get('shape')
    return shape === null || typeof shape === 'string'
}

export type GetFirstCutResponse = ApiSuccessResponse<{
    images: FirstCutImage[]
}>

// POST /api/first-cut/upload
export interface UploadFirstCutFormData {
    files: File[]
    shape: Shape | null
}

export interface UploadFirstCutRequest extends NextRequest {
    formData(): Promise<FormData & {
        getAll(key: 'files'): File[]
        get(key: 'shape'): Shape | null
    }>
}

export async function isValidUploadFirstCutRequest(req: NextRequest): Promise<boolean> {
    try {
        const formData = await req.formData()
        const files = formData.getAll('files')
        const shape = formData.get('shape') as string | null

        return (
            files.length > 0 &&
            files.every(file => file instanceof File) &&
            (shape === null || SHAPES.includes(shape as Shape))
        )
    } catch {
        return false
    }
}

export type UploadFirstCutResponse = ApiSuccessResponse

// DELETE /api/first-cut
export interface DeleteFirstCutBody {
    ids: number[]
}

export interface DeleteFirstCutRequest extends NextRequest {
    json(): Promise<DeleteFirstCutBody>
}


export async function isValidDeleteFirstCutRequest(req: NextRequest): Promise<boolean> {
    try {
        const body = await req.json()
        return Array.isArray(body.ids) && body.ids.every((id: unknown) => typeof id === 'number')
    } catch {
        return false
    }
}

export type DeleteFirstCutResponse = ApiSuccessResponse 