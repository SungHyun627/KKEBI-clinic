'use client';

import { useState } from 'react';
import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import { CLIENT_REGISTRATION_DRAFT_STORAGE_KEY } from '@/features/clients/lib/client-registration-storage';
import type {
  BasicInfoFormValues,
  ClientRegistrationDraft,
} from '@/features/clients/types/client-registration';
import LabelCell from '@/features/clients/ui/ClientRegistrationLabelCell';
import ValueCell from '@/features/clients/ui/ClientRegistrationValueCell';
import { Button } from '@/shared/ui/button';

const EMPTY_BASIC_INFO: BasicInfoFormValues = {
  name: '',
  phone: '',
  email: '',
  birthDate: '',
  gender: '',
};

const getBasicInfoFromSessionStorage = (): BasicInfoFormValues => {
  if (typeof window === 'undefined') {
    return EMPTY_BASIC_INFO;
  }

  const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
  if (!storedDraft) return EMPTY_BASIC_INFO;

  try {
    const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
    return parsedDraft.basicInfo ?? EMPTY_BASIC_INFO;
  } catch {
    return EMPTY_BASIC_INFO;
  }
};

const ClientRegistrationReviewPage = () => {
  const [basicInfo] = useState<BasicInfoFormValues>(getBasicInfoFromSessionStorage);

  return (
    <section className="flex w-full items-start justify-center gap-4 pb-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="registration-complete" />
        <div className="flex w-full flex-col items-start gap-[23px]">
          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">기본 정보</h2>
            <div className="flex w-full flex-col gap-4">
              <div className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white">
                <div className="flex flex-col">
                  <LabelCell field="이름" />
                  <ValueCell value={basicInfo.name} />
                </div>
                <div className="flex flex-col">
                  <LabelCell field="연락처" />
                  <ValueCell value={basicInfo.phone} />
                </div>
              </div>

              <div className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white">
                <div className="flex flex-col">
                  <LabelCell field="이메일" />
                  <ValueCell value={basicInfo.email} />
                </div>
                <div className="flex flex-col">
                  <LabelCell field="생년월일" />
                  <ValueCell value={basicInfo.birthDate} />
                </div>
              </div>

              <div className="grid w-full grid-cols-1 bg-white">
                <div className="flex flex-col">
                  <LabelCell field="성별" />
                  <ValueCell value={basicInfo.gender} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end">
            <Button type="button" size="lg" className="w-full max-w-[244px]">
              등록 완료
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientRegistrationReviewPage;
