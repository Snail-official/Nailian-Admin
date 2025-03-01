import { NextRequest } from 'next/server'
import { auth } from '@/lib/server/auth'
import { prisma } from '@/lib/server/prisma'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { RecoverFinalResponse, isValidGetFinalByIdParam } from '@/types/api/final'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await auth()
    if (!admin) {
      return createErrorResponse(
        ApiResponseCode.UNAUTHORIZED,
        '인증이 필요합니다.'
      )
    }

    const id = parseInt(params.id)
    
    if (!isValidGetFinalByIdParam(id)) {
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        '유효한 ID가 필요합니다.'
      )
    }

    // 네일 팁 존재 여부 확인
    const nailTip = await prisma.nail_tip.findUnique({
      where: { id }
    })

    if (!nailTip) {
      return createErrorResponse(
        ApiResponseCode.NOT_FOUND,
        '네일 팁을 찾을 수 없습니다.'
      )
    }

    // 이미 복구된 상태인지 확인
    if (nailTip.deleted_at === null) {
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        '이미 복구된 네일 팁입니다.'
      )
    }

    // 네일 팁 복구 (deleted_at 필드를 null로 설정)
    await prisma.nail_tip.update({
      where: { id },
      data: { 
        deleted_at: null,
      }
    })

    return createSuccessResponse<RecoverFinalResponse['data']>(
      ApiResponseCode.SUCCESS,
      '네일이 성공적으로 복구되었습니다.'
    )
  } catch (error) {
    console.error('Final recover error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
} 