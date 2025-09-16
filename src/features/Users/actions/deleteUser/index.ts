'use server'

import { revalidatePath } from 'next/cache'

import { pagesPath } from '@/libs'

import { deleteUserRepo } from '../../repositories'

export const deleteUser = async (id: number | undefined): Promise<{ isSuccess: boolean; path: string }> => {
  if (typeof id !== 'number' || isNaN(id)) {
    console.error('Validate Error - Id is not number type')
    throw new Error('Validate Error - Id is not number type')
  }

  try {
    const result = await deleteUserRepo(id)
    console.info('delete user:', result)
    revalidatePath(pagesPath.users.$url().path)
    return { isSuccess: true, path: pagesPath.users.$url().path }
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
