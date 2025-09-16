import 'react-loading-skeleton/dist/skeleton.css'

import { Heading } from '@/components/Heading'

import { CreateUserContainer } from '../containers/CreateUserContainer'

export const Create: React.FC = () => {
  return (
    <>
      <div className="pb-[10px]">
        <Heading heading="Create User" />
      </div>
      <div className="flex flex-col items-center justify-start w-full md:max-w-[750px] px-[20px] pb-[20px]">
        <dl className="flex flex-col items-center justify-start w-full pb-[10px]">
          <dt className="text-[12px] md:text-[14px] font-bold">Please enter the required information</dt>
          <dd className="text-[12px] md:text-[14px] font-bold">
            for each item. <span className="inline-block translate-y-[3px]">✏️</span>
          </dd>
        </dl>

        <CreateUserContainer />
      </div>
    </>
  )
}
