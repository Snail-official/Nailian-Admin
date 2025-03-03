import { NextRequest } from 'next/server'
import { nailSetController } from '@/server/controllers/nailSetController'

export async function GET(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/')
  const id = parts[parts.length - 1] // URL에서 ID 추출
  const numId = Number(id)

  return nailSetController.getNailSetById(req, numId)
}

export async function PUT(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/')
  const id = parts[parts.length - 1] // URL에서 ID 추출
  const numId = Number(id)

  return nailSetController.updateNailSet(req, numId)
}

export async function DELETE(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/')
  const id = parts[parts.length - 1] // URL에서 ID 추출
  const numId = Number(id)

  return nailSetController.deleteNailSet(req, numId)
} 