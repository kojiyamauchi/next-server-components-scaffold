import dayjs from 'dayjs'

import { getUser } from '../actions'
import { Timestamp } from '../components/Timestamp'

type Props = {
  id: number
}
export const TimestampContainer: React.FC<Props> = async ({ id }) => {
  const user = await getUser(id)

  if (!user) {
    return null
  }

  return (
    <>
      <Timestamp createAt={dayjs(user.createAt).format('YYYY-MM-DD HH:mm:ss')} updateAt={dayjs(user.updateAt).format('YYYY-MM-DD HH:mm:ss')} />
    </>
  )
}
