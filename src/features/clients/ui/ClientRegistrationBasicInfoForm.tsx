'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/shared/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Button } from '@/shared/ui/button';

const GENDER_OPTIONS = [
  { label: '여자', value: 'female' },
  { label: '남자', value: 'male' },
  { label: '논바이너리', value: 'non-binary' },
];

export type BasicInfoFormValues = {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
};

interface ClientRegistrationBasicInfoFormProps {
  form: UseFormReturn<BasicInfoFormValues>;
}

const ClientRegistrationBasicInfoForm = ({ form }: ClientRegistrationBasicInfoFormProps) => {
  const selectedGender = form.watch('gender');

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">기본 정보</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: '이름을 입력해 주세요.' }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  이름
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="이름을 입력해 주세요" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            rules={{
              required: '전화번호를 입력해 주세요.',
              pattern: {
                value: /^\d{3}-\d{4}-\d{4}$/,
                message: '전화번호 형식은 000-0000-0000 입니다.',
              },
            }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  전화번호
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="전화번호를 입력해 주세요" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: '이메일을 입력해 주세요.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '유효한 이메일 형식을 입력해 주세요.',
              },
            }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  이메일
                </FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="이메일을 입력해 주세요" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            rules={{ required: '생년월일을 입력해 주세요.' }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  생년월일
                </FormLabel>
                <FormControl>
                  <DatePickerField
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="생년월일을 선택해 주세요"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={() => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">성별</FormLabel>
                <div className="flex w-full gap-2">
                  {GENDER_OPTIONS.map((option) => {
                    const isSelected = selectedGender === option.value;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() =>
                          form.setValue('gender', option.value, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: false,
                          })
                        }
                        className={cn(
                          'flex h-[66px] w-full items-center justify-center gap-2 rounded-[16px] border p-5 hover:cursor-pointer hover:bg-neutral-95',
                          isSelected ? 'border-primary bg-fill-pressed' : 'border-neutral-95',
                        )}
                      >
                        <span
                          className={cn(
                            'body-16 text-center font-medium',
                            isSelected ? 'text-primary' : 'text-label-alternative',
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
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
  const [draftDate, setDraftDate] = useState<Date | undefined>(selectedDate);
  const isDateUnchanged =
    (selectedDate?.toDateString() ?? '') === (draftDate?.toDateString() ?? '');

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          const nextSelectedDate = parseDateFromIso(value) ?? undefined;
          setVisibleMonth(nextSelectedDate ?? new Date());
          setDraftDate(nextSelectedDate);
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
        className="flex flex-col items-center gap-[8.889px] w-[var(--radix-popover-trigger-width)] rounded-[16px] px-6 py-[18px] shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)]"
      >
        <Calendar
          mode="single"
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          selected={draftDate}
          onSelect={(date) => {
            if (!date) return;
            setDraftDate(date);
            setVisibleMonth(date);
          }}
        />
        <div className="flex w-full max-w-[244px] justify-end px-2 pb-1">
          <Button
            type="button"
            disabled={!draftDate || isDateUnchanged}
            onClick={() => {
              if (!draftDate) return;
              const year = draftDate.getFullYear();
              const month = String(draftDate.getMonth() + 1).padStart(2, '0');
              const day = String(draftDate.getDate()).padStart(2, '0');
              onValueChange(`${year}-${month}-${day}`);
              setOpen(false);
            }}
            className="inline-flex h-[42px] w-full  rounded-[12px]"
          >
            저장
          </Button>
        </div>
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
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

export default ClientRegistrationBasicInfoForm;
