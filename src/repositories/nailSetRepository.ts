import { prisma } from '@/lib/server/prisma'

export class NailSetRepository {
  // 폴더 ID로 네일 세트 조회
  async findByFolderId(folderId: number) {
    return prisma.nail_set.findMany({
      where: {
        nail_folder_set: {
          some: {
            folder_id: folderId
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
  }

  // ID로 네일 세트 조회
  async findById(id: number) {
    return prisma.nail_set.findUnique({
      where: { id },
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
  }

  // 네일 그룹 생성
  async createNailGroup(fingers: {
    thumb: number
    index: number
    middle: number
    ring: number
    pinky: number
  }) {
    return prisma.nail_group.create({
      data: {
        finger_thumb: fingers.thumb,
        finger_index: fingers.index,
        finger_middle: fingers.middle,
        finger_ring: fingers.ring,
        finger_pinky: fingers.pinky
      }
    })
  }

  // 네일 세트 생성
  async createNailSet(nailGroupId: number, userId: number) {
    return prisma.nail_set.create({
      data: {
        nail_group: {
          connect: {
            id: nailGroupId
          }
        },
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
  }

  // 네일 폴더 세트 생성
  async createNailFolderSet(setId: number, folderIds: number[]) {
    return prisma.nail_folder_set.createMany({
      data: folderIds.map(folderId => ({
        folder_id: folderId,
        set_id: setId
      }))
    })
  }

  // 네일 그룹 업데이트
  async updateNailGroup(groupId: number, fingers: {
    thumb: number
    index: number
    middle: number
    ring: number
    pinky: number
  }) {
    return prisma.nail_group.update({
      where: { id: groupId },
      data: {
        finger_thumb: fingers.thumb,
        finger_index: fingers.index,
        finger_middle: fingers.middle,
        finger_ring: fingers.ring,
        finger_pinky: fingers.pinky
      }
    })
  }

  // 네일 세트 삭제 (논리적 삭제)
  async deleteNailSet(id: number) {
    return prisma.nail_set.update({
      where: { id },
      data: { deleted_at: new Date() }
    })
  }

  // 네일 세트의 그룹 ID 조회
  async findNailGroupIdBySetId(setId: number) {
    const set = await prisma.nail_set.findUnique({
      where: { id: setId },
      select: { nail_group_id: true }
    })
    return set?.nail_group_id
  }
}

// 싱글톤 인스턴스 생성
export const nailSetRepository = new NailSetRepository() 