import { Heading } from '@/components/Heading'

import { LoginContainer } from '../containers/LoginContainer'

type Props = {
  from?: 'authed' | 'shopping'
}

export const Login: React.FC<Props> = ({ from }) => {
  return (
    <>
      <div className="pb-[10px]">
        <Heading heading="Login | Signup" />{' '}
      </div>
      <div className="flex flex-col items-center justify-start w-full md:max-w-[750px] px-[20px] pb-[20px]">
        <dl className="flex flex-col items-center justify-start w-full pb-[10px]">
          <dt className="text-[12px] md:text-[14px] font-bold">Please Enter</dt>
          <dd className="text-[12px] md:text-[14px] font-bold">
            Email & Password.
            <span className="inline-block translate-y-[3px]">✏️</span>
          </dd>
        </dl>
        <LoginContainer from={from} />
      </div>
    </>
  )
}
