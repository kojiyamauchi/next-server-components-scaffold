import { LoadingForm } from '@/components/LoadingForm'

export const LoadingUserForm: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start gap-[24px] w-full md:max-w-[400px] px-[20px] pb-[30px]">
      <div className="flex flex-col items-center justify-start gap-[20px] w-full min-h-[296px]">
        <LoadingForm label="NAME" />
        <LoadingForm label="WEB" />
        <LoadingForm label="PHONE" />
        <LoadingForm label="E-MAIL" />
      </div>
      <div className="flex flex-col items-center justify-start gap-[4px] w-full">
        <LoadingForm />
        <LoadingForm />
      </div>
    </div>
  )
}
