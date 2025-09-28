'use server'

import dayjs from 'dayjs'

import { pagesPath } from '@/libs'

import { createUserRepo } from '../../repositories'
import { createUserSchema, type CreateUserSchemaType } from '../../schemas'
import type { CreateUserStateType } from '../states'

export const createUserAction = async (prevState: CreateUserStateType, formData: FormData): Promise<CreateUserStateType> => {
  const formatForm: CreateUserSchemaType = {
    name: formData.get('name') as string,
    url: formData.get('url') as string,
    phone1: formData.get('phone1') as string,
    phone2: formData.get('phone2') as string,
    phone3: formData.get('phone3') as string,
    email: formData.get('email') as string,
  }

  const validateResult = createUserSchema.safeParse(formatForm)

  if (!validateResult.success) {
    const errors = validateResult.error.issues.map((error) => {
      const result = { [error.path.join('.')]: error.message }
      return result
    })

    const validateFailState: CreateUserStateType = {
      success: validateResult.success,
      message: 'エラー項目があります',
      data: formatForm,
      errors: errors,
    }

    return validateFailState
  }

  const validateSuccessState: CreateUserStateType = {
    success: validateResult.success,
    message: null,
    data: validateResult.data,
    errors: null,
  }

  const formatUser = {
    name: validateResult.data.name,
    url: validateResult.data.url,
    phone: `${validateResult.data.phone1}-${validateResult.data.phone2}-${validateResult.data.phone3}`,
    email: validateResult.data.email,
    create_at: dayjs().toDate(),
    update_at: dayjs().toDate(),
  }

  try {
    const result = await createUserRepo(formatUser)
    console.info('create user:', result)
    return { ...validateSuccessState, createId: result.id, redirectPath: pagesPath.users._id(result.id).$url().path }
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
