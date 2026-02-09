import { VerifyForm } from '@/features/auth/ui/verify-form';

export function VerifyCard() {
  return (
    <div className="flex flex-col items-center bg-white shrink-0 w-full max-w-[480px] gap-[45px]">
      <div className="flex flex-col items-center gap-3 pt-0">
        <img src="/images/logo.png" alt="KKEBI" width={88} height={88} />
        <h1 className="text-center text-[24px] leading-[30px] font-semibold text-label-normal">
          KKEBI for Counselor
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full max-w-[480px] p-8 gap-8 bg-neutral-99 rounded-[24px]">
        <div className="flex flex-col items-center gap-[6px] w-full max-w-[329px]">
          <span className="block w-full text-center font-pretendard text-[20px] leading-[30px] font-semibold text-label-normal">
            2단계 인증
          </span>
          <p className="w-full text-center font-pretendard text-[16px] leading-[25.6px] font-normal text-neutral-30 m-0">
            등록된 기기로 전송된 인증 코드 6자리를 입력하세요.
          </p>
        </div>
        <div className="w-full">
          <VerifyForm />
        </div>
      </div>
    </div>
  );
}
