export const Label: React.FC = () => {
  return (
    <div className="flex items-center justify-start w-[710px] h-[20px]">
      <span className="inline-block w-[35px] text-[14px] font-bold truncate">No.</span>
      <span className="inline-block w-[105px] text-[14px] font-bold truncate">NAME</span>
      <span className="inline-block w-[105px] text-[14px] font-bold truncate">WEB</span>
      <span className="inline-block w-[95px] text-[14px] font-bold truncate">PHONE</span>
      <span className="inline-block w-[125px] text-[14px] font-bold truncate">E-MAIL</span>
      <span className="inline-block w-[125px] text-[14px] font-bold truncate">CREATE AT</span>
      <span className="inline-block w-[120] text-[14px] font-bold truncate">UPDATE AT</span>
    </div>
  )
}
