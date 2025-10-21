import Link from 'next/link'

import { pagesPath } from '@/libs/$path'

export const Navigation: React.FC = () => {
  const link = [
    { path: pagesPath.$url().path || '/', letter: 'Primary Page' },
    { path: pagesPath.secondary.$url().path, letter: 'Secondary Page' },
    { path: pagesPath.users.$url().path, letter: 'User List Page' },
    { path: pagesPath.shopping.$url().path, letter: 'Shopping Page' },
  ]

  return (
    <ul className="flex items-center justify-center gap-[10px] md:gap-[55px] w-full px-[20px] py-0 md:p-0 mx-auto my-0">
      {link.map((info, index) => (
        <li key={index}>
          <Link href={info.path} className="block text-[14px] md:text-[22px] font-light text-center">
            {info.letter}
          </Link>
        </li>
      ))}
    </ul>
  )
}
