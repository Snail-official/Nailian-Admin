import { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from '@/types/api'
import { GetFinalsParams, GetFinalsResponse, NailImage, isValidDeleteFinalRequest, DeleteFinalRequest, isValidGetFinalsRequest } from '@/types/api/final'
import { Shape, Color, Category } from '@/types/nail'
import { auth } from '@/lib/server/auth'
import { nail_assets_asset_type, Prisma } from '@prisma/client'

// GET /api/final
export async function GET(req: NextRequest) {
  try {
    if (!isValidGetFinalsRequest(req)) {
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        '잘못된 요청 형식입니다.'
      )
    }

    // 인증 처리
    const admin = await auth()
    if (!admin) {
      return createErrorResponse(
        ApiResponseCode.UNAUTHORIZED,
        '인증이 필요합니다.'
      )
    }

    const searchParams = req.nextUrl.searchParams
    const shape = searchParams.get('shape') as Shape | null
    const color = searchParams.get('color') as Color | null
    const category = searchParams.get('category') as Category | null
    const viewMode = searchParams.get('viewMode') as GetFinalsParams['viewMode']

    // 결과를 저장할 배열
    let resultImages: NailImage[] = []

    const whereConditionsTip: Prisma.nail_tipWhereInput = {}

    // viewMode에 따라 조건 추가
    if (viewMode === 'scraped') {
      // 스크랩된 항목 필터링
      whereConditionsTip.deleted_at = null
      whereConditionsTip.admin_scrap = {
        some: {
          admin_id: parseInt(admin.id)
        }
      }
    } else if (viewMode === 'deleted') {
      // 삭제된 항목 필터링
      whereConditionsTip.deleted_at = { not: null }
    } else {
      // 기본: 삭제되지 않은 모든 항목
      whereConditionsTip.deleted_at = null
    }

     // 필터 조건 추가
     if (shape) whereConditionsTip.shape = shape
     if (color) whereConditionsTip.color = color
     if (category) whereConditionsTip.category = category

    const nailTips = await prisma.nail_tip.findMany({
      where: {
        AND: whereConditionsTip
      },
      select: {
        id: true,
        image_url: true,
        shape: true,
        color: true,
        category: true,
        created_at: true,
        checked_by: true,
        deleted_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // 사용자 정보 별도 조회 (nail_tip)
    const tipUserIds = [...new Set(nailTips.filter(tip => tip.checked_by).map(tip => tip.checked_by))]
    const tipUsers = tipUserIds.length > 0 ? await prisma.user.findMany({
      where: {
        id: {
          in: tipUserIds as number[]
        }
      },
      select: {
        id: true,
        nickname: true
      }
    }) : []

    // 사용자 정보 매핑 (nail_tip)
    const tipUserMap = new Map(tipUsers.map(user => [user.id, user.nickname]))

    // 네일 팁 ID 배열 생성
    const nailTipIds = nailTips.map(tip => tip.id)

    // 스크랩 정보 조회
    const scraps = await prisma.admin_scrap.findMany({
      where: {
        admin_id: parseInt(admin.id),
        nail_tip_id: {
          in: nailTipIds
        }
      },
      select: {
        nail_tip_id: true
      }
    })

    // 스크랩된 네일 팁 ID Set 생성
    const scrapedTipIds = new Set(scraps.map(scrap => scrap.nail_tip_id))

    // nail_tip 데이터 포맷팅 및 resultImages에 추가
    const formattedTips = nailTips.map(tip => ({
      id: tip.id,
      src: tip.image_url,
      shape: tip.shape as Shape,
      color: tip.color as Color,
      category: tip.category as Category,
      checkedBy: tipUserMap.get(tip.checked_by) || 'Unknown',
      isDeleted: tip.deleted_at !== null,
      isScraped: scrapedTipIds.has(tip.id), // 스크랩 여부 추가
      createdAt: tip.created_at.toISOString()
    }))

    resultImages.push(...formattedTips)

    // viewMode가 deleted이면 nail_assets에서도 삭제된 AI 생성 이미지를 가져옴
    if (viewMode === 'deleted') {
      // 단일 where 객체로 조건 구성
      const nailAssets = await prisma.nail_assets.findMany({
        where: {
          asset_type: nail_assets_asset_type.ai_generated, // enum 타입 사용
          deleted_at: { not: null },
          deleted_by: { not: null },
          ...(shape ? { shape: shape } : {})  // 조건부 속성 추가
        },
        select: {
          id: true,
          image_url: true,
          shape: true,
          created_at: true,
          uploaded_by: true,
          deleted_by: true
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      // 사용자 정보 별도 조회 (nail_assets)
      const assetUserIds = [
        ...new Set([
          ...nailAssets.map(asset => asset.uploaded_by),
          ...nailAssets.filter(asset => asset.deleted_by).map(asset => asset.deleted_by)
        ])
      ]

      const assetUsers = assetUserIds.length > 0 ? await prisma.user.findMany({
        where: {
          id: {
            in: assetUserIds as number[]
          }
        },
        select: {
          id: true,
          nickname: true
        }
      }) : []

      // 사용자 정보 매핑 (nail_assets)
      const assetUserMap = new Map(assetUsers.map(user => [user.id, user.nickname]))

      // nail_assets 데이터 포맷팅 및 resultImages에 추가
      const formattedAssets = nailAssets.map(asset => ({
        id: asset.id,
        src: asset.image_url,
        shape: asset.shape as Shape,
        uploadedBy: assetUserMap.get(asset.uploaded_by) || 'Unknown',
        deletedBy: asset.deleted_by ? assetUserMap.get(asset.deleted_by) || 'Unknown' : undefined,
        createdAt: asset.created_at.toISOString()
      }))

      console.log("formattedAssets", formattedAssets)
      resultImages.push(...formattedAssets)
    }

    // 생성일 기준 내림차순 정렬
    resultImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return createSuccessResponse<GetFinalsResponse['data']>(
      ApiResponseCode.SUCCESS,
      '네일 이미지 조회 성공',
      { images: resultImages }
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