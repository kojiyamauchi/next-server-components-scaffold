type Props = {
  createAt: string
  updateAt: string
}

export const Timestamp: React.FC<Props> = ({ createAt, updateAt }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full pb-[10px]">
      <dl className="flex items-center justify-start">
        <dt className="text-[12px] md:text-[14px] font-bold">CERATE AT:&nbsp;&nbsp;</dt>
        <dd className="text-[12px] md:text-[14px] font-bold">{createAt}</dd>
      </dl>
      <dl className="flex items-center justify-start">
        <dt className="text-[12px] md:text-[14px] font-bold">UPDATE AT:&nbsp;&nbsp;</dt>
        <dd className="text-[12px] md:text-[14px] font-bold">{updateAt}</dd>
      </dl>
    </div>
  )
}
