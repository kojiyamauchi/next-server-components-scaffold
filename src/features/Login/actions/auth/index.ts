'use server'

import type { AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js'

import { pagesPath, supabaseServerClient } from '@/libs'

import { authSchema, type AuthSchemaType } from '../../schemas'
import { AuthStateType } from '../state'

export const authAction = async (prevState: AuthStateType, formData: FormData): Promise<AuthStateType> => {
  const supabase = await supabaseServerClient()

  const formatForm: AuthSchemaType = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    login: formData.get('login') !== null,
    signup: formData.get('signup') !== null,
    from: formData.get('from') as AuthSchemaType['from'],
  }

  const validateResult = authSchema.safeParse(formatForm)

  if (!validateResult.success) {
    const errors = validateResult.error.issues.map((error) => {
      const result = { [error.path.join('.')]: error.message }
      return result
    })

    const validateFailState: AuthStateType = {
      success: validateResult.success,
      message: 'Validate Fail',
      data: formatForm,
      redirectPath: null,
      validateErrors: errors,
      authError: false,
    }

    return validateFailState
  }

  const validateSuccessState: AuthStateType = {
    success: validateResult.success,
    message: null,
    data: validateResult.data,
    redirectPath: ((): string => {
      if (validateResult.data.from === 'shopping') {
        return pagesPath.shopping.$url().path
      }
      return pagesPath.authed.$url().path
    })(),
    validateErrors: null,
    authError: false,
  }

  try {
    const supabaseAuth = async (): Promise<AuthTokenResponsePassword | AuthResponse> => {
      if (formatForm.login) {
        return await supabase.auth.signInWithPassword(validateResult.data)
      }
      if (formatForm.signup) {
        return await supabase.auth.signUp(validateResult.data)
      }
      return {
        data: {
          user: null,
          session: null,
        },
        error: null,
      }
    }

    const { data, error } = await supabaseAuth()

    if (!error) {
      console.info('Signup User Success', data)
      return validateSuccessState
    } else {
      console.error('Auth Error', error)
      const authFailState: AuthStateType = {
        success: false,
        message: `${error.status}: ${error.message}`,
        data: validateResult.data,
        redirectPath: null,
        validateErrors: null,
        authError: true,
      }

      return authFailState
    }
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
