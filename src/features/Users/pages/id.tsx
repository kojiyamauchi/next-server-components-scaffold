import 'react-loading-skeleton/dist/skeleton.css'

import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'

import { Heading } from '@/components/Heading'

import { CreateUserButton } from '../components/CreateUserButton'
import { TimestampContainer } from '../containers/TimestampContainer'
import { UserContainer } from '../containers/UserContainer'

type Props = {
  id: number
}

export const Id: React.FC<Props> = ({ id }) => {
  return (
    <>
      <div className="pb-[10px]">
        <Heading heading="User" />
      </div>
      <div className="flex flex-col items-center justify-start w-full md:max-w-[750px] px-[20px] pb-[20px]">
        <Suspense
          fallback={
            <>
              <Skeleton count={2} duration={0.4} containerClassName="w-[170px] md:w-[200px] mb-[2px] md:mb-[6px]" className="h-[12px] md:h-[14px]" />
            </>
          }
        >
          <TimestampContainer id={id} />
        </Suspense>
        <UserContainer id={id} />
      </div>
      <div className="fixed right-[10px] md:right-[20px] bottom-[20px]">
        <CreateUserButton />
      </div>
    </>
  )
}
