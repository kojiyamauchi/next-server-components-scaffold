'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useCallback, useEffect, useMemo, useState } from 'react'

import { InputEmail } from '@/components/InputEmail'
import { InputPassword } from '@/components/InputPassword'
import { LoadingForm } from '@/components/LoadingForm'
import { SquareButton } from '@/components/SquareButton'

import { authAction, authInitialState, type AuthStateType } from '../actions'
import type { AuthSchemaType } from '../schemas'

type Props = {
  from: string | string[] | undefined
}

export const LoginContainer: React.FC<Props> = ({ from }) => {
  const router = useRouter()

  const fromParam = useMemo(() => {
    if (typeof from === 'string') {
      return from
    }
    return
  }, [from])

  const [login, setLogin] = useState<AuthSchemaType | null>(null)
  const [isRouterBeforeLeave, setIsRouterBeforeLeave] = useState<boolean>(false)
  const [state, formAction, isPending] = useActionState<AuthStateType, FormData>(authAction, authInitialState)

  useEffect(() => {
    if (state.success && state.redirectPath) {
      setIsRouterBeforeLeave(true)
      router.push(state.redirectPath)
      return
    }
    if (state.data !== null) {
      setLogin(state.data)
    }
  }, [state, router])

  const isLoading = useMemo(() => {
    return isRouterBeforeLeave || isPending
  }, [isRouterBeforeLeave, isPending])

  const checkErrors = useCallback(
    (arg: keyof AuthSchemaType) => {
      const errors = state.validateErrors?.filter((error) => error[arg]).map((error) => error[arg] ?? '')
      return errors
    },
    [state.validateErrors],
  )

  return (
    <>
      <form action={formAction} className="flex flex-col items-center justify-start gap-[30px] w-full md:max-w-[400px] px-[20px] pb-[30px]">
        <div className="flex flex-col items-center justify-start gap-[20px] w-full">
          {!isLoading && (
            <>
              <InputEmail defaultValue={login?.email} errors={checkErrors('email')} />
              <InputPassword defaultValue={login?.password} errors={checkErrors('password')} />
            </>
          )}
          {isLoading && (
            <>
              <LoadingForm label="EMAIL" />
              <LoadingForm label="PASSWORD" />
            </>
          )}
        </div>
        <div className="flex flex-col items-center justify-start gap-[10px] w-full h-[80px]">
          <SquareButton type="submit" name="login" label="LOGIN" />
          <SquareButton type="submit" name="signup" label="SIGNUP" />
        </div>
        {fromParam && <input type="hidden" name="from" value={fromParam} />}
      </form>
      {state.authError && <span className="text-[22px] text-[#b61414] font-bold px-[6px]">{state.message}</span>}
    </>
  )
}
