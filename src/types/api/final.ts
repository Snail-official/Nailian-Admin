import { ApiSuccessResponse } from '../api'
import { Shape, Color, Category, SHAPES, COLORS, CATEGORIES } from '../nail'
import { NextRequest } from 'next/server'

// 공통 타입
export interface FinalImage {
  id: number
  src: string
  shape: Shape
  color: Color
  pattern: Category
  isScraped: boolean
  isDeleted: boolean
  uploadedBy: string
  createdAt: string
}

// GET /api/final
export interface GetFinalsParams {
  shape: Shape | null
  color: Color | null
  pattern: Category | null
  viewMode: 'all' | 'deleted' | 'scraped'
}

export type GetFinalsResponse = ApiSuccessResponse<{
  images: FinalImage[]
}>

// DELETE /api/final
export interface DeleteFinalsBody {
  ids: number[]
}

export interface DeleteFinalsRequest extends NextRequest {
  json(): Promise<DeleteFinalsBody>
}

export type DeleteFinalsResponse = ApiSuccessResponse<void>

// POST /api/final/:id/scrap
export interface ToggleScrapRequest extends NextRequest {
  params: {
    id: string
  }
}

export type ToggleScrapResponse = ApiSuccessResponse<void>

export function isValidGetFinalsRequest(req: NextRequest): boolean {
  const viewMode = req.nextUrl.searchParams.get('viewMode')
  const shape = req.nextUrl.searchParams.get('shape')
  const color = req.nextUrl.searchParams.get('color')
  const pattern = req.nextUrl.searchParams.get('pattern')

  return (
    (!viewMode || ['all', 'deleted', 'scraped'].includes(viewMode)) &&
    (!shape || SHAPES.includes(shape as Shape)) &&
    (!color || COLORS.includes(color as Color)) &&
    (!pattern || CATEGORIES.includes(pattern as Category))
  )
}

export async function isValidDeleteFinalsRequest(req: DeleteFinalsRequest): Promise<boolean> {
  try {
    const body = await req.json()
    return (
      Array.isArray(body.ids) &&
      body.ids.length > 0 &&
      body.ids.every(id => typeof id === 'number')
    )
  } catch {
    return false
  }
} 