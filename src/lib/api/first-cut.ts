import { api } from './instance'
import type {
  FirstCutImage,
  GetFirstCutResponse,
  UploadFirstCutFormData,
  UploadFirstCutResponse,
  DeleteFirstCutRequestBody,
  DeleteFirstCutResponse,
  DownloadFirstCutRequestBody,
  DownloadFirstCutResponse
} from '@/types/api/first-cut'

export const firstCutApi = {
  getFirstCuts: async (shape: string | null): Promise<FirstCutImage[]> => {
    const { data } = await api.get<GetFirstCutResponse['data']>('/first-cut', {
      params: { shape }
    })
    return data?.images || []
  },

  uploadFirstCuts: async ({ files, shape }: UploadFirstCutFormData): Promise<void> => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    if (shape) formData.append('shape', shape)

    await api.post<UploadFirstCutResponse>('/first-cut/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteFirstCuts: async (ids: number[]): Promise<void> => {
    await api.delete<DeleteFirstCutResponse>('/first-cut', {
      data: { ids } satisfies DeleteFirstCutRequestBody
    })
  },

  downloadFirstCuts: async (ids: number[]): Promise<string[]> => {
    const { data } = await api.post<DownloadFirstCutResponse['data']>('/first-cut/download', {
      ids
    } satisfies DownloadFirstCutRequestBody)
    return data?.urls || []
  }
} 