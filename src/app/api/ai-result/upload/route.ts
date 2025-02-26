import { NextRequest } from 'next/server'
import { auth } from '@/lib/server/auth'
import { prisma } from '@/lib/server/prisma'
import { uploadToS3 } from '@/lib/server/s3'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import {
    UploadAiResultRequest,
    UploadAiResultResponse,
    isValidUploadAiResultRequest
} from '@/types/api/ai-result'
import { Shape } from '@/types/nail'

export async function POST(req: UploadAiResultRequest) {
    try {
        const formData = await req.formData()
        
        if (!isValidUploadAiResultRequest(formData)) {
            return createErrorResponse(
                ApiResponseCode.BAD_REQUEST,
                '잘못된 요청 형식입니다.'
            )
        }

        const admin = await auth()
        if (!admin) {
            return createErrorResponse(
                ApiResponseCode.UNAUTHORIZED,
                '인증이 필요합니다.'
            )
        }

        const files = formData.getAll('files')
        const shape = formData.get('shape') as Shape

        const uploadPromises = files.map(async (file) => {
            const url = await uploadToS3(file)
            return prisma.nail_assets.create({
                data: {
                    image_url: url,
                    shape: shape,
                    asset_type: 'ai_generated',
                    uploaded_by: parseInt(admin.id),
                    is_downloaded: false,
                }
            })
        })

        await Promise.all(uploadPromises)

        return createSuccessResponse<UploadAiResultResponse['data']>(
            ApiResponseCode.CREATED,
            '성공적으로 업로드되었습니다.'
        )
    } catch (error) {
        console.error('AI Result Upload Error:', error)
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            '서버 오류가 발생했습니다.',
            error instanceof Error ? error.message : '알 수 없는 오류'
        )
    }
} 