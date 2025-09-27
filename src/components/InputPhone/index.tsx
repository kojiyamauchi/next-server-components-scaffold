import { Input } from '@headlessui/react'

type Props = {
  defaultValue1?: string
  defaultValue2?: string
  defaultValue3?: string
  errorsPhone1?: string[]
  errorsPhone2?: string[]
  errorsPhone3?: string[]
}
export const InputPhone: React.FC<Props> = ({ defaultValue1, defaultValue2, defaultValue3, errorsPhone1, errorsPhone2, errorsPhone3 }) => {
  return (
    <dl className="flex flex-col items-start justify-start w-full">
      <dt className="flex items-start justify-start w-full pb-[6px] text-[18px] font-bold">PHONE</dt>
      <dd className="flex flex-col items-start justify-start gap-[4px] w-full">
        <span className="flex items-center justify-start gap-[6px] w-full">
          <Input
            type="tel"
            name="phone1"
            defaultValue={defaultValue1}
            className={`w-full h-[35px] px-[10px] text-[16px] text-[#777] bg-[rgba(255,255,255,0.8)] border border-[2px]  ${Boolean(errorsPhone1?.length) ? 'border-[#b61414]' : 'border-[#ccc]'}  rounded-[6px]`}
            pattern="[\d]*"
            minLength={3}
            maxLength={3}
          />
          <span className="text-[28px] font-bold">-</span>
          <Input
            type="tel"
            name="phone2"
            defaultValue={defaultValue2}
            className={`w-full h-[35px] px-[10px] text-[16px] text-[#777] bg-[rgba(255,255,255,0.8)] border border-[2px]  ${Boolean(errorsPhone2?.length) ? 'border-[#b61414]' : 'border-[#ccc]'}  rounded-[6px]`}
            pattern="[\d]*"
            minLength={4}
            maxLength={4}
          />
          <span className="text-[28px] font-bold">-</span>
          <Input
            type="tel"
            name="phone3"
            defaultValue={defaultValue3}
            className={`w-full h-[35px] px-[10px] text-[16px] text-[#777] bg-[rgba(255,255,255,0.8)] border border-[2px]  ${Boolean(errorsPhone3?.length) ? 'border-[#b61414]' : 'border-[#ccc]'}  rounded-[6px]`}
            pattern="[\d]*"
            minLength={4}
            maxLength={4}
          />
        </span>
        {Boolean(errorsPhone1?.length) &&
          errorsPhone1?.map((error, index) => (
            <span key={index} className="inline-block text-[14px] text-[#b61414] font-bold px-[6px]">
              {error}
            </span>
          ))}
        {Boolean(errorsPhone2?.length) &&
          errorsPhone2?.map((error, index) => (
            <span key={index} className="inline-block text-[14px] text-[#b61414] font-bold px-[6px]">
              {error}
            </span>
          ))}
        {Boolean(errorsPhone3?.length) &&
          errorsPhone3?.map((error, index) => (
            <span key={index} className="inline-block text-[14px] text-[#b61414] font-bold px-[6px]">
              {error}
            </span>
          ))}
      </dd>
    </dl>
  )
}
