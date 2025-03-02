import { NextRequest } from 'next/server'
import { auth } from '@/lib/server/auth'
import { folderService } from '@/services/folderService'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse } from '@/lib/server/api-response'
import { 
  GetFoldersResponse,
  CreateFolderResponse,
  isValidGetFoldersRequest,
  isValidCreateFolderRequest,
  isValidDeleteFolderRequest,
  DeleteFolderResponse,
  isValidUpdateFolderRequest,
  UpdateFolderResponse,

} from '@/types/api/folder'
import { controllerHandler } from '@/utils/controllerUtils'

export class FolderController {
  private service = folderService

  // GET /api/folder
  async getFolders(req: NextRequest) {
    return controllerHandler(async () => {
      if (!isValidGetFoldersRequest(req)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const folders = await this.service.getFolders()

      return createSuccessResponse<GetFoldersResponse['data']>(
        ApiResponseCode.SUCCESS,
        '폴더 목록 조회 성공',
        { folders }
      )
    }, '폴더 목록 조회 중 오류가 발생했습니다.')
  }

  // POST /api/folder
  async createFolder(req: NextRequest) {
    return controllerHandler(async () => {
      const body = await req.json()

      if (!isValidCreateFolderRequest(body)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      await this.service.createFolder(body.name)

      return createSuccessResponse<CreateFolderResponse['data']>(
        ApiResponseCode.CREATED,
        '폴더가 생성되었습니다.'
      )
    }, '폴더 생성 중 오류가 발생했습니다.')
  }

  // DELETE /api/folder/:id
  async deleteFolder(req: NextRequest, { params }: { params: { id: string } }) {
    return controllerHandler(async () => {
      if (!isValidDeleteFolderRequest(params)) {
        throw new Error('유효하지 않은 ID입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const id = Number(params.id)
      await this.service.deleteFolder(id)

      return createSuccessResponse<DeleteFolderResponse['data']>(
        ApiResponseCode.SUCCESS,
        '폴더가 삭제되었습니다.'
      )
    }, '폴더 삭제 중 오류가 발생했습니다.')
  }

  // PUT /api/folder/:id
  async updateFolder(req: NextRequest, { params }: { params: { id: string } }) {
    return controllerHandler(async () => {
      if (!isValidUpdateFolderRequest(params)) {
        throw new Error('유효하지 않은 ID입니다.')
      }

      const body = await req.json()
      if (!body.name || typeof body.name !== 'string') {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const id = Number(params.id)
      await this.service.updateFolder(id, body.name)

      return createSuccessResponse<UpdateFolderResponse['data']>(
        ApiResponseCode.SUCCESS,
        '폴더 이름이 수정되었습니다.'
      )
    }, '폴더 수정 중 오류가 발생했습니다.')
  }
}

// 싱글톤 인스턴스 생성
export const folderController = new FolderController() 