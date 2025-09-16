'use server'

import { fetchUserRepo } from '../../repositories'
import type { UserSchemaType } from '../../schemas'

export const getUser = async (id: number): Promise<UserSchemaType | null> => {
  try {
    const user = await fetchUserRepo(id)

    if (!user) {
      return null
    }

    const [phone1, phone2, phone3] = user.phone.split('-') ?? []

    return {
      id: user.id,
      name: user.name,
      url: user.url,
      phone1: phone1,
      phone2: phone2,
      phone3: phone3,
      email: user.email,
      createAt: user.create_at,
      updateAt: user.update_at,
    }
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
