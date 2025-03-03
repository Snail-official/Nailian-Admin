import { ApiSuccessResponse } from './response'
import { NextRequest } from 'next/server'
import { Shape, SHAPES } from '../nail'

export interface FirstCutImage {
    id: number
    src: string
    shape: Shape | null
    uploadedBy: string
    createdAt: string
    isDownloaded: boolean
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

export function isValidUploadFirstCutRequest(formData: FormData): boolean {
    const files = formData.getAll('files')
    const shape = formData.get('shape') as string | null

    return (
        files.length > 0 &&
        files.every(file => file instanceof File) &&
        (!!shape && Object.values(SHAPES).includes(shape as Shape))
    )
}

export type UploadFirstCutResponse = ApiSuccessResponse

// DELETE /api/first-cut
export interface DeleteFirstCutRequestBody {
    ids: number[]
}

export function isValidDeleteFirstCutRequest(body: DeleteFirstCutRequestBody): boolean {
    return Array.isArray(body.ids) && body.ids.length > 0 && body.ids.every(id => typeof id === 'number')
}

export type DeleteFirstCutResponse = ApiSuccessResponse

// POST /api/first-cut/download
export interface DownloadFirstCutRequestBody {
    ids: number[]
}

export interface DownloadFirstCutRequest extends NextRequest {
    json(): Promise<DownloadFirstCutRequestBody>
}

export function isValidDownloadFirstCutRequest(body: DownloadFirstCutRequestBody): boolean {
    return Array.isArray(body.ids) && body.ids.length > 0 && body.ids.every(id => typeof id === 'number')
}

export type DownloadFirstCutResponse = ApiSuccessResponse<{
    urls: string[]
}> 