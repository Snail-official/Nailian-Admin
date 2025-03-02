import { prisma } from '@/lib/server/prisma'
import { Shape, Color, Category } from '@/types/nail'

export class FinalRepository {
  // ID로 네일 팁 조회
  async findNailTipById(id: number) {
    return prisma.nail_tip.findUnique({
      where: { id },
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
  }

  // 사용자 정보 조회
  async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { 
        id: true,
        nickname: true 
      }
    })
  }

  // 스크랩 정보 조회
  async findScrap(adminId: number, nailTipId: number) {
    return prisma.admin_scrap.findFirst({
      where: {
        admin_id: adminId,
        nail_tip_id: nailTipId
      }
    })
  }

  // 네일 팁 삭제 (논리적 삭제)
  async deleteNailTip(id: number) {
    return prisma.nail_tip.update({
      where: { id },
      data: {
        deleted_at: new Date()
      }
    })
  }

  // 네일 팁 복구
  async recoverNailTip(id: number) {
    return prisma.nail_tip.update({
      where: { id },
      data: {
        deleted_at: null
      }
    })
  }

  // 스크랩 추가
  async createScrap(adminId: number, nailTipId: number) {
    return prisma.admin_scrap.create({
      data: {
        admin_id: adminId,
        nail_tip_id: nailTipId
      }
    })
  }

  // 스크랩 삭제
  async deleteScrap(scrapId: number) {
    return prisma.admin_scrap.delete({
      where: { id: scrapId }
    })
  }

  // 여러 조건으로 네일 팁 조회
  async findNailTips(params: {
    shape?: Shape
    color?: Color
    category?: Category
    isDeleted?: boolean
    isScraped?: boolean
    adminId?: number
  }) {
    const whereConditions: any = {}
    
    if (params.shape) whereConditions.shape = params.shape
    if (params.color) whereConditions.color = params.color
    if (params.category) whereConditions.category = params.category
    
    if (params.isDeleted) {
      whereConditions.deleted_at = { not: null }
    } else if (params.isDeleted === false) {
      whereConditions.deleted_at = null
    }
    
    if (params.isScraped && params.adminId) {
      whereConditions.admin_scrap = {
        some: {
          admin_id: params.adminId
        }
      }
    }
    
    return prisma.nail_tip.findMany({
      where: whereConditions,
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
  }

  // 사용자 ID로 사용자 정보 조회 (배열)
  async findUsersByIds(userIds: number[]) {
    if (userIds.length === 0) return []
    
    return prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        nickname: true
      }
    })
  }

  // 삭제된 AI 자산 조회
  async findDeletedAiAssets(shape?: Shape) {
    return prisma.nail_assets.findMany({
      where: {
        asset_type: 'ai_generated',
        deleted_at: { not: null },
        deleted_by: { not: null },
        ...(shape ? { shape: shape } : {})
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
  }
}

// 싱글톤 인스턴스 생성
export const finalRepository = new FinalRepository() 