import { firstCutService } from '@/services/firstCutService'
import { NextRequest } from 'next/server'
import { auth } from '@/lib/server/auth'

import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { 
  GetFirstCutResponse,
  UploadFirstCutResponse,
  DownloadFirstCutResponse,
  DeleteFirstCutResponse,
  isValidGetFirstCutRequest,
  isValidUploadFirstCutRequest,
  isValidDownloadFirstCutRequest,
  isValidDeleteFirstCutRequest
} from '@/types/api/first-cut'
import { Shape } from '@/types/nail'
import { controllerHandler } from '@/utils/controllerUtils'

export class FirstCutController {
  private service = firstCutService

  // GET /api/first-cut
  async getFirstCuts(req: NextRequest) {
    return controllerHandler(async () => {
      if (!isValidGetFirstCutRequest(req)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const shape = req.nextUrl.searchParams.get('shape') as Shape | null

      const images = await this.service.getFirstCuts(shape)

      return createSuccessResponse<GetFirstCutResponse['data']>(
        ApiResponseCode.SUCCESS,
        '성공적으로 조회되었습니다.',
        { images }
      )
    }, '이미지 조회 중 오류가 발생했습니다.')
  }

  // POST /api/first-cut/upload
  async uploadFirstCuts(req: NextRequest) {
    return controllerHandler(async () => {
      const formData = await req.formData()
      
      if (!isValidUploadFirstCutRequest(formData)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const files = formData.getAll('files') as File[]
      const shape = formData.get('shape') as Shape

      await this.service.uploadFirstCuts(files, shape, parseInt(admin.id))

      return createSuccessResponse<UploadFirstCutResponse['data']>(
        ApiResponseCode.CREATED,
        '성공적으로 업로드되었습니다.'
      )
    }, '이미지 업로드 중 오류가 발생했습니다.')
  }

  // POST /api/first-cut/download
  async downloadFirstCuts(req: NextRequest) {
    return controllerHandler(async () => {
      const body = await req.json()

      if (!isValidDownloadFirstCutRequest(body)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const { ids } = body

      const urls = await this.service.updateDownloadStatus(ids)

      return createSuccessResponse<DownloadFirstCutResponse['data']>(
        ApiResponseCode.SUCCESS,
        '다운로드 상태가 업데이트되었습니다.',
        { urls }
      )
    }, '다운로드 상태 업데이트 중 오류가 발생했습니다.')
  }

  // DELETE /api/first-cut
  async deleteFirstCuts(req: NextRequest) {
    return controllerHandler(async () => {
      const body = await req.json()
      
      if (!isValidDeleteFirstCutRequest(body)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const { ids } = body

      await this.service.deleteFirstCuts(ids)

      return createSuccessResponse<DeleteFirstCutResponse['data']>(
        ApiResponseCode.SUCCESS,
        '성공적으로 삭제되었습니다.'
      )
    }, '이미지 삭제 중 오류가 발생했습니다.')
  }
}

// 싱글톤 인스턴스 생성
export const firstCutController = new FirstCutController() 