import { NextRequest } from 'next/server'
import { auth } from '@/server/lib/auth'
import { finalService } from '@/server/services/finalService'
import { ApiResponseCode } from '@/types/api/response'
import { createSuccessResponse } from '@/server/lib/api-response'
import { 
  GetFinalByIdResponse,
  DeleteFinalResponse,
  RecoverFinalResponse,
  GetFinalsResponse,
  isValidGetFinalByIdParam,
  isValidGetFinalsRequest,
  ToggleScrapResponse
} from '@/types/api/final'
import { Shape, Color, Category } from '@/types/nail'
import { controllerHandler } from '@/server/utils/controllerUtils'

export class FinalController {
  private service = finalService

  // GET /api/final/:id
  async getFinalById(req: NextRequest, id: number) {
    return controllerHandler(async () => {
      if (isNaN(id) || id <= 0) {
        throw new Error('유효하지 않은 ID입니다.')
      }
      
      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }
      
      const nailDetail = await this.service.getFinalById(id, parseInt(admin.id))
      
      return createSuccessResponse<GetFinalByIdResponse['data']>(
        ApiResponseCode.SUCCESS,
        '네일 이미지 조회 성공',
        { nailDetail }
      )
    }, '네일 이미지 조회 중 오류가 발생했습니다.')
  }
  
  // DELETE /api/final/:id
  async deleteFinal(req: NextRequest, id: number) {
    return controllerHandler(async () => {
      if (isNaN(id) || id <= 0) {
        throw new Error('유효하지 않은 ID입니다.')
      }
      
      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }
      
      await this.service.deleteFinal(id)
      
      return createSuccessResponse<DeleteFinalResponse['data']>(
        ApiResponseCode.SUCCESS,
        '이미지가 성공적으로 삭제되었습니다.'
      )
    }, '이미지 삭제 중 오류가 발생했습니다.')
  }
  
  // POST /api/final/:id/recover
  async recoverFinal(req: NextRequest, id: number) {
    return controllerHandler(async () => {
      if (!isValidGetFinalByIdParam(id)) {
        throw new Error('유효하지 않은 ID입니다.')
      }
  
      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }
  
      await this.service.recoverFinal(id)
  
      return createSuccessResponse<RecoverFinalResponse['data']>(
        ApiResponseCode.SUCCESS,
        '네일이 성공적으로 복구되었습니다.'
      )
    }, '네일 복구 중 오류가 발생했습니다.')
  }
  
  // POST /api/final/:id/scrap
  async toggleScrap(req: NextRequest, id: number) {
    return controllerHandler(async () => {
      if (!isValidGetFinalByIdParam(id)) {
        throw new Error('유효하지 않은 ID입니다.')
      }
      
      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }
      
      const result = await this.service.toggleScrap(id, parseInt(admin.id))
      
      return createSuccessResponse<ToggleScrapResponse['data']>(
        ApiResponseCode.SUCCESS,
        result.isScraped ? '스크랩이 추가되었습니다.' : '스크랩이 해제되었습니다.'
      )
    }, '스크랩 처리 중 오류가 발생했습니다.')
  }
  
  // GET /api/final
  async getFinals(req: NextRequest) {
    return controllerHandler(async () => {
      if (!isValidGetFinalsRequest(req)) {
        throw new Error('잘못된 요청 형식입니다.')
      }
      
      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }
      
      const searchParams = req.nextUrl.searchParams
      const shape = searchParams.get('shape') as Shape | undefined
      const color = searchParams.get('color') as Color | undefined
      const category = searchParams.get('category') as Category | undefined
      const viewMode = searchParams.get('viewMode') as 'all' | 'scraped' | 'deleted' || 'all'
      
      const images = await this.service.getFinals({
        shape,
        color,
        category,
        viewMode,
        adminId: parseInt(admin.id)
      })
      
      return createSuccessResponse<GetFinalsResponse['data']>(
        ApiResponseCode.SUCCESS,
        '네일 이미지 조회 성공',
        { images }
      )
    }, '네일 이미지 조회 중 오류가 발생했습니다.')
  }
}

// 싱글톤 인스턴스 생성
export const finalController = new FinalController() 