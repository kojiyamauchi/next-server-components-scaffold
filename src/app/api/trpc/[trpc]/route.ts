import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter } from '@/trpc'

const handler = (req: Request): Promise<Response> =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      return { exampleContext: true }
    },
    onError({ error, type, path, input, ctx, req }) {
      console.error('error: ', error)
      console.info('type: ', type)
      console.info('path: ', path)
      console.info('input: ', input)
      console.info('context: ', ctx)
      console.info('request: ', req)
    },
    /*
    {
      error: TRPCError; // the original error
      type: 'query' | 'mutation' | 'subscription' | 'unknown';
      path: string | undefined; // path of the procedure that was triggered
      input: unknown;
      ctx: Context | undefined;
      req: BaseRequest; // request object
    }
    */
  })

export { handler as GET, handler as POST }
