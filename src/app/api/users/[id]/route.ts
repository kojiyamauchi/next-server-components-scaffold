import { NextResponse } from 'next/server'

import { fetchUserRepo } from '../repositories'

type Params = {
  params: Promise<{ id: string }>
}

export const GET = async (req: Request, { params }: Params): Promise<NextResponse> => {
  const { id } = await params

  if (isNaN(Number(id))) {
    return NextResponse.json({ message: 'Invalid value.' }, { status: 400 })
  }

  try {
    const user = await fetchUserRepo(Number(id))

    if (!user) {
      return NextResponse.json({ message: 'No results found.' }, { status: 404 })
    }

    const [phone1, phone2, phone3] = user.phone.split('-')

    const formatData = {
      id: user.id,
      name: user.name,
      url: user.url,
      phone1: phone1,
      phone2: phone2,
      phone3: phone3,
      email: user.email,
      createAt: user.create_at,
      updateAt: user.update_at,
    }

    return NextResponse.json(formatData, { status: 200 })
  } catch (error) {
    console.error('Maybe Repository Layer Error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
