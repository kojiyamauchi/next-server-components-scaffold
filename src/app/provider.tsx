'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react'

import { queryClient } from '@/libs/reactQueryClient'

type Props = {
  children: React.ReactNode
}

export default function Provider({ children }: Props): JSX.Element {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
