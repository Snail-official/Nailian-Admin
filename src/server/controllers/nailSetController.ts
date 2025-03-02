import { NextRequest } from 'next/server'
import { auth } from '@/server/lib/auth'
import { nailSetService } from '@/server/services/nailSetService'
import { ApiResponseCode } from '@/types/api'
import { createSuccessResponse } from '@/server/lib/api-response'
import { 
  GetNailSetsResponse,
  GetNailSetResponse,
  CreateNailSetResponse,
  UpdateNailSetResponse,
  DeleteNailSetResponse,
  isValidCreateNailSetRequest,
  isValidUpdateNailSetRequest
} from '@/types/api/nail-set'
import { controllerHandler } from '@/server/utils/controllerUtils'

export class NailSetController {
  private service = nailSetService

  // GET /api/nail-set
  async getNailSets(req: NextRequest) {
    return controllerHandler(async () => {
      const folderId = req.nextUrl.searchParams.get('folderId')
      
      if (!folderId) {
        throw new Error('폴더 ID가 필요합니다.')
      }

      const nailsets = await this.service.getNailSetsByFolderId(parseInt(folderId))

      return createSuccessResponse<GetNailSetsResponse['data']>(
        ApiResponseCode.SUCCESS,
        '네일 세트 조회 성공',
        { nailsets }
      )
    }, '네일 세트 조회 중 오류가 발생했습니다.')
  }

  // GET /api/nail-set/:id
  async getNailSetById(req: NextRequest, { params }: { params: { id: string } }) {
    return controllerHandler(async () => {
      const id = parseInt(params.id)
      
      const nailset = await this.service.getNailSetById(id)

      return createSuccessResponse<GetNailSetResponse['data']>(
        ApiResponseCode.SUCCESS,
        '세트 조회 성공',
        { nailset }
      )
    }, '세트 조회 중 오류가 발생했습니다.')
  }

  // POST /api/nail-set
  async createNailSet(req: NextRequest) {
    return controllerHandler(async () => {
      const body = await req.json()
      
      if (!isValidCreateNailSetRequest(body)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const setId = await this.service.createNailSet(
        {
          thumb: body.thumb,
          index: body.index,
          middle: body.middle,
          ring: body.ring,
          pinky: body.pinky
        },
        body.folderIds,
        parseInt(admin.id)
      )

      return createSuccessResponse<CreateNailSetResponse['data']>(
        ApiResponseCode.CREATED,
        '네일 세트가 생성되었습니다.',
        { id: setId }
      )
    }, '네일 세트 생성 중 오류가 발생했습니다.')
  }

  // PUT /api/nail-set/:id
  async updateNailSet(req: NextRequest, { params }: { params: { id: string } }) {
    return controllerHandler(async () => {
      const body = await req.json()
      
      if (!isValidUpdateNailSetRequest(body)) {
        throw new Error('잘못된 요청 형식입니다.')
      }

      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const id = parseInt(params.id)
      
      await this.service.updateNailSet(id, {
        thumb: body.thumb,
        index: body.index,
        middle: body.middle,
        ring: body.ring,
        pinky: body.pinky
      })

      return createSuccessResponse<UpdateNailSetResponse['data']>(
        ApiResponseCode.SUCCESS,
        '세트가 수정되었습니다.',
        { id }
      )
    }, '세트 수정 중 오류가 발생했습니다.')
  }

  // DELETE /api/nail-set/:id
  async deleteNailSet(req: NextRequest, { params }: { params: { id: string } }) {
    return controllerHandler(async () => {
      const admin = await auth()
      if (!admin) {
        throw new Error('인증이 필요합니다.')
      }

      const id = parseInt(params.id)
      
      await this.service.deleteNailSet(id)

      return createSuccessResponse<DeleteNailSetResponse['data']>(
        ApiResponseCode.SUCCESS,
        '세트가 삭제되었습니다.'
      )
    }, '세트 삭제 중 오류가 발생했습니다.')
  }
}

// 싱글톤 인스턴스 생성
export const nailSetController = new NailSetController() 