import { NextRequest } from 'next/server'
import { folderController } from '@/controllers/folderController'

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return folderController.deleteFolder(req, context)
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return folderController.updateFolder(req, context)
} 