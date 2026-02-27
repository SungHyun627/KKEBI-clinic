'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import ClientRegistrationBasicInfoForm, {
  type BasicInfoFormValues,
} from '@/features/clients/ui/ClientRegistrationBasicInfoForm';
import ClientRegistrationCounselingInfoForm, {
  type CounselingInfoFormValues,
} from '@/features/clients/ui/ClientRegistrationCounselingInfoForm';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';

const PAYMENT_OPTIONS = [
  { label: 'Private Pay (자비 부담)', value: 'private-pay' },
  { label: 'Insurance (보험 적용)', value: 'insurance' },
];

const getTodayDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const NewClientPage = () => {
  const [form, setForm] = useState({
    paymentType: '',
    insuranceCompany: '',
    kkebiNickname: '',
  });
  const basicInfoForm = useForm<BasicInfoFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      birthDate: getTodayDateKey(),
      gender: '',
    },
  });
  const counselingInfoForm = useForm<CounselingInfoFormValues>({
    mode: 'onChange',
    defaultValues: {
      counselingStartDate: getTodayDateKey(),
      chiefConcern: '',
      referralPath: '',
    },
  });

  const isInsurance = form.paymentType === 'insurance';

  return (
    <section className="flex w-full items-start justify-center gap-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="basic-info" />
        <div className="flex w-full flex-col items-start gap-7">
          <ClientRegistrationBasicInfoForm form={basicInfoForm} />
          <ClientRegistrationCounselingInfoForm form={counselingInfoForm} />

          <div className="flex w-full flex-col items-start gap-4 rounded-2xl bg-neutral-99 p-4">
            <h2 className="body-18 font-semibold text-label-normal">보험/결제 정보</h2>
            <div className="flex w-full flex-col gap-2">
              <RequiredLabel>결제 유형</RequiredLabel>
              <Select
                options={PAYMENT_OPTIONS}
                value={form.paymentType}
                onValueChange={(value) => setForm((prev) => ({ ...prev, paymentType: value }))}
                placeholder="결제 유형을 선택해 주세요."
              />
            </div>
            {isInsurance ? (
              <div className="flex w-full flex-col gap-2">
                <RequiredLabel>보험사명</RequiredLabel>
                <Input
                  value={form.insuranceCompany}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, insuranceCompany: event.target.value }))
                  }
                  placeholder="보험사명을 입력해 주세요."
                />
              </div>
            ) : null}
          </div>

          <div className="flex w-full flex-col items-start gap-4 rounded-2xl bg-neutral-99 p-4">
            <h2 className="body-18 font-semibold text-label-normal">KKEBI 닉네임</h2>
            <div className="flex w-full flex-col gap-2">
              <Label>KKEBI 닉네임 입력</Label>
              <Input
                value={form.kkebiNickname}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, kkebiNickname: event.target.value }))
                }
                placeholder="KKEBI 닉네임을 입력해 주세요"
              />
            </div>
          </div>

          <div className="flex w-full justify-end">
            <Button type="button" size="lg" className="w-full max-w-[220px]">
              다음으로
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Label = ({ children }: { children: string }) => {
  return <label className="body-14 font-medium text-label-normal">{children}</label>;
};

const RequiredLabel = ({ children }: { children: string }) => {
  return (
    <label className="body-14 font-medium text-label-normal">
      {children}
      <span className="ml-0.5 text-primary">*</span>
    </label>
  );
};

export default NewClientPage;
