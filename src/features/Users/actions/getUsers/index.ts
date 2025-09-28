'use server'

import { User } from '@prisma/client'

import { fetchUsersRepo } from '../../repositories'

export const getUsersAction = async (): Promise<User[]> => {
  try {
    const users = await fetchUsersRepo()
    return users
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
