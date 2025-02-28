import { api } from './instance'
import type {
  GetFinalsParams,
  GetFinalsResponse,
  ToggleScrapResponse,
  NailImage,
  DeleteFinalResponse,
  GetFinalByIdResponse,
  FinalImage
} from '@/types/api/final'

export const finalApi = {
  getFinals: async (params: GetFinalsParams): Promise<NailImage[]> => {
    const { data } = await api.get<GetFinalsResponse['data']>('/final', { params })
    return data?.images || []
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