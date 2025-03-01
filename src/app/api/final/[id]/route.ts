import { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from '@/types/api'
import { auth } from '@/lib/server/auth'
import { Shape, Color, Category } from '@/types/nail'
import { isValidGetFinalByIdParam } from '@/types/api/final'

// GET /api/final/:id
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    if (!isValidGetFinalByIdParam(id)) {
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        '유효하지 않은 ID입니다.'
      )
    }
    
    const numId = Number(id)

    // 인증 처리
    const admin = await auth()
    if (!admin) {
      return createErrorResponse(
        ApiResponseCode.UNAUTHORIZED,
        '인증이 필요합니다.'
      )
    }

    // 먼저 nail_tip에서 이미지 찾기
    const nailTip = await prisma.nail_tip.findUnique({
      where: { id: numId },
      select: {
        id: true,
        image_url: true,
        shape: true,
        color: true,
        category: true,
        checked_by: true,
        deleted_at: true,
        created_at: true
      }
    })

    if (nailTip) {
      // 사용자 정보 조회
      const user = nailTip.checked_by 
        ? await prisma.user.findUnique({
            where: { id: nailTip.checked_by },
            select: { nickname: true }
          })
        : null

      // 스크랩 정보 조회
      const scrap = await prisma.admin_scrap.findFirst({
        where: {
          admin_id: parseInt(admin.id),
          nail_tip_id: numId
        }
      })

      return createSuccessResponse(
        ApiResponseCode.SUCCESS,
        '네일 이미지 조회 성공',
        {
          nailDetail: {
            id: nailTip.id,
            src: nailTip.image_url,
            shape: nailTip.shape as Shape,
            color: nailTip.color as Color,
            category: nailTip.category as Category,
            checkedBy: user?.nickname || 'Unknown',
            isDeleted: nailTip.deleted_at !== null,
            isScraped: !!scrap,
            createdAt: nailTip.created_at.toISOString()
          }
        }
      )
    }

    return createErrorResponse(
      ApiResponseCode.NOT_FOUND,
      '이미지를 찾을 수 없습니다.'
    )
  } catch (error) {
    console.error('Final GET Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
}

// DELETE /api/final/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!isValidGetFinalByIdParam(id)) {
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        '유효하지 않은 ID입니다.'
      )
    }

    const numId = Number(id)

    // 인증 처리
    const admin = await auth()
    if (!admin) {
      return createErrorResponse(
        ApiResponseCode.UNAUTHORIZED,
        '인증이 필요합니다.'
      )
    }

    // 이미지가 존재하는지 확인
    const nailTip = await prisma.nail_tip.findUnique({
      where: { id: numId },
      select: { id: true }
    })

    if (!nailTip) {
      return createErrorResponse(
        ApiResponseCode.NOT_FOUND,
        '이미지를 찾을 수 없습니다.'
      )
    }

    // 논리적 삭제
    if (nailTip) {
      await prisma.nail_tip.update({
        where: { id: numId },
        data: {
          deleted_at: new Date(),
        }
      })
    }


    return createSuccessResponse(
      ApiResponseCode.SUCCESS,
      '이미지가 성공적으로 삭제되었습니다.'
    )
  } catch (error) {
    console.error('Final DELETE Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
} 