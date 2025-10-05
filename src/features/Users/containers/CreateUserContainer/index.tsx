'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useCallback, useEffect, useMemo, useState } from 'react'

import { InputEmail } from '@/components/InputEmail'
import { InputPhone } from '@/components/InputPhone'
import { InputText } from '@/components/InputText'
import { LoadingForm } from '@/components/LoadingForm'
import { SquareButton } from '@/components/SquareButton'

import { createUserAction, type CreateUserStateType, userInitialState } from '../../actions'
import type { CreateUserSchemaType } from '../../schemas'

export const CreateUserContainer: React.FC = () => {
  const router = useRouter()

  const [isRouterBeforeLeave, setIsRouterBeforeLeave] = useState<boolean>(false)
  const [state, formAction, isPending] = useActionState<CreateUserStateType, FormData>(createUserAction, userInitialState)

  useEffect(() => {
    if (state.success && !!state.createId && state.redirectPath) {
      setIsRouterBeforeLeave(true)
      router.push(state.redirectPath)
      return
    }
  }, [state, router])

  const isLoading = useMemo(() => {
    return isRouterBeforeLeave || isPending
  }, [isRouterBeforeLeave, isPending])

  const checkErrors = useCallback(
    (arg: keyof CreateUserSchemaType) => {
      return state.errors?.filter((error) => error[arg]).map((error) => error[arg] ?? '')
    },
    [state.errors],
  )

  return (
    <form action={formAction} className="flex flex-col items-center justify-start gap-[30px] w-full md:max-w-[400px] px-[20px] pb-[30px]">
      <div className="flex flex-col items-center justify-start gap-[20px] w-full min-h-[296px]">
        {!isLoading && (
          <>
            <InputText name="name" label="NAME" defaultValue={state.data?.name} errors={checkErrors('name')} />
            <InputText name="url" label="WEB" defaultValue={state.data?.url} errors={checkErrors('url')} />
            <InputPhone
              defaultValue1={state.data?.phone1}
              defaultValue2={state.data?.phone2}
              defaultValue3={state.data?.phone3}
              errorsPhone1={checkErrors('phone1')}
              errorsPhone2={checkErrors('phone2')}
              errorsPhone3={checkErrors('phone3')}
            />
            <InputEmail defaultValue={state.data?.email} errors={checkErrors('email')} />
          </>
        )}
        {isLoading && (
          <>
            <LoadingForm label="NAME" />
            <LoadingForm label="WEB" />
            <LoadingForm label="PHONE" />
            <LoadingForm label="E-MAIL" />
          </>
        )}
      </div>
      <div className="flex flex-col items-center justify-start gap-[10px] w-full h-[80px]">
        <SquareButton type="submit" label="CREATE" />
      </div>
    </form>
  )
}
