import 'react-loading-skeleton/dist/skeleton.css'

import Skeleton from 'react-loading-skeleton'

type Props = {
  label: string
}

export const LoadingForm: React.FC<Props> = ({ label }) => {
  return (
    <dl className="flex flex-col items-start justify-start w-full">
      <dt className="flex items-start justify-start text-[18px] font-bold w-full pb-[6px]">{label}</dt>
      <dd className="flex items-start justify-start w-full">
        <Skeleton count={1} height={35} duration={0.4} containerClassName="w-full md:max-w-[400px]" />
      </dd>
    </dl>
  )
}
