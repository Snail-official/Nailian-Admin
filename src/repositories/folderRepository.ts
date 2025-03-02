import { prisma } from '@/lib/server/prisma'

export class FolderRepository {
  // 모든 폴더 조회
  async findAll() {
    return prisma.nail_folder.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  }

  // 폴더 생성
  async create(name: string) {
    return prisma.nail_folder.create({
      data: {
        name
      }
    })
  }

  // ID로 폴더 조회
  async findById(id: number) {
    return prisma.nail_folder.findUnique({
      where: { id }
    })
  }

  // 폴더 삭제
  async delete(id: number) {
    return prisma.nail_folder.delete({
      where: { id }
    })
  }

  // 폴더 이름 수정
  async update(id: number, name: string) {
    return prisma.nail_folder.update({
      where: { id },
      data: { name }
    })
  }
}

// 싱글톤 인스턴스 생성
export const folderRepository = new FolderRepository() 