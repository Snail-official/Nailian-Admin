import { folderController } from '@/server/controllers/folderController'
import { NextRequest } from 'next/server'


export async function DELETE(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/')
  const id = parts[parts.length - 1] // URL에서 ID 추출
  const numId = Number(id)

  return folderController.deleteFolder(req, numId)
}

export async function PUT(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/')
  const id = parts[parts.length - 1] // URL에서 ID 추출
  const numId = Number(id)

  return folderController.updateFolder(req, numId)
} 