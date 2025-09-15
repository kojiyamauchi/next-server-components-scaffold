import type { CreateUserSchemaType, UpdateUserSchemaType } from '../../schemas'

export type UserStateType = {
  success: boolean
  message: string | null
  data: UpdateUserSchemaType | null
  errors:
    | {
        [key in keyof UpdateUserSchemaType]?: string
      }[]
    | null
}

export type CreateUserStateType = {
  success: boolean
  message: string | null
  data: CreateUserSchemaType | null
  createId?: number
  redirectPath?: string
  errors:
    | {
        [key in keyof CreateUserSchemaType]?: string
      }[]
    | null
}

export const userInitialState: UserStateType = {
  success: false,
  message: null,
  data: null,
  errors: null,
}
