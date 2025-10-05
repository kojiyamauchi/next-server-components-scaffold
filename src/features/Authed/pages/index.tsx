import { AuthedContainer } from '../containers/AuthedContainer'

export const Authed: React.FC = () => {
  return (
    <>
      <div className="text-[30px] pb-[10px]">Login Success.</div>
      <AuthedContainer />
    </>
  )
}
