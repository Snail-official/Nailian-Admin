import { NextRequest } from 'next/server'
import { auth } from '@/lib/server/auth'
import { prisma } from '@/lib/server/prisma'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { GetAiResultResponse, isValidGetAiResultRequest } from '@/types/api/ai-result'
import { Shape } from '@/types/nail'

export async function GET(req: NextRequest) {
    try {
        if (!isValidGetAiResultRequest(req)) {
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

        const shape = req.nextUrl.searchParams.get('shape') as Shape | null

        const images = await prisma.nail_assets.findMany({
            where: {
                asset_type: 'ai_generated',
                shape: shape || undefined,
                deleted_at: null
            },  
            select: {
                id: true,
                image_url: true,
                shape: true,
                created_at: true,
                user: {
                    select: {
                        nickname: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        return createSuccessResponse<GetAiResultResponse['data']>(
            ApiResponseCode.SUCCESS,
            '성공적으로 조회되었습니다.',
            { 
                images: images.map(image => ({
                    id: image.id,
                    src: image.image_url,
                    shape: image.shape,
                    uploadedBy: image.user.nickname || 'Unknown',
                    createdAt: image.created_at.toISOString()
                }))
            }
        )
    } catch (error) {
        console.error('AI Result GET Error:', error)
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            '서버 오류가 발생했습니다.',
            error instanceof Error ? error.message : '알 수 없는 오류'
        )
    }
}