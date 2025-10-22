import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { publicProcedure, router } from '@/trpc/app'

import { fetchUserRepo } from '../repositories'

export const users = router({
  getUser: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    console.info(ctx)

    try {
      const user = await fetchUserRepo(input)

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'ユーザーが見つかりません' })
      }

      const [phone1, phone2, phone3] = user.phone.split('-')

      const formatUser = {
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

      return formatUser
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : '不明なサーバーエラー',
      })
    }
  }),
})
