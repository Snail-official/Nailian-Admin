import { api } from './instance'
import type {
  AiResultImage,
  GetAiResultResponse,
  UploadAiResultResponse,
  ReviewAiResultBody,
  ReviewAiResultResponse,
  UploadAiResultFormData
} from '@/types/api/ai-result'

export const aiResultApi = {
  getResults: async (shape: string | null): Promise<AiResultImage[]> => {
    const { data } = await api.get<GetAiResultResponse['data']>('/ai-result', {
      params: { shape }
    })
    return data?.images || []
  },

  uploadResults: async ({ files, shape }: UploadAiResultFormData): Promise<void> => {
    const formData = new FormData()
    files.forEach((file: File) => formData.append('files', file))
    if (shape) formData.append('shape', shape)

    await api.post<UploadAiResultResponse>('/ai-result/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  reviewResults: async (reviews: ReviewAiResultBody['reviews']): Promise<void> => {
    await api.post<ReviewAiResultResponse>('/ai-result/review', { reviews })
  }
}