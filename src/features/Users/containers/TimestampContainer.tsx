import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { getUserAction } from '../actions'
import { Timestamp } from '../components/Timestamp'

dayjs.extend(utc)
dayjs.extend(timezone)

type Props = {
  id: number
}
export const TimestampContainer: React.FC<Props> = async ({ id }) => {
  const user = await getUserAction(id)

  if (!user) {
    return null
  }

  return (
    <Timestamp
      createAt={dayjs(user.createAt).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')}
      updateAt={dayjs(user.updateAt).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')}
    />
  )
}
