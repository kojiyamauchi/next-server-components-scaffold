import { Login } from '@/features/Login/pages'

type Props = {
  searchParams: Promise<{ from: string | string[] | undefined }>
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
