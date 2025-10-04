'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type JSX, useState } from 'react'

type Props = {
  children: React.ReactNode
}

export default function Provider({ children }: Props): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
