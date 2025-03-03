import { NextRequest } from 'next/server'
import { authController } from '@/server/controllers/authController'

export async function POST(req: NextRequest) {
  return authController.signup(req)
} 