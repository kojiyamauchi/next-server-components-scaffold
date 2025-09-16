import 'react-loading-skeleton/dist/skeleton.css'

import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'

import { Heading } from '@/components/Heading'

import { CreateUserButton } from '../components/CreateUserButton'
import { Label } from '../components/Label'
import { UsersContainer } from '../containers/UsersContainer'

export const Users: React.FC = () => {
  return (
    <>
      <div className="pb-[10px]">
        <Heading heading="User List" />
      </div>
      <div className="w-full md:max-w-[750px] pb-[20px] overflow-hidden overflow-x-scroll">
        <div className="flex flex-col items-start justify-start gap-[2px] w-[750px] px-[20px]">
          <Label />
          <Suspense fallback={<Skeleton count={43} height={20} duration={0.4} containerClassName="w-full" className="mb-[2px]" />}>
            <UsersContainer />
          </Suspense>
        </div>
      </div>
      <div className="fixed right-[10px] md:right-[20px] bottom-[20px]">
        <CreateUserButton />
      </div>
    </>
  )
}
