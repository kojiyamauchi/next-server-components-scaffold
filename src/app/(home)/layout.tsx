import type { JSX } from 'react'

import { LoginButton } from '@/features/Users/components/LoginButton'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <>
      {children}
      <div className="fixed right-[10px] md:right-[20px] bottom-[20px]">
        <LoginButton />
      </div>
    </>
  )
}
