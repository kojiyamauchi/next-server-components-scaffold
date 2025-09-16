import Link from 'next/link'

import { pagesPath } from '@/libs'

export const CreateUserButton: React.FC = () => {
  return (
    <>
      <Link
        href={pagesPath.users.create.$url().path}
        className="flex items-center justify-center w-[60px] md:w-[80px] h-[60px] md:h-[80px] text-[14px] md:text-[16px] font-bold text-[#83ae01] text-center bg-[#d4f79a] border border-[2px] border-[#83ae01] rounded-[30px] md:rounded-[40px]"
      >
        CREATE
        <br />
        USER
      </Link>
    </>
  )
}
