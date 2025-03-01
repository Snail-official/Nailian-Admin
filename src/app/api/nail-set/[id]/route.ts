import { NextRequest } from 'next/server'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from '@/types/api'
import { prisma } from '@/lib/server/prisma'
import { DeleteNailSetResponse, GetNailSetResponse, isValidUpdateNailSetRequest, UpdateNailSetResponse } from '@/types/api/nail-set'
import { auth } from '@/lib/server/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const setId = parseInt(params.id)
    const set = await prisma.nail_set.findUnique({
      where: { id: setId },
      include: {
        user: true,
        nail_group: {
          include: {
            nail_tip_nail_group_finger_thumbTonail_tip: true,
            nail_tip_nail_group_finger_indexTonail_tip: true,
            nail_tip_nail_group_finger_middleTonail_tip: true,
            nail_tip_nail_group_finger_ringTonail_tip: true,
            nail_tip_nail_group_finger_pinkyTonail_tip: true,
          }
        }
      }
    })

    if (!set) {
      return createErrorResponse(
        ApiResponseCode.NOT_FOUND,
        '세트를 찾을 수 없습니다.'
      )
    }

    return createSuccessResponse<GetNailSetResponse['data']>(
      ApiResponseCode.SUCCESS,
      '세트 조회 성공',
      {
        nailset: {
          id: set.id,
          uploadedBy: set.user?.nickname || '관리자',
          createdAt: set.created_at.toISOString(),
          thumb: { 
            tipId: set.nail_group.finger_thumb, 
            image: set.nail_group.nail_tip_nail_group_finger_thumbTonail_tip.image_url 
          },
          index: { 
            tipId: set.nail_group.finger_index, 
            image: set.nail_group.nail_tip_nail_group_finger_indexTonail_tip.image_url 
          },
          middle: { 
            tipId: set.nail_group.finger_middle, 
            image: set.nail_group.nail_tip_nail_group_finger_middleTonail_tip.image_url 
          },
          ring: { 
            tipId: set.nail_group.finger_ring, 
            image: set.nail_group.nail_tip_nail_group_finger_ringTonail_tip.image_url 
          },
          pinky: { 
            tipId: set.nail_group.finger_pinky, 
            image: set.nail_group.nail_tip_nail_group_finger_pinkyTonail_tip.image_url 
          }
        }
      }
    )
  } catch (error) {
    console.error('Set GET Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
}
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    if (!isValidUpdateNailSetRequest(body)) {
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

    const setId = parseInt(params.id)

    // nail_set과 연결된 nail_group 업데이트
    const set = await prisma.nail_set.findUnique({
      where: { id: setId },
      select: { nail_group_id: true }
    })

    if (!set) {
      return createErrorResponse(
        ApiResponseCode.NOT_FOUND,
        '세트를 찾을 수 없습니다.'
      )
    }

    await prisma.nail_group.update({
      where: { id: set.nail_group_id },
      data: {
        finger_thumb: body.thumb.tipId,
        finger_index: body.index.tipId,
        finger_middle: body.middle.tipId,
        finger_ring: body.ring.tipId,
        finger_pinky: body.pinky.tipId
      }
    })

    return createSuccessResponse<UpdateNailSetResponse['data']>(
      ApiResponseCode.SUCCESS,
      '세트가 수정되었습니다.',
      { id: setId }
    )
  } catch (error) {
    console.error('Set PUT Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
}

export async function DELETE(
  request: NextRequest,
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

    const setId = parseInt(params.id)
    
    // 소프트 삭제 - delete_at 필드 업데이트
    await prisma.nail_set.update({
      where: { id: setId },
      data: { deleted_at: new Date() }
    })

    return createSuccessResponse<DeleteNailSetResponse['data']>(
      ApiResponseCode.SUCCESS,
      '세트가 삭제되었습니다.',
    )
  } catch (error) {
    console.error('Set DELETE Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
} 