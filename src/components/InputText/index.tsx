import { Input } from '@headlessui/react'

type Props = {
  name: string
  label: string
  defaultValue?: string
  error?: string
}

export const InputText: React.FC<Props> = ({ name, label, defaultValue, error }) => {
  return (
    <dl className="flex flex-col items-start justify-start w-full">
      <dt className="flex items-start justify-start w-full pb-[6px]">
        <label htmlFor={name} className="text-[18px] font-bold">
          {label}
        </label>
      </dt>
      <dd className="flex flex-col items-start justify-start gap-[4px] w-full">
        <Input
          type="text"
          id={name}
          name={name}
          defaultValue={defaultValue}
          className={`w-full h-[35px] px-[10px] text-[16px] text-[#777] bg-[rgba(255,255,255,0.8)] border border-[2px] ${error ? 'border-[#b61414]' : 'border-[#ccc]'} rounded-[6px]`}
        />
        {error && <span className="inline-block text-[14px] text-[#b61414] font-bold px-[6px]">{error}</span>}
      </dd>
    </dl>
  )
}
