import { fetchUserRepo } from '../../repositories'
import { UserContainerClient } from './client'

type Props = {
  id: number
}

export const UserContainerServer: React.FC<Props> = async ({ id }) => {
  try {
    const user = await fetchUserRepo(id)

    if (!user) {
      return <p className="text-[30px] font-light flex items-center justify-start md:justify-center w-full px-[60px] py-[12px]">Not found user.</p>
    }

    const [phone1, phone2, phone3] = user.phone.split('-')

    return <UserContainerClient id={id} name={user.name} url={user.url} phone1={phone1} phone2={phone2} phone3={phone3} email={user.email} />
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
