import { Login } from '@/features/Login/pages'

export type OptionalQuery = {
  from: 'authed' | 'shopping'
}

type Props = {
  searchParams: Promise<Partial<OptionalQuery>>
}

const Page: React.FC<Props> = async ({ searchParams }) => {
  const { from } = await searchParams

  return (
    <>
      <Login from={from} />
    </>
  )
}

export default Page
