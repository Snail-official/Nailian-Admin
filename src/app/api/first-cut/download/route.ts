import { NextRequest } from 'next/server'
import { auth } from '@/lib/server/auth'
import { prisma } from '@/lib/server/prisma'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { 
    DownloadFirstCutRequest,
    DownloadFirstCutResponse,
    isValidDownloadFirstCutRequest 
} from '@/types/api/first-cut'

export async function POST(req: DownloadFirstCutRequest) {
    try {
        const body = await req.json()

        if (!isValidDownloadFirstCutRequest(body)) {
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
                is_downloaded: true
            }
        })

        const assets = await prisma.nail_assets.findMany({
            where: {
                id: {
                    in: ids
                }
            },
            select: {
                image_url: true
            }
        })

        return createSuccessResponse<DownloadFirstCutResponse['data']>(
            ApiResponseCode.SUCCESS,
            '다운로드 상태가 업데이트되었습니다.',
            {
                urls: assets.map(asset => asset.image_url)
            }
        )
    } catch (error) {
        console.error('First Cut Download Error:', error)
        return createErrorResponse(
            ApiResponseCode.INTERNAL_ERROR,
            '서버 오류가 발생했습니다.'
        )
    }
} 