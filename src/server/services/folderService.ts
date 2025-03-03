import { folderRepository } from '@/server/repositories/folderRepository'
import { Folder } from '@/types/api/folder'

export class FolderService {
  private repository = folderRepository

  // 모든 폴더 조회
  async getFolders(): Promise<Folder[]> {
    const folders = await this.repository.findAll()
    return folders.map(folder => ({
      id: folder.id,
      name: folder.name
    }))
  }

  // 폴더 생성
  async createFolder(name: string): Promise<void> {
    await this.repository.create(name)
  }

  // 폴더 삭제
  async deleteFolder(id: number): Promise<void> {
    const folder = await this.repository.findById(id)
    
    if (!folder) {
      throw new Error('폴더를 찾을 수 없습니다.')
    }
    
    await this.repository.delete(id)
  }

  // 폴더 이름 수정
  async updateFolder(id: number, name: string): Promise<void> {
    const folder = await this.repository.findById(id)
    
    if (!folder) {
      throw new Error('폴더를 찾을 수 없습니다.')
    }
    
    await this.repository.update(id, name)
  }
}

// 싱글톤 인스턴스 생성
export const folderService = new FolderService() 