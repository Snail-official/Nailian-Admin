import { NextRequest } from 'next/server'
import { auth } from '@/server/lib/auth'
import { aiResultService } from '@/server/services/aiResultService'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse } from '@/server/lib/api-response'
import {
  GetAiResultResponse,
  UploadAiResultResponse,
  ReviewAiResultResponse,
  isValidGetAiResultRequest,
  isValidUploadAiResultRequest,
  isValidReviewAiResultRequest
} from '@/types/api/ai-result'
import { Shape } from '@/types/nail'
import { controllerHandler } from '@/server/utils/controllerUtils'

export class AiResultController {
  private service = aiResultService

  // GET /api/ai-result
  async getAiResults(req: NextRequest) {
    return controllerHandler(async () => {
      if (!isValidGetAiResultRequest(req)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const shape = req.nextUrl.searchParams.get('shape') as Shape | null

      const images = await this.service.getAiResults(shape)

      return createSuccessResponse<GetAiResultResponse['data']>(
        ApiResponseCode.SUCCESS,
        '성공적으로 조회되었습니다.',
        { images }
      )
    }, 'AI 결과 조회 중 오류가 발생했습니다.')
  }

  // POST /api/ai-result/upload
  async uploadAiResults(req: NextRequest) {
    return controllerHandler(async () => {
      const formData = await req.formData()
      
      if (!isValidUploadAiResultRequest(formData)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const files = formData.getAll('files') as File[]
      const shape = formData.get('shape') as Shape

      await this.service.uploadAiResults(files, shape, parseInt(admin.id))

      return createSuccessResponse<UploadAiResultResponse['data']>(
        ApiResponseCode.CREATED,
        '성공적으로 업로드되었습니다.'
      )
    }, 'AI 결과 업로드 중 오류가 발생했습니다.')
  }

  // POST /api/ai-result/review
  async reviewAiResults(req: NextRequest) {
    return controllerHandler(async () => {
      const body = await req.json()
      
      if (!isValidReviewAiResultRequest(body)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      await this.service.reviewAiResults(body.reviews, parseInt(admin.id))

      return createSuccessResponse<ReviewAiResultResponse['data']>(
        ApiResponseCode.SUCCESS,
        '성공적으로 검토되었습니다.'
      )
    }, 'AI 결과 검토 중 오류가 발생했습니다.')
  }
}

// 싱글톤 인스턴스 생성
export const aiResultController = new AiResultController() 