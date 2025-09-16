type Props = {
  id: number
  name: string
  url: string
  phone: string
  email: string
  createAt: string
  updateAt: string
}

export const List: React.FC<Props> = ({ id, name, url, phone, email, createAt, updateAt }) => {
  return (
    <div className="flex items-center justify-start w-[710px] h-[20px]">
      <span className="w-[35px] text-[14px] truncate">{id}.</span>
      <span className="w-[105px] text-[14px] truncate">{name}</span>
      <span className="w-[105px] text-[14px] truncate">{url}</span>
      <span className="w-[95px] text-[14px] truncate">{phone}</span>
      <span className="w-[125px] text-[14px] truncate">{email}</span>
      <span className="w-[125px] text-[14px] truncate">{createAt}</span>
      <span className="w-[120px] text-[14px] truncate">{updateAt}</span>
    </div>
  )
}
