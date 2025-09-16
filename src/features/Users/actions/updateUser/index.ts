'use server'

import dayjs from 'dayjs'
import { revalidatePath } from 'next/cache'

import { pagesPath } from '@/libs'

import { updateUserRepo } from '../../repositories'
import { updateUserSchema, type UpdateUserSchemaType } from '../../schemas'
import type { UserStateType } from '../states'

export const updateUser = async (prevState: UserStateType, formData: FormData): Promise<UserStateType> => {
  const formatForm: UpdateUserSchemaType = {
    id: Number(formData.get('id')),
    name: formData.get('name') as string,
    url: formData.get('url') as string,
    phone1: formData.get('phone1') as string,
    phone2: formData.get('phone2') as string,
    phone3: formData.get('phone3') as string,
    email: formData.get('email') as string,
  }

  const validateResult = updateUserSchema.safeParse(formatForm)

  if (!validateResult.success) {
    const errors = validateResult.error.issues.map((error) => {
      const result = { [error.path.join('.')]: error.message }
      return result
    })

    const validateFailState: UserStateType = {
      success: validateResult.success,
      message: 'エラー項目があります',
      data: formatForm,
      errors: errors,
    }

    return validateFailState
  }

  const validateSuccessState: UserStateType = {
    success: validateResult.success,
    message: null,
    data: validateResult.data,
    errors: null,
  }

  const formatUser = {
    id: validateResult.data.id,
    name: validateResult.data.name,
    url: validateResult.data.url,
    phone: `${validateResult.data.phone1}-${validateResult.data.phone2}-${validateResult.data.phone3}`,
    email: validateResult.data.email,
    create_at: dayjs().toDate(),
    update_at: dayjs().toDate(),
  }

  try {
    const result = await updateUserRepo(formatUser)
    console.info('update user:', result)
    revalidatePath(pagesPath.users._id(formatUser.id).$url().path)
    revalidatePath(pagesPath.users.$url().path)
    return validateSuccessState
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
