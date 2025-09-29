import { z } from 'zod'

export const authSchema = z.object({
  email: z.email({ message: 'メールアドレスの形式が正しくありません' }),
  password: z
    .string()
    .min(8, '8文字以上必要です')
    .max(72, '72文字以下にしてください')
    .regex(/[a-z]/, '小文字を含めてください')
    .regex(/[A-Z]/, '大文字を含めてください')
    .regex(/[0-9]/, '数字を含めてください')
    .regex(/[^a-zA-Z0-9]/, '記号を含めてください'),
  login: z.boolean(),
  signup: z.boolean(),
  from: z.enum(['authed', 'shopping']).nullable(),
})

export type AuthSchemaType = z.infer<typeof authSchema>
