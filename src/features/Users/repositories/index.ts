import 'server-only'

import type { User } from '@prisma/client'

import { prisma } from '@/libs'

export const fetchUsersRepo = async (): Promise<User[]> => {
  const result = await prisma.user.findMany({
    orderBy: {
      id: 'asc',
    },
    include: {
      order: true,
    },
  })
  return result
}

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

export const updateUserRepo = async (user: User): Promise<User> => {
  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  })
  return result
}

export const deleteUserRepo = async (id: number): Promise<User> => {
  const result = await prisma.user.delete({
    where: {
      id: id,
    },
  })
  return result
}

export const createUserRepo = async (user: Omit<User, 'id'>): Promise<User> => {
  const result = await prisma.user.create({
    data: user,
  })
  return result
}
