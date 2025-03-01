import { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from '@/types/api'
import { 
  isValidCreateNailSetRequest, 
  GetNailSetsResponse, 
  CreateNailSetResponse 
} from '@/types/api/nail-set'
import { auth } from '@/lib/server/auth'

export async function GET(req: NextRequest) {
  try {
    const folderId = req.nextUrl.searchParams.get('folderId')
    
    if (!folderId) {
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        '폴더 ID가 필요합니다.'
      )
    }


    const nailSets = await prisma.nail_set.findMany({
      where: {
        nail_folder_set: {
          some: {
            folder_id: parseInt(folderId)
          }
        },
        deleted_at: null
      },
      include: {
        user: true,
        nail_folder_set: true,
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


    const formattedNailsets = nailSets.map(ns => ({
      id: ns.id,
      uploadedBy: ns.user?.nickname || '관리자',
      createdAt: ns.created_at.toISOString(),
      folderId: parseInt(folderId),
      thumb: { 
        tipId: ns.nail_group.finger_thumb, 
        image: ns.nail_group.nail_tip_nail_group_finger_thumbTonail_tip.image_url 
      },
      index: { 
        tipId: ns.nail_group.finger_index, 
        image: ns.nail_group.nail_tip_nail_group_finger_indexTonail_tip.image_url 
      },
      middle: { 
        tipId: ns.nail_group.finger_middle, 
        image: ns.nail_group.nail_tip_nail_group_finger_middleTonail_tip.image_url 
      },
      ring: { 
        tipId: ns.nail_group.finger_ring, 
        image: ns.nail_group.nail_tip_nail_group_finger_ringTonail_tip.image_url 
      },
      pinky: { 
        tipId: ns.nail_group.finger_pinky, 
        image: ns.nail_group.nail_tip_nail_group_finger_pinkyTonail_tip.image_url 
      }
    }))

    return createSuccessResponse<GetNailSetsResponse['data']>(
      ApiResponseCode.SUCCESS,
      '네일 세트 조회 성공',
      { nailsets: formattedNailsets }
    )
  } catch (error) {
    console.error('Nail Set GET Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (!isValidCreateNailSetRequest(body)) {
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

    // 1. nail_group 생성
    const nailGroup = await prisma.nail_group.create({
      data: {
        finger_thumb: body.thumb.tipId,
        finger_index: body.index.tipId,
        finger_middle: body.middle.tipId,
        finger_ring: body.ring.tipId,
        finger_pinky: body.pinky.tipId
      }
    })

    // 2. nail_set 생성
    const adminId = Number(admin.id)
    const set = await prisma.nail_set.create({
      data: {
        nail_group: {
          connect: {
            id: nailGroup.id
          }
        },
        user: {
          connect: {
            id: adminId
          }
        }
      }
    })

    // 3. nail_folder_set 생성
    if (body.folderIds.length > 0) {
      await prisma.nail_folder_set.createMany({
        data: body.folderIds.map(folderId => ({
          folder_id: folderId,
          set_id: set.id
        }))
      })
    }

    return createSuccessResponse<CreateNailSetResponse['data']>(
      ApiResponseCode.CREATED,
      '네일 세트가 생성되었습니다.',
      { id: set.id }
    )
  } catch (error) {
    console.error('Nail Set POST Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
}