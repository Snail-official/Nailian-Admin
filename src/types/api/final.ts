import { ApiSuccessResponse } from './response'
import { Shape, Color, Category, SHAPES, COLORS, CATEGORIES } from '../nail'
import { NextRequest } from 'next/server'
import { AiResultImage } from './ai-result'

// 공통 타입
export interface FinalImage {
  id: number
  src: string
  shape: Shape
  color: Color
  category: Category
  isScraped: boolean
  isDeleted: boolean
  checkedBy: string
  createdAt: string
}

// GET /api/final
export interface GetFinalsParams {
  shape: Shape | null
  color: Color | null
  category: Category | null
  viewMode: 'all' | 'deleted' | 'scraped'
}

export type NailImage = FinalImage | AiResultImage
export type GetFinalsResponse = ApiSuccessResponse<{
  images: NailImage[]
}>

export function isValidGetFinalsRequest(req: NextRequest): boolean {
  const viewMode = req.nextUrl.searchParams.get('viewMode')
  const shape = req.nextUrl.searchParams.get('shape')
  const color = req.nextUrl.searchParams.get('color')
  const category = req.nextUrl.searchParams.get('category')

  return (
    (!viewMode || ['all', 'deleted', 'scraped'].includes(viewMode)) &&
    (!shape || SHAPES.includes(shape as Shape)) &&
    (!color || COLORS.includes(color as Color)) &&
    (!category || CATEGORIES.includes(category as Category))
  )
}

// GET /api/final/:id
export interface GetFinalByIdParams {
  id: string
}

export type GetFinalByIdResponse = ApiSuccessResponse<{
  nailDetail: FinalImage
}>

export function isValidGetFinalByIdParam(id: string | number): boolean {
  const numId = typeof id === 'string' ? Number(id) : id
  return !isNaN(numId) && numId > 0
}

// DELETE /api/final
export interface DeleteFinalBody {
  id: number
}

export interface DeleteFinalRequest extends NextRequest {
  json(): Promise<DeleteFinalBody>
}

export type DeleteFinalResponse = ApiSuccessResponse<void>

export interface DeleteFinalRequestBody {
  id: number
}

// POST /api/final/:id/scrap
export interface ToggleScrapRequest extends NextRequest {
  params: {
    id: string
  }
}

export type ToggleScrapResponse = ApiSuccessResponse<void>

// POST /api/final/:id/recover
export interface RecoverFinalRequest extends NextRequest {
  params: {
    id: string
  }
}

export type RecoverFinalResponse = ApiSuccessResponse<void>