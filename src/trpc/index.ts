import { router } from './app'
import { users } from './users'

export const appRouter = router({
  users,
})

export type AppRouter = typeof appRouter
