import { api } from './instance'
import type {
  ToggleScrapResponse,
  NailImage,
  DeleteFinalResponse,
  GetFinalByIdResponse,
  FinalImage
} from '@/types/api/final'
import { Shape, Color, Category } from '@/types/nail'

interface GetFinalsParams {
  shape: Shape | null
  color: Color | null
  category: Category | null
  viewMode: 'all' | 'deleted' | 'scraped'
}

// 응답 타입을 제네릭으로 정의
interface GetFinalsResponse<T> {
  data: {
    images: T[]
  }
}

export const finalApi = {
  getFinals: async <T extends NailImage | FinalImage>(
    params: GetFinalsParams
  ): Promise<T[]> => {
    const { data } = await api.get<GetFinalsResponse<T>['data']>('/final', { params })
    return data?.images
  },

  getFinalById: async (id: number): Promise<FinalImage | null> => {
    const { data } = await api.get<GetFinalByIdResponse['data']>(`/final/${id}`)
    return data?.nailDetail || null
  },

  deleteFinal: async (id: number): Promise<void> => {
    await api.delete<DeleteFinalResponse>(`/final/${id}`)
  },

  toggleScrap: async (id: number): Promise<void> => {
    await api.post<ToggleScrapResponse>(`/final/${id}/scrap`)
  }
} 