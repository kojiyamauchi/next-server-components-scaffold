import type { JSX } from 'react'

type Props<T> = {
  fetcher: Promise<T>
  children: (fetcherResult: T) => React.ReactNode
}

export const SuspenseWrapper = async <T,>({ fetcher, children }: Props<T>): Promise<JSX.Element> => {
  const result = await fetcher
  return <>{children(result)}</>
}

/* Example:
  <Suspense fallback={<div>Loading users...</div>}>
    <SuspenseWrapper<User[]> fetcher={fetchUsers()}>
      {(user) =>
        user.map((user) => (
          <a key={user.id}>
            <List
              id={user.id}
              name={user.name}
              url={user.url}
              phone={user.phone}
              email={user.email}
              createAt={dayjs(user.create_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')}
              updateAt={dayjs(user.update_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')}
            />
          </a>
        ))
      }
    </SuspenseWrapper>
  </Suspense>
*/
