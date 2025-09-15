import { PrismaClient } from '@prisma/client'

import { env } from '~/env'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

console.info('Boolean check:', env.NEXT_PUBLIC_STORYBOOK)
const createPrismaClient = ((): PrismaClient => {
  if (env.NEXT_PUBLIC_STORYBOOK === 'enable') {
    return {} as PrismaClient
  }

  return new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
})()

export const prisma = globalForPrisma.prisma ?? createPrismaClient

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
