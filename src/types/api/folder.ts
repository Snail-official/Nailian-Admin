import { ApiSuccessResponse } from './response'
import { NextRequest } from 'next/server'

// 공통 타입
export interface Folder {
  id: number
  name: string
}

// GET /api/folder
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

export function isValidCreateFolderRequest(body: CreateFolderBody) {
  return typeof body.name === 'string' && body.name.length > 0
}

export type CreateFolderResponse = ApiSuccessResponse

// DELETE /api/folder/:id
export function isValidDeleteFolderRequest(id: number): boolean {
  return !isNaN(id) && id > 0
}

export type DeleteFolderResponse = ApiSuccessResponse

// PUT /api/folder/:id
export interface UpdateFolderBody {
  name: string
}

export function isValidUpdateFolderRequest(id: number): boolean {
  return !isNaN(id) && id > 0
}

export type UpdateFolderResponse = ApiSuccessResponse