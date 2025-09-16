import { Input } from '@headlessui/react'

type Props = {
  defaultValue1?: string
  defaultValue2?: string
  defaultValue3?: string
  errorPhone1?: string
  errorPhone2?: string
  errorPhone3?: string
}
export const InputPhone: React.FC<Props> = ({ defaultValue1, defaultValue2, defaultValue3, errorPhone1, errorPhone2, errorPhone3 }) => {
  return (
    <dl className="flex flex-col items-start justify-start w-full">
      <dt className="flex items-start justify-start w-full pb-[6px] text-[18px] font-bold">PHONE</dt>
      <dd className="flex flex-col items-start justify-start gap-[4px] w-full">
        <span className="flex items-center justify-start gap-[6px] w-full">
          <Input
            type="tel"
            name="phone1"
            defaultValue={defaultValue1}
            className={`w-full h-[35px] px-[10px] text-[16px] text-[#777] bg-[rgba(255,255,255,0.8)] border border-[2px]  ${errorPhone1 ? 'border-[#b61414]' : 'border-[#ccc]'}  rounded-[6px]`}
            pattern="[\d]*"
            minLength={3}
            maxLength={3}
          />
          <span className="text-[28px] font-bold">-</span>
          <Input
            type="tel"
            name="phone2"
            defaultValue={defaultValue2}
            className={`w-full h-[35px] px-[10px] text-[16px] text-[#777] bg-[rgba(255,255,255,0.8)] border border-[2px]  ${errorPhone2 ? 'border-[#b61414]' : 'border-[#ccc]'}  rounded-[6px]`}
            pattern="[\d]*"
            minLength={4}
            maxLength={4}
          />
          <span className="text-[28px] font-bold">-</span>
          <Input
            type="tel"
            name="phone3"
            defaultValue={defaultValue3}
            className={`w-full h-[35px] px-[10px] text-[16px] text-[#777] bg-[rgba(255,255,255,0.8)] border border-[2px]  ${errorPhone3 ? 'border-[#b61414]' : 'border-[#ccc]'}  rounded-[6px]`}
            pattern="[\d]*"
            minLength={4}
            maxLength={4}
          />
        </span>
        {errorPhone1 && <span className="inline-block text-[14px] text-[#b61414] font-bold px-[6px]">{errorPhone1}</span>}
        {errorPhone2 && <span className="inline-block text-[14px] text-[#b61414] font-bold px-[6px]">{errorPhone2}</span>}
        {errorPhone3 && <span className="inline-block text-[14px] text-[#b61414] font-bold px-[6px]">{errorPhone3}</span>}
      </dd>
    </dl>
  )
}
