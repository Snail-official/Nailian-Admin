import { prisma } from '@/server/lib/prisma'
import { Shape, Category, Color } from '@/types/nail'
import { Prisma } from '@prisma/client'

export class AiResultRepository {
  // AI 결과 이미지 조회
  async findMany(params: {
    shape?: Shape
  }) {
    return prisma.nail_assets.findMany({
      where: {
        asset_type: 'ai_generated',
        shape: params.shape || undefined,
        deleted_at: null
      },  
      select: {
        id: true,
        image_url: true,
        shape: true,
        created_at: true,
        user_nail_assets_uploaded_byTouser: {
          select: {
            nickname: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  }

  // ID로 이미지 조회
  async findById(id: number) {
    return prisma.nail_assets.findUnique({
      where: { 
        id,
        asset_type: 'ai_generated'
      }
    })
  }

  // 이미지 생성
  async create(data: {
    imageUrl: string
    shape: Shape
    uploadedBy: number
  }) {
    return prisma.nail_assets.create({
      data: {
        image_url: data.imageUrl,
        shape: data.shape,
        asset_type: 'ai_generated',
        uploaded_by: data.uploadedBy,
        is_downloaded: false,
      }
    })
  }

  // 이미지 삭제 (논리적 삭제)
  async delete(id: number, deletedBy: number) {
    return prisma.nail_assets.update({
      where: {
        id,
        asset_type: 'ai_generated'
      },
      data: {
        deleted_at: new Date(),
        deleted_by: deletedBy
      }
    })
  }

  // 네일 팁 생성
  async createNailTip(data: {
    imageUrl: string
    shape: Shape
    category: Category
    color: Color
    checkedBy: number
  }) {
    return prisma.nail_tip.create({
      data: {
        image_url: data.imageUrl,
        shape: data.shape,
        category: data.category,
        color: data.color,
        checked_by: data.checkedBy
      }
    })
  }

  // 트랜잭션 실행
  async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return prisma.$transaction(callback)
  }
}

// 싱글톤 인스턴스 생성
export const aiResultRepository = new AiResultRepository() 