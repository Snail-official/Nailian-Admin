import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: [
      'query',
      'info',
      'warn',
      'error',
    ],
  })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
      ],
    })
  }
  prisma = global.prisma
  
}

export { prisma } 