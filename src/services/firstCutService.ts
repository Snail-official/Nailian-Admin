import { firstCutRepository } from '@/repositories/firstCutRepository'
import { uploadToS3 } from '@/lib/server/s3'
import { Shape } from '@/types/nail'
import { FirstCutImage } from '@/types/api/first-cut'

export class FirstCutService {
  private repository = firstCutRepository

  // 이미지 조회
  async getFirstCuts(shape: Shape | null) {
    const assets = await this.repository.findMany({
      shape: shape || undefined
    })

    // 응답 형식으로 변환
    const images: FirstCutImage[] = assets.map(asset => ({
      id: asset.id,
      src: asset.image_url,
      shape: asset.shape as Shape,
      uploadedBy: asset.user_nail_assets_uploaded_byTouser?.nickname || 'Unknown',
      createdAt: asset.created_at.toISOString()
    }))

    return images
  }

  // 이미지 업로드
  async uploadFirstCuts(files: File[], shape: Shape, adminId: number) {
    const uploadPromises = files.map(async (file) => {
      const imageUrl = await uploadToS3(file)
      return this.repository.create({
        shape,
        imageUrl,
        uploadedBy: adminId
      })
    })

    await Promise.all(uploadPromises)
    return true
  }

  // 이미지 다운로드 상태 업데이트
  async updateDownloadStatus(ids: number[]) {
    await this.repository.updateDownloadStatus(ids)
    
    const assets = await this.repository.findByIds(ids)
    return assets.map(asset => asset.image_url)
  }

  // 이미지 삭제
  async deleteFirstCuts(ids: number[]) {
    await this.repository.deleteMany(ids)
    return true
  }
}

// 싱글톤 인스턴스 생성
export const firstCutService = new FirstCutService() 