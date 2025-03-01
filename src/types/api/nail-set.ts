import { ApiSuccessResponse, ApiResponse } from '../api'
import { NextRequest } from 'next/server'

// 공통 타입
export interface NailTip {
  tipId: number
  image: string
}

export interface NailSet {
  id: number
  uploadedBy: string
  createdAt: string
  thumb: NailTip
  index: NailTip
  middle: NailTip
  ring: NailTip
  pinky: NailTip
}

// GET /api/nailset
export interface GetNailSetsParams {
  folderId: string
}

export type GetNailSetsResponse = ApiSuccessResponse<{
  nailsets: NailSet[]
}>

// GET /api/nailset/:id
export type GetNailSetResponse = ApiSuccessResponse<{
  nailset: NailSet
}>

// POST /api/nailset
export interface CreateNailSetRequest {
  folderIds: number[]
  thumb: NailTip
  index: NailTip
  middle: NailTip
  ring: NailTip
  pinky: NailTip
}

export type CreateNailSetResponse = ApiSuccessResponse<{ 
  id: number 
}>

export function isValidCreateNailSetRequest(body: any): body is CreateNailSetRequest {
  return (
    Array.isArray(body?.folderIds) &&
    body.folderIds.every((id: any) => typeof id === 'number') &&
    body?.thumb?.tipId !== undefined &&
    body?.index?.tipId !== undefined &&
    body?.middle?.tipId !== undefined &&
    body?.ring?.tipId !== undefined &&
    body?.pinky?.tipId !== undefined
  )
}

// PUT /api/nailset/:id
export interface UpdateNailSetRequest {
  thumb: NailTip
  index: NailTip
  middle: NailTip
  ring: NailTip
  pinky: NailTip
}

export type UpdateNailSetResponse = ApiSuccessResponse<{
  id: number
}>

export function isValidUpdateNailSetRequest(body: any): body is UpdateNailSetRequest {
  return (
    body?.thumb?.tipId !== undefined &&
    body?.index?.tipId !== undefined &&
    body?.middle?.tipId !== undefined &&
    body?.ring?.tipId !== undefined &&
    body?.pinky?.tipId !== undefined
  )
}

// DELETE /api/nailset/:id
export type DeleteNailSetResponse = ApiSuccessResponse