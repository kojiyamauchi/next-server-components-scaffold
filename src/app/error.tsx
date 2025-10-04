'use client'

import type { JSX } from 'react'

import { SquareButton } from '@/components/SquareButton'

export default function Error({ error, reset }: { error: Error; reset: () => void }): JSX.Element {
  console.error('from error.tsx', error)

  return (
    <div className="flex flex-col items-center justify-start gap-[20px] md:gap-[30px] w-full md:max-w-[750px] px-[20px] pb-[20px]">
      <h2 className="w-full text-[30px] md:text-[48px] font-light text-center">An error occurred.</h2>
      <p className="w-full text-[20px] md:text-[30px] font-light text-center">{error.message}</p>
      <div className="w-full md:max-w-[400px] px-[20px]">
        <SquareButton type="button" label="RESET" onClick={reset} />
      </div>
    </div>
  )
}
