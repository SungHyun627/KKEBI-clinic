'use client';

import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import { Button } from '@/shared/ui/button';

const ClientRegistrationCompletePage = () => {
  return (
    <section className="flex w-full items-start justify-center gap-4 pb-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="registration-complete" />
        <div className="flex w-full flex-col items-start gap-7">
          <div className="flex w-full flex-col items-start gap-4 rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">등록 완료</h2>
            <p className="body-16 text-label-alternative">
              3단계 최종 확인 화면은 이어서 구현 예정입니다.
            </p>
          </div>

          <div className="flex w-full justify-end">
            <Button type="button" size="lg" className="w-full max-w-[244px]">
              홈으로
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientRegistrationCompletePage;
