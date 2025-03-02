import { NextRequest } from 'next/server'
import { finalController } from '@/server/controllers/finalController'

// GET /api/final/:id
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return finalController.getFinalById(req, context)
}

// DELETE /api/final/:id
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return finalController.deleteFinal(req, context)
} 