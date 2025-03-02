import { nailSetRepository } from '@/repositories/nailSetRepository'
import { NailSet, NailTip } from '@/types/api/nail-set'

export class NailSetService {
  private repository = nailSetRepository

  // 폴더 ID로 네일 세트 조회
  async getNailSetsByFolderId(folderId: number): Promise<NailSet[]> {
    const nailSets = await this.repository.findByFolderId(folderId)
    
    return nailSets.map(ns => ({
      id: ns.id,
      uploadedBy: ns.user?.nickname || '관리자',
      createdAt: ns.created_at.toISOString(),
      folderId: folderId,
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
  }

  // ID로 네일 세트 조회
  async getNailSetById(id: number): Promise<NailSet> {
    const set = await this.repository.findById(id)
    
    if (!set) {
      throw new Error('세트를 찾을 수 없습니다.')
    }
    
    return {
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

  // 네일 세트 생성
  async createNailSet(fingers: {
    thumb: NailTip
    index: NailTip
    middle: NailTip
    ring: NailTip
    pinky: NailTip
  }, folderIds: number[], userId: number): Promise<number> {
    // 1. nail_group 생성
    const nailGroup = await this.repository.createNailGroup({
      thumb: fingers.thumb.tipId,
      index: fingers.index.tipId,
      middle: fingers.middle.tipId,
      ring: fingers.ring.tipId,
      pinky: fingers.pinky.tipId
    })

    // 2. nail_set 생성
    const set = await this.repository.createNailSet(nailGroup.id, userId)

    // 3. nail_folder_set 생성
    if (folderIds.length > 0) {
      await this.repository.createNailFolderSet(set.id, folderIds)
    }

    return set.id
  }

  // 네일 세트 업데이트
  async updateNailSet(id: number, fingers: {
    thumb: NailTip
    index: NailTip
    middle: NailTip
    ring: NailTip
    pinky: NailTip
  }): Promise<number> {
    const groupId = await this.repository.findNailGroupIdBySetId(id)
    
    if (!groupId) {
      throw new Error('세트를 찾을 수 없습니다.')
    }
    
    await this.repository.updateNailGroup(groupId, {
      thumb: fingers.thumb.tipId,
      index: fingers.index.tipId,
      middle: fingers.middle.tipId,
      ring: fingers.ring.tipId,
      pinky: fingers.pinky.tipId
    })
    
    return id
  }

  // 네일 세트 삭제
  async deleteNailSet(id: number): Promise<void> {
    await this.repository.deleteNailSet(id)
  }
}

// 싱글톤 인스턴스 생성
export const nailSetService = new NailSetService() 