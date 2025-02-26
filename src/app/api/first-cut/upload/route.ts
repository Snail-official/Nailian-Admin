import { auth } from '@/lib/server/auth'
import { prisma } from '@/lib/server/prisma'
import { uploadToS3 } from '@/lib/server/s3'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { 
    UploadFirstCutRequest,
    UploadFirstCutResponse,
    isValidUploadFirstCutRequest
} from '@/types/api/first-cut'
import { Shape } from '@/types/nail'

export async function POST(req: UploadFirstCutRequest) {
    try {
        const formData = await req.formData()
        
        const files = formData.getAll('files')
        const shapeValue = formData.get('shape')
        
        if (!isValidUploadFirstCutRequest(formData)) {
            return createErrorResponse(
                ApiResponseCode.BAD_REQUEST,
                '잘못된 요청 형식입니다.'
            )
        }

        const shape = shapeValue as Shape

        const admin = await auth()
        if (!admin) {
            return createErrorResponse(
                ApiResponseCode.UNAUTHORIZED,
                '인증이 필요합니다.'
            )
        }

        const uploadPromises = files.map(async (file) => {
            const imageUrl = await uploadToS3(file)
            return prisma.nail_assets.create({
                data: {
                    shape: shape,
                    asset_type: 'nukki',
                    image_url: imageUrl,
                    uploaded_by: parseInt(admin.id),
                    is_downloaded: false
                }
            })
        })

        await Promise.all(uploadPromises)

        return createSuccessResponse<UploadFirstCutResponse['data']>(
            ApiResponseCode.CREATED,
            '성공적으로 업로드되었습니다.'
        )
    } catch (error) {
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            '서버 오류가 발생했습니다.',
        )
    }
} 