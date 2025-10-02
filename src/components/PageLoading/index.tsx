export const PageLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-[8px]">
      <span className="animate-spin h-8 w-8 border-[3px] border-[#d4f79a] rounded-full border-t-transparent"></span>
      <div className="relative flex items-center justify-center">
        <span className="text-[26px]">Loading</span>
        <span className="absolute bottom-0 right-[-25px]">
          <span className="inline-block text-[30px] opacity-0 animate-dot-first">.</span>
          <span className="inline-block text-[30px] opacity-0 animate-dot-second">.</span>
          <span className="inline-block text-[30px] opacity-0 animate-dot-third">.</span>
        </span>
      </div>
    </div>
  )
}
