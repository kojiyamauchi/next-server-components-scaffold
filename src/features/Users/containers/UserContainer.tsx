'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useCallback, useEffect, useMemo, useState } from 'react'

import { InputEmail } from '@/components/InputEmail'
import { InputPhone } from '@/components/InputPhone'
import { InputText } from '@/components/InputText'
import { LoadingForm } from '@/components/LoadingForm'
import { SquareButton } from '@/components/SquareButton'

import { deleteUser, getUser, updateUser, userInitialState, type UserStateType } from '../actions'
import type { UpdateUserSchemaType } from '../schemas'

type Props = {
  id: number
}

export const UserContainer: React.FC<Props> = ({ id }: Props) => {
  const router = useRouter()

  const [user, setUser] = useState<{ isLoading: boolean; isFetched: boolean; data: UserStateType['data'] }>({ isLoading: false, isFetched: false, data: null })
  const [state, formAction, isPending] = useActionState<UserStateType, FormData>(updateUser, userInitialState)

  useEffect(() => {
    setUser({ isLoading: true, isFetched: false, data: null })
    void (async (): Promise<void> => {
      const user = await getUser(id)
      setUser({ isLoading: false, isFetched: true, data: user })
    })()
  }, [id])

  useEffect(() => {
    if (state.data !== null) {
      setUser((prev) => {
        return { ...prev, data: state.data }
      })
    }
  }, [state.data])

  const isLoading = useMemo(() => {
    return user.isLoading || isPending
  }, [user.isLoading, isPending])

  const checkErrors = useCallback(
    (arg: keyof UpdateUserSchemaType) => {
      return state.errors?.filter((error) => error[arg]).map((error) => error[arg] ?? '')
    },
    [state.errors],
  )

  const handleDeleteUser = useCallback(
    async (id: number | undefined) => {
      setUser((prev) => {
        return { ...prev, isLoading: true }
      })
      const result = await deleteUser(id)

      if (result.isSuccess) {
        router.push(result.path)
      }
    },
    [router],
  )

  if (user.isFetched && !user.data) {
    return <div>User not found</div>
  }

  return (
    <form action={formAction} className="flex flex-col items-center justify-start gap-[30px] w-full md:max-w-[400px] px-[20px] pb-[30px]">
      <div className="flex flex-col items-center justify-start gap-[20px] w-full min-h-[296px]">
        {!isLoading && user.data && (
          <>
            <input type="hidden" name="id" value={user.data.id} />
            <InputText name="name" label="NAME" defaultValue={user.data.name} errors={checkErrors('name')} />
            <InputText name="url" label="WEB" defaultValue={user.data.url} errors={checkErrors('url')} />
            <InputPhone
              defaultValue1={user.data.phone1}
              defaultValue2={user.data.phone2}
              defaultValue3={user.data.phone3}
              errorsPhone1={checkErrors('phone1')}
              errorsPhone2={checkErrors('phone2')}
              errorsPhone3={checkErrors('phone3')}
            />
            <InputEmail defaultValue={user.data.email} errors={checkErrors('email')} />
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
      <div className="flex flex-col items-center justify-start gap-[10px] w-full">
        <SquareButton type="submit" label="UPDATE" />
        <SquareButton type="button" label="DELETE" onClick={() => handleDeleteUser(user.data?.id)} />
      </div>
    </form>
  )
}
