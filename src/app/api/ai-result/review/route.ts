import { NextRequest } from 'next/server'
import { auth } from '@/lib/server/auth'
import { prisma } from '@/lib/server/prisma'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import {
    ReviewAiResultRequest,
    ReviewAiResultResponse,
    isValidReviewAiResultRequest
} from '@/types/api/ai-result'
import { Prisma } from '@prisma/client'

export async function POST(req: ReviewAiResultRequest) {
    try {
        const body = await req.json()
        
        if (!isValidReviewAiResultRequest(body)) {
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

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            for (const review of body.reviews) {
                if (review.isDeleted) {
                    // 삭제 처리
                    await tx.nail_assets.update({
                        where: {
                            id: review.id,
                            asset_type: 'ai_generated'
                        },
                        data: {
                            deleted_at: new Date(),
                            deleted_by: parseInt(admin.id)
                        }
                    })
                } else {
                    // 승인된 이미지 처리
                    const asset = await tx.nail_assets.findUnique({
                        where: {
                            id: review.id,
                            asset_type: 'ai_generated'
                        }
                    })

                    if (asset) {
                        // nail_tips로 이동
                        await tx.nail_tip.create({
                            data: {
                                image_url: asset.image_url,
                                shape: asset.shape,
                                category: review.category!,
                                color: review.color!,
                                checked_by: asset.uploaded_by
                            }
                        })

                        // 기존 asset 삭제 처리
                        await tx.nail_assets.update({
                            where: {
                                id: asset.id
                            },
                            data: {
                                deleted_at: new Date(),
                                deleted_by: null
                            }
                        })
                    }
                }
            }
        })

        return createSuccessResponse<ReviewAiResultResponse['data']>(
            ApiResponseCode.SUCCESS,
            '성공적으로 검토되었습니다.'
        )
    } catch (error) {
        console.error('AI Result Review Error:', error)
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            '서버 오류가 발생했습니다.',
            error instanceof Error ? error.message : '알 수 없는 오류'
        )
    }
} 