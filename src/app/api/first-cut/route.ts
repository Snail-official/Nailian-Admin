import { NextRequest } from 'next/server'
import { auth } from '@/lib/server/auth'
import { prisma } from '@/lib/server/prisma'    
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { 
    GetFirstCutResponse, 
    DeleteFirstCutResponse,
    FirstCutImage,
    isValidGetFirstCutRequest,
    isValidDeleteFirstCutRequest,
} from '@/types/api/first-cut'
import { Shape } from '@/types/nail'
import { nail_assets } from '@prisma/client'

export async function GET(req: NextRequest) {
    try {
        if (!isValidGetFirstCutRequest(req)) {
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

        const assets = await prisma.nail_assets.findMany({
            where: {
                shape: shape || undefined,
                deleted_at: null,
                asset_type: 'nukki'
            },
            include: {
                user: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        const images: FirstCutImage[] = assets.map((asset: nail_assets & { user: { nickname: string | null } }) => ({
            id: asset.id,
            src: asset.image_url,
            shape: asset.shape,
            uploadedBy: asset.user.nickname || 'Unknown',
            createdAt: asset.created_at.toISOString()
        }))

        return createSuccessResponse<GetFirstCutResponse['data']>(
            ApiResponseCode.SUCCESS,
            '성공적으로 조회되었습니다.',
            { images }
        )
    } catch (error) {
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            '서버 오류가 발생했습니다.'
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json()
        
        if (!isValidDeleteFirstCutRequest(body)) {
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

        const { ids } = body

        await prisma.nail_assets.updateMany({
            where: {
                id: {
                    in: ids
                }
            },
            data: {
                deleted_at: new Date()
            }
        })

        return createSuccessResponse<DeleteFirstCutResponse['data']>(
            ApiResponseCode.SUCCESS,
            '성공적으로 삭제되었습니다.'
        )
    } catch (error) {
        console.error('First Cut DELETE Error:', error)
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            '서버 오류가 발생했습니다.'
        )
    }
} 