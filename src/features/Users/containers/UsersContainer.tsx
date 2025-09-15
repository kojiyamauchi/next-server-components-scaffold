import dayjs from 'dayjs'
import Link from 'next/link'

import { pagesPath } from '@/libs'

import { getUsers } from '../actions'
import { List } from '../components/List'

export const UsersContainer: React.FC = async () => {
  const users = await getUsers()

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
            createAt={dayjs(user.create_at).format('YYYY-MM-DD HH:mm:ss')}
            updateAt={dayjs(user.update_at).format('YYYY-MM-DD HH:mm:ss')}
          />
        </Link>
      ))}
    </>
  )
}
