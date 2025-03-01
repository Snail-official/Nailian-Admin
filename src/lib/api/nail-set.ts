import { api } from './instance'
import type {
  NailSet,
  GetNailSetsResponse,
  DeleteNailSetResponse,
  CreateNailSetRequest,
  CreateNailSetResponse,
  UpdateNailSetRequest,
  UpdateNailSetResponse,
  GetNailSetResponse
} from '@/types/api/nail-set'

export const nailSetApi = {
  // GET /api/nail-set
  getNailSets: async (folderId: string): Promise<NailSet[]> => {
    const { data } = await api.get<GetNailSetsResponse['data']>('/nail-set', {
      params: { folderId }
    })
    return data?.nailsets || []
  },

  // GET /api/nail-set/:id
  getNailSet: async (id: number): Promise<NailSet | null> => {
    const { data } = await api.get<GetNailSetResponse['data']>(`/nail-set/${id}`)
    return data?.nailset || null
  },

  // POST /api/nail-set
  createNailSet: async (requestBody: CreateNailSetRequest): Promise<number | null> => {
    const { data } = await api.post<CreateNailSetResponse['data']>('/nail-set', requestBody)
    return data?.id || null
  },

  // PUT /api/nail-set/:id
  updateNailSet: async (id: number, requestBody: UpdateNailSetRequest): Promise<number | null> => {
    const { data } = await api.put<UpdateNailSetResponse['data']>(`/nail-set/${id}`, requestBody)
    return data?.id || null
  },

  // DELETE /api/nail-set/:id
  deleteNailSet: async (id: number): Promise<void> => {
    await api.delete<DeleteNailSetResponse>(`/nail-set/${id}`)
  }
} 