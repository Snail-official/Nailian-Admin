import { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from '@/types/api'
import { auth } from '@/lib/server/auth'

// 유효한 ID인지 검사하는 함수
function isValidGetFinalByIdParam(id: string | number): boolean {
  const numId = typeof id === 'string' ? Number(id) : id
  return !isNaN(numId) && numId > 0
}

// POST /api/final/:id/scrap
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id
    
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

    // 스크랩 정보 조회
    const existingScrap = await prisma.admin_scrap.findFirst({
      where: {
        admin_id: parseInt(admin.id),
        nail_tip_id: numId
      }
    })

    // 스크랩 토글 (있으면 삭제, 없으면 추가)
    if (existingScrap) {
      // 스크랩 삭제
      await prisma.admin_scrap.delete({
        where: { id: existingScrap.id }
      })
    } else {
      // 스크랩 추가
      await prisma.admin_scrap.create({
        data: {
          admin_id: parseInt(admin.id),
          nail_tip_id: numId
        }
      })
    }

    return createSuccessResponse(
      ApiResponseCode.SUCCESS,
      existingScrap ? '스크랩이 해제되었습니다.' : '스크랩이 추가되었습니다.'
    )
  } catch (error) {
    console.error('Final Scrap Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
}