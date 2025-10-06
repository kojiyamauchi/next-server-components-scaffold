import 'server-only'

import type { User } from '@prisma/client'

import { prisma } from '@/libs'

export const fetchUserRepo = async (id: number): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    include: {
      order: true,
    },
    where: {
      id: id,
    },
  })
  return result
}
