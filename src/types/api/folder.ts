import { ApiSuccessResponse } from '../api'
import { NextRequest } from 'next/server'

// 공통 타입
export interface Folder {
  id: string
  name: string
}

// GET /api/folder
export function isValidGetFoldersRequest(req: NextRequest): boolean {
  return true
}

export type GetFoldersResponse = ApiSuccessResponse<{
  folders: Folder[]
}>

// POST /api/folder
export interface CreateFolderBody {
  name: string
}

export interface CreateFolderRequest extends NextRequest {
  json(): Promise<CreateFolderBody>
}

export async function isValidCreateFolderRequest(req: NextRequest): Promise<boolean> {
  try {
    const body = await req.json()
    return typeof body.name === 'string' && body.name.length > 0
  } catch {
    return false
  }
}

export type CreateFolderResponse = ApiSuccessResponse