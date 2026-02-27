'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import ClientRegistrationBasicInfoForm, {
  type BasicInfoFormValues,
} from '@/features/clients/ui/ClientRegistrationBasicInfoForm';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

const REFERRAL_OPTIONS = [
  { label: '검색', value: 'search' },
  { label: '지인 추천', value: 'referral' },
  { label: '병원 의뢰', value: 'hospital' },
  { label: 'KKEBI앱', value: 'kkebi-app' },
  { label: '기타', value: 'other' },
];

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
    counselingStartDate: '',
    chiefConcern: '',
    referralPath: '',
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

  const isInsurance = form.paymentType === 'insurance';

  return (
    <section className="flex w-full items-start justify-center gap-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="basic-info" />
        <div className="flex w-full flex-col items-start gap-7">
          <ClientRegistrationBasicInfoForm form={basicInfoForm} />

          <div className="flex w-full flex-col items-start gap-4 rounded-2xl bg-neutral-99 p-4">
            <h2 className="body-18 font-semibold text-label-normal">상담 정보</h2>
            <div className="flex w-full flex-col gap-2">
              <RequiredLabel>상담 시작 일자</RequiredLabel>
              <DatePickerField
                value={form.counselingStartDate}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, counselingStartDate: value }))
                }
                placeholder="상담 시작 일자를 선택해 주세요"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <RequiredLabel>주 호소 문제</RequiredLabel>
              <Input
                value={form.chiefConcern}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, chiefConcern: event.target.value }))
                }
                placeholder="주 호소 문제를 입력해 주세요"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <RequiredLabel>유입 경로</RequiredLabel>
              <Select
                options={REFERRAL_OPTIONS}
                value={form.referralPath}
                onValueChange={(value) => setForm((prev) => ({ ...prev, referralPath: value }))}
                placeholder="유입 경로를 선택해 주세요"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-4 rounded-2xl bg-neutral-99 p-4">
            <h2 className="body-18 font-semibold text-label-normal">보험/결제 정보</h2>
            <div className="flex w-full flex-col gap-2">
              <RequiredLabel>결제 유형</RequiredLabel>
              <Select
                options={PAYMENT_OPTIONS}
                value={form.paymentType}
                onValueChange={(value) => setForm((prev) => ({ ...prev, paymentType: value }))}
                placeholder="결제 유형을 선택해 주세요"
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
                  placeholder="보험사명을 입력해 주세요"
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

const DatePickerField = ({
  value,
  onValueChange,
  placeholder,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(parseDateFromIso(value) ?? new Date());
  const selectedDate = parseDateFromIso(value) ?? undefined;

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setVisibleMonth(parseDateFromIso(value) ?? new Date());
        }
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group relative flex h-14.5 w-full items-center gap-2 rounded-2xl border border-neutral-95 bg-white px-4 text-left transition-all hover:border-label-strong focus-within:border-label-normal enabled:hover:cursor-pointer"
        >
          <span className="body-14 min-w-0 flex-1 truncate font-medium text-label-alternative">
            {formatDateForDisplay(value) || placeholder}
          </span>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            <Image src="/icons/calendar.svg" alt="" width={20} height={20} aria-hidden />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={12}
        avoidCollisions={false}
        className="w-[var(--radix-popover-trigger-width)] rounded-[16px] px-1 py-4.5 shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)]"
      >
        <Calendar
          mode="single"
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          selected={selectedDate}
          onSelect={(date) => {
            if (!date) return;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            onValueChange(`${year}-${month}-${day}`);
            setVisibleMonth(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

const parseDateFromIso = (input: string) => {
  if (!input) return null;
  const parsed = new Date(input.includes(' ') ? input.replace(' ', 'T') : input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateForDisplay = (input: string) => {
  if (!input) return '';
  const [year, month, day] = input.split('-');
  if (!year || !month || !day) return input;
  return `${year}.${month}.${day}`;
};

export default NewClientPage;
