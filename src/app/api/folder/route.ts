import { NextRequest } from 'next/server'
import { createSuccessResponse, createErrorResponse } from '@/lib/server/api-response'
import { ApiResponseCode } from '@/types/api'
import { prisma } from '@/lib/server/prisma'
import { 
  isValidGetFoldersRequest, 
  isValidCreateFolderRequest, 
  Folder,
  GetFoldersResponse
} from '@/types/api/folder'
import { auth } from '@/lib/server/auth'

// GET /api/folder
export async function GET(req: NextRequest) {
  try {
    if (!isValidGetFoldersRequest(req)) {
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        '잘못된 요청 형식입니다.'
      )
    }

    const folders = await prisma.nail_folder.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return createSuccessResponse<GetFoldersResponse['data']>(
      ApiResponseCode.SUCCESS,
      '폴더 목록 조회 성공',
      { folders }
    )
  } catch (error) {
    console.error('Folder GET Error:', error)
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
}

// POST /api/folder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!isValidCreateFolderRequest(body)) {
      return createErrorResponse(
        ApiResponseCode.BAD_REQUEST,
        '잘못된 요청 형식입니다.'
      )
    }

    const admin = await auth()
    if (!admin) {
      return createErrorResponse(
        ApiResponseCode.UNAUTHORIZED,
        '인증이 필요합니다.'
      )
    }

    await prisma.nail_folder.create({
      data: {
        name: body.name
      }
    })

    return createSuccessResponse(
      ApiResponseCode.CREATED,
      '폴더가 생성되었습니다.'
    )
  } catch (error) {
    return createErrorResponse(
      ApiResponseCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    )
  }
} 