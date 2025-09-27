import type { AuthSchemaType } from '../../schemas/auth'

export type AuthStateType = {
  success: boolean
  message: string | null
  data: AuthSchemaType | null
  redirectPath: string | null
  validateErrors:
    | {
        [key in keyof AuthSchemaType]?: string
      }[]
    | null
  authError: boolean
}

export const authInitialState: AuthStateType = {
  success: false,
  message: null,
  data: null,
  redirectPath: null,
  validateErrors: null,
  authError: false,
}
