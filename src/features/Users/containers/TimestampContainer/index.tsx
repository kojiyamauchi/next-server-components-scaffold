import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { Timestamp } from '../../components/Timestamp'
import { fetchUserRepo } from '../../repositories'

dayjs.extend(utc)
dayjs.extend(timezone)

type Props = {
  id: number
}
export const TimestampContainer: React.FC<Props> = async ({ id }) => {
  const user = await fetchUserRepo(id)

  if (!user) {
    return null
  }

  return (
    <Timestamp
      createAt={dayjs(user.create_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')}
      updateAt={dayjs(user.update_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')}
    />
  )
}
