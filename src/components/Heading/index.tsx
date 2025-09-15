type Props = {
  heading: string
}

export const Heading: React.FC<Props> = ({ heading }) => {
  return (
    <>
      <h2 className="w-full text-[30px] md:text-[48px] font-light text-center">{heading} Page.</h2>
    </>
  )
}
