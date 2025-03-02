import { NextRequest } from 'next/server'
import { folderController } from '@/server/controllers/folderController'

// GET /api/folder
export async function GET(req: NextRequest) {
  return folderController.getFolders(req)
}

// POST /api/folder
export async function POST(req: NextRequest) {
  return folderController.createFolder(req)
} 