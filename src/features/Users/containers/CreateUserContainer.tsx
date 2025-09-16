'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useCallback, useEffect, useMemo, useState } from 'react'

import { InputEmail } from '@/components/InputEmail'
import { InputPhone } from '@/components/InputPhone'
import { InputText } from '@/components/InputText'
import { LoadingForm } from '@/components/LoadingForm'
import { SquareButton } from '@/components/SquareButton'

import { createUser } from '../actions'
import { type CreateUserStateType, userInitialState } from '../actions/states'
import type { CreateUserSchemaType } from '../schemas'

export const CreateUserContainer: React.FC = () => {
  const router = useRouter()

  const [user, setUser] = useState<CreateUserSchemaType | null>(null)
  const [isRouterBeforeLeave, setIsRouterBeforeLeave] = useState<boolean>(false)
  const [state, formAction, isPending] = useActionState<CreateUserStateType, FormData>(createUser, userInitialState)

  useEffect(() => {
    if (state.success && !!state.createId && state.redirectPath) {
      setIsRouterBeforeLeave(true)
      router.push(state.redirectPath)
      return
    }
    if (state.data !== null) {
      setUser(state.data)
    }
  }, [state, router])

  const isLoading = useMemo(() => {
    return isRouterBeforeLeave || isPending
  }, [isRouterBeforeLeave, isPending])

  const checkError = useCallback(
    (arg: keyof CreateUserSchemaType) => {
      return state.errors?.find((error) => error[arg])
    },
    [state.errors],
  )

  return (
    <>
      <form action={formAction} className="flex flex-col items-center justify-start gap-[30px] w-full md:max-w-[400px] px-[20px] pb-[30px]">
        <div className="flex flex-col items-center justify-start gap-[20px] w-full min-h-[296px]">
          {!isLoading && (
            <>
              <InputText name="name" label="NAME" defaultValue={user?.name} error={checkError('name')?.name} />
              <InputText name="url" label="WEB" defaultValue={user?.url} error={checkError('url')?.url} />
              <InputPhone
                defaultValue1={user?.phone1}
                defaultValue2={user?.phone2}
                defaultValue3={user?.phone3}
                errorPhone1={checkError('phone1')?.phone1}
                errorPhone2={checkError('phone2')?.phone2}
                errorPhone3={checkError('phone3')?.phone3}
              />
              <InputEmail defaultValue={user?.email} error={checkError('email')?.email} />
            </>
          )}
          {isLoading && (
            <>
              <LoadingForm label="NAME" />
              <LoadingForm label="WEB" />
              <LoadingForm label="PHONE" />
              <LoadingForm label="EMAIL" />
            </>
          )}
        </div>
        <div className="flex flex-col items-center justify-start gap-[10px] w-full h-[80px]">
          <SquareButton type="submit" label="CREATE" />
        </div>
      </form>
    </>
  )
}
