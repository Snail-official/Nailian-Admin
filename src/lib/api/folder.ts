import { api } from './instance'
import type {
  Folder,
  GetFoldersResponse,
  CreateFolderResponse
} from '@/types/api/folder'

export const folderApi = {
  getFolders: async (): Promise<Folder[]> => {
    const { data } = await api.get<GetFoldersResponse['data']>('/folder')
    return data?.folders || []
  },

  createFolder: async (name: string): Promise<void> => {
    await api.post<CreateFolderResponse>('/folder', { name })
  }
}