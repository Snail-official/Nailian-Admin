import { finalController } from '@/server/controllers/finalController'
import { NextRequest } from 'next/server'


// GET /api/final/:id
export async function GET(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/')
  const id = parts[parts.length - 1] // URL에서 ID 추출
  const numId = Number(id)

  return finalController.getFinalById(req, numId)
}

// DELETE /api/final/:id
export async function DELETE(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/')
  const id = parts[parts.length - 1] // URL에서 ID 추출
  const numId = Number(id)

  return finalController.deleteFinal(req, numId)
} 