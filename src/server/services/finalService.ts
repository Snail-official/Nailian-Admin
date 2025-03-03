import { finalRepository } from '@/server/repositories/finalRepository'
import { Shape, Color, Category } from '@/types/nail'
import { NailImage } from '@/types/api/final'
import { AiResultImage } from '@/types/api/ai-result'

export class FinalService {
  private repository = finalRepository

  // ID로 네일 팁 상세 조회
  async getFinalById(id: number, adminId: number) {
    const nailTip = await this.repository.findNailTipById(id)
    
    if (!nailTip) {
      throw new Error('이미지를 찾을 수 없습니다.')
    }
    
    const user = nailTip.checked_by 
      ? await this.repository.findUserById(nailTip.checked_by)
      : null
      
    const scrap = await this.repository.findScrap(adminId, id)
    
    return {
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
  
  // 네일 팁 삭제
  async deleteFinal(id: number) {
    const nailTip = await this.repository.findNailTipById(id)
    
    if (!nailTip) {
      throw new Error('이미지를 찾을 수 없습니다.')
    }
    
    await this.repository.deleteNailTip(id)
    return true
  }
  
  // 네일 팁 복구
  async recoverFinal(id: number) {
    const nailTip = await this.repository.findNailTipById(id)
    
    if (!nailTip) {
      throw new Error('네일 팁을 찾을 수 없습니다.')
    }
    
    if (nailTip.deleted_at === null) {
      throw new Error('이미 복구된 네일 팁입니다.')
    }
    
    await this.repository.recoverNailTip(id)
    return true
  }
  
  // 스크랩 토글
  async toggleScrap(nailTipId: number, adminId: number) {
    const nailTip = await this.repository.findNailTipById(nailTipId)
    
    if (!nailTip) {
      throw new Error('이미지를 찾을 수 없습니다.')
    }
    
    const existingScrap = await this.repository.findScrap(adminId, nailTipId)
    
    if (existingScrap) {
      await this.repository.deleteScrap(existingScrap.id)
      return { isScraped: false }
    } else {
      await this.repository.createScrap(adminId, nailTipId)
      return { isScraped: true }
    }
  }
  
  // 여러 조건으로 네일 팁 조회
async getFinals(params: {
    shape?: Shape
    color?: Color
    category?: Category
    viewMode?: 'all' | 'scraped' | 'deleted'
    adminId: number
  }) {
    const { shape, color, category, viewMode, adminId } = params
    
    const isDeleted = viewMode === 'deleted' ? true : false
    const isScraped = viewMode === 'scraped'
    
    let resultImages: NailImage[] = []
    
    // 네일 팁 조회
    const nailTips = await this.repository.findNailTips({
      shape,
      color,
      category,
      isDeleted,
      isScraped: isScraped,
      adminId: isScraped ? adminId : undefined
    })
    
    if (nailTips.length > 0) {
      // 사용자 정보 별도 조회
      const userIds = [...new Set(nailTips.filter(tip => tip.checked_by).map(tip => tip.checked_by))]
      const users = userIds.length > 0 
        ? await this.repository.findUsersByIds(userIds as number[])
        : []
        
      // 사용자 정보 매핑
      const userMap = new Map(users.filter(Boolean).map(user => [user.id, user.nickname]))
      
      // 스크랩 정보 조회
      const nailTipIds = nailTips.map(tip => tip.id)
      const scraps = await Promise.all(
        nailTipIds.map(id => this.repository.findScrap(adminId, id))
      )
      
      // 스크랩된 네일 팁 ID Set 생성
      const scrapedTipIds = new Set(
        scraps.filter(Boolean).map(scrap => scrap?.nail_tip_id)
      )
      
      // 결과 포맷팅
      resultImages = nailTips.map(tip => ({
        id: tip.id,
        src: tip.image_url,
        shape: tip.shape as Shape,
        color: tip.color as Color,
        category: tip.category as Category,
        checkedBy: tip.checked_by ? userMap.get(tip.checked_by) || 'Unknown' : 'Unknown',
        isDeleted: tip.deleted_at !== null,
        isScraped: scrapedTipIds.has(tip.id),
        createdAt: tip.created_at.toISOString()
      }))
    }
    
    // viewMode가 deleted이면 nail_assets에서도 삭제된 AI 생성 이미지를 가져옴
    if (viewMode === 'deleted') {
      const nailAssets = await this.repository.findDeletedAiAssets(shape)
      
      if (nailAssets.length > 0) {
        // 사용자 정보 별도 조회 (nail_assets)
        const assetUserIds = [
          ...new Set([
            ...nailAssets.filter(asset => asset.uploaded_by !== null).map(asset => asset.uploaded_by),
            ...nailAssets.filter(asset => asset.deleted_by !== null).map(asset => asset.deleted_by)
          ])
        ] as number[]
        
        const assetUsers = assetUserIds.length > 0
          ? await this.repository.findUsersByIds(assetUserIds)
          : []
          
        // 사용자 정보 매핑
        const assetUserMap = new Map(
          assetUsers.map(user => [user.id, user.nickname])
        )
        
        // AI 생성 이미지 결과 포맷팅 및 추가
        const assetImages : AiResultImage[] = nailAssets.map(asset => {
          return {
            id: asset.id,
            src: asset.image_url,
            shape: asset.shape as Shape,
            uploadedBy: assetUserMap.get(asset.uploaded_by) || '',
            deletedBy: asset.deleted_by ? assetUserMap.get(asset.deleted_by) || '' : '',
            isDeleted: true,
            isScraped: false,
            createdAt: asset.created_at.toISOString(),
          };
        });
        
        // 결과 합치기
        resultImages = [...resultImages, ...assetImages]
      }
    }
    
    // 생성일 기준 내림차순 정렬
    resultImages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return resultImages
  }
}

// 싱글톤 인스턴스 생성
export const finalService = new FinalService() 