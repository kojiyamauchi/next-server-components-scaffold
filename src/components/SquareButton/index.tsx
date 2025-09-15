import { Button } from '@headlessui/react'

type Props = {
  type: 'button' | 'submit'
  label: string
  onClick?: () => void
}

export const SquareButton: React.FC<Props> = ({ type, label, onClick }) => {
  return (
    <Button
      type={type}
      className="w-full h-[35px] text-[14px] md:text-[16px] font-bold text-[#83ae01] text-center bg-[#d4f79a] px-[16px] border border-[2px] border-[#83ae01] rounded-[6px] cursor-pointer"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
