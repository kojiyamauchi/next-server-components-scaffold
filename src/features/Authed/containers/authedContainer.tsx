'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { LogoutButton } from '@/components/LogoutButton'

import { logoutAction } from '../actions/logout'

export const AuthedContainer: React.FC = () => {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)

  const handleLogout = useCallback(async () => {
    const { success, message, redirectPath } = await logoutAction()
    setMessage(message)
    if (success && redirectPath) {
      router.push(redirectPath)
    }
  }, [router])

  return (
    <>
      {message && message}
      <div className="fixed right-[10px] md:right-[20px] bottom-[20px]">
        <LogoutButton onClick={handleLogout} />
      </div>
    </>
  )
}
