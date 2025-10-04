import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import Link from 'next/link'

import { pagesPath } from '@/libs'

import { List } from '../components/List'
import { fetchUsersRepo } from '../repositories'

dayjs.extend(utc)
dayjs.extend(timezone)

export const UsersContainer: React.FC = async () => {
  try {
    const users = await fetchUsersRepo()

    if (!Boolean(users.length)) {
      return <p className="text-[30px] font-light flex items-center justify-start md:justify-center w-full px-[60px] py-[12px]">Not found user.</p>
    }

    return (
      <>
        {users.map((user) => (
          <Link href={pagesPath.users._id(user.id).$url().path} key={user.id} className="inline-block rounded-[4px] hover:bg-[#dafda2]">
            <List
              id={user.id}
              name={user.name}
              url={user.url}
              phone={user.phone}
              email={user.email}
              createAt={dayjs(user.create_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')}
              updateAt={dayjs(user.update_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')}
            />
          </Link>
        ))}
      </>
    )
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
