import { Id } from '@/features/Users/pages/id'

type Props = {
  params: Promise<{ id: string }>
}

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params

  return (
    <>
      <Id id={Number(id)} />
    </>
  )
}

export default Page
