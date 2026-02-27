'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import { type ClientRegistrationDraft } from '@/features/clients/types/client-registration';
import { CLIENT_REGISTRATION_DRAFT_STORAGE_KEY } from '@/features/clients/lib/client-registration-storage';
import { Button } from '@/shared/ui/button';

const ClientRegistrationIntakePage = () => {
  const router = useRouter();

  useEffect(() => {
    const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    if (!storedDraft) {
      router.replace('/clients/new');
      return;
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
      if (!parsedDraft.basicInfo || !parsedDraft.counselingInfo || !parsedDraft.paymentInfo) {
        router.replace('/clients/new');
      }
    } catch {
      window.sessionStorage.removeItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
      router.replace('/clients/new');
    }
  }, [router]);

  const handleNext = () => {
    const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    if (!storedDraft) {
      router.replace('/clients/new');
      return;
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
      const nextDraft: ClientRegistrationDraft = {
        ...parsedDraft,
        step: 'registration-complete',
      };
      window.sessionStorage.setItem(
        CLIENT_REGISTRATION_DRAFT_STORAGE_KEY,
        JSON.stringify(nextDraft),
      );
      router.push('/clients/new/complete');
    } catch {
      window.sessionStorage.removeItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
      router.replace('/clients/new');
    }
  };

  return (
    <section className="flex w-full items-start justify-center gap-4 pb-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="intake-interview-info" />
        <div className="flex w-full flex-col items-start gap-7">
          <div className="flex w-full flex-col items-start gap-4 rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">접수 면접 정보</h2>
            <p className="body-16 text-label-alternative">
              2단계 폼 화면은 이어서 구현 예정입니다.
            </p>
          </div>

          <div className="flex w-full justify-end">
            <Button type="button" size="lg" onClick={handleNext} className="w-full max-w-[244px]">
              다음으로
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientRegistrationIntakePage;
