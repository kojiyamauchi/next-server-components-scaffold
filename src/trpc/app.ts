import { initTRPC } from '@trpc/server'

type ExampleContext = {
  exampleContext: boolean
}

const t = initTRPC.context<ExampleContext>().create()

export const router = t.router
export const publicProcedure = t.procedure
