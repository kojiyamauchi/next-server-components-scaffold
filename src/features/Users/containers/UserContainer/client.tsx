'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useCallback, useMemo, useState } from 'react'

import { InputEmail } from '@/components/InputEmail'
import { InputPhone } from '@/components/InputPhone'
import { InputText } from '@/components/InputText'
import { LoadingForm } from '@/components/LoadingForm'
import { SquareButton } from '@/components/SquareButton'

import { deleteUserAction, updateUserAction, userInitialState, type UserStateType } from '../../actions'
import type { UpdateUserSchemaType } from '../../schemas'

type Props = UpdateUserSchemaType

export const UserContainerClient: React.FC<Props> = ({ id, name, url, phone1, phone2, phone3, email }: Props) => {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<UserStateType, FormData>(updateUserAction, {
    ...userInitialState,
    data: { id: id, name: name, url: url, phone1: phone1, phone2: phone2, phone3: phone3, email: email },
  })
  const [isLoadingDeleteUser, setIsLoadingDeleteUser] = useState<boolean>(false)

  const isLoading = useMemo(() => {
    return isPending || isLoadingDeleteUser
  }, [isPending, isLoadingDeleteUser])

  const checkErrors = useCallback(
    (arg: keyof UpdateUserSchemaType) => {
      return state.errors?.filter((error) => error[arg]).map((error) => error[arg] ?? '')
    },
    [state.errors],
  )

  const handleDeleteUser = useCallback(async () => {
    setIsLoadingDeleteUser(true)
    const result = await deleteUserAction(id).catch((error) => {
      console.error('delete user error -', error)
      setIsLoadingDeleteUser(false)
      return
    })

    if (result !== undefined && result.isSuccess) {
      router.push(result.path)
      setIsLoadingDeleteUser(false)
    }
  }, [id, router])

  if (!isPending && !state.data) {
    return <div>User not found</div>
  }

  return (
    <form action={formAction} className="flex flex-col items-center justify-start gap-[30px] w-full md:max-w-[400px] px-[20px] pb-[30px]">
      <div className="flex flex-col items-center justify-start gap-[20px] w-full min-h-[296px]">
        {!isLoading && state.data && (
          <>
            <input type="hidden" name="id" value={state.data.id} />
            <InputText name="name" label="NAME" defaultValue={state.data.name} errors={checkErrors('name')} />
            <InputText name="url" label="WEB" defaultValue={state.data.url} errors={checkErrors('url')} />
            <InputPhone
              defaultValue1={state.data.phone1}
              defaultValue2={state.data.phone2}
              defaultValue3={state.data.phone3}
              errorsPhone1={checkErrors('phone1')}
              errorsPhone2={checkErrors('phone2')}
              errorsPhone3={checkErrors('phone3')}
            />
            <InputEmail defaultValue={state.data.email} errors={checkErrors('email')} />
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
      <div className="flex flex-col items-center justify-start gap-[10px] w-full">
        <SquareButton type="submit" label="UPDATE" />
        <SquareButton type="button" label="DELETE" onClick={handleDeleteUser} />
      </div>
    </form>
  )
}
