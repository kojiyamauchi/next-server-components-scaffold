import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  name: z.string({ message: '氏名の形式が文字列ではありません' }).min(1, { message: '氏名は1文字以上で入力してください' }),
  url: z.url({ message: 'URLの形式が正しくありません' }),
  phone1: z
    .string()
    .min(1, { message: '電話番号:市外局番は1桁以上で入力してください' })
    .max(4, { message: '電話番号:市外局番は4桁以内で入力してください' })
    .regex(/^\d+$/, { message: '電話番号:市外局番は数字のみで入力してください' }),
  phone2: z
    .string()
    .min(1, { message: '電話番号:市内局番は1桁以上で入力してください' })
    .max(4, { message: '電話番号:市内局番は4桁以内で入力してください' })
    .regex(/^\d+$/, { message: '電話番号:市内局番は数字のみで入力してください' }),
  phone3: z
    .string()
    .length(4, { message: '電話番号:加入者番号は4桁で入力してください' })
    .regex(/^\d+$/, { message: '電話番号:加入者は数字のみで入力してください' }),
  email: z.email({ message: 'メールアドレスの形式が正しくありません' }),
  createAt: z.date(),
  updateAt: z.date(),
})

export const updateUserSchema = userSchema.omit({ createAt: true, updateAt: true })

export const createUserSchema = userSchema.omit({ id: true, createAt: true, updateAt: true })

export type UserSchemaType = z.infer<typeof userSchema>

export type UpdateUserSchemaType = Omit<UserSchemaType, 'createAt' | 'updateAt'>

export type CreateUserSchemaType = Omit<UserSchemaType, 'id' | 'createAt' | 'updateAt'>
