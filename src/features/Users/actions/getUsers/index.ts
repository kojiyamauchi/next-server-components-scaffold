'use server'

import { User } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { pagesPath } from '@/libs'

import { fetchUsersRepo } from '../../repositories'

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await fetchUsersRepo()
    revalidatePath(pagesPath.users.$url().path)
    return users
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
