'use client'

type Props = {
  children: React.ReactNode
}

export const ClientWrapper: React.FC<Props> = ({ children }) => {
  return <div>{children} </div>
}
