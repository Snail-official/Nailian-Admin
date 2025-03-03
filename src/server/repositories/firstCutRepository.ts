import { prisma } from '@/server/lib/prisma'
import { Shape } from '@/types/nail'

export class FirstCutRepository {
  // 이미지 조회
  async findMany(params: {
    shape?: Shape
    deleted?: boolean
  }) {
    return prisma.nail_assets.findMany({
      where: {
        shape: params.shape || undefined,
        deleted_at: params.deleted ? { not: null } : null,
        asset_type: 'nukki'
      },
      include: {
        user_nail_assets_uploaded_byTouser: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  }

  // ID로 이미지 조회
  async findById(id: number) {
    return prisma.nail_assets.findUnique({
      where: { id }
    })
  }

  // 여러 ID로 이미지 조회
  async findByIds(ids: number[]) {
    return prisma.nail_assets.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true,
        image_url: true
      }
    })
  }

  // 이미지 생성
  async create(data: {
    shape: Shape
    imageUrl: string
    uploadedBy: number
  }) {
    return prisma.nail_assets.create({
      data: {
        shape: data.shape,
        asset_type: 'nukki',
        image_url: data.imageUrl,
        uploaded_by: data.uploadedBy,
        is_downloaded: false
      }
    })
  }

  // 여러 이미지 삭제 (논리적 삭제)
  async deleteMany(ids: number[]) {
    return prisma.nail_assets.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        deleted_at: new Date()
      }
    })
  }

  // 다운로드 상태 업데이트
  async updateDownloadStatus(ids: number[]) {
    return prisma.nail_assets.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        is_downloaded: true
      }
    })
  }
}

// 싱글톤 인스턴스 생성
export const firstCutRepository = new FirstCutRepository() 