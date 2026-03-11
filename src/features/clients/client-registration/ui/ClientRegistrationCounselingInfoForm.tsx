'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import type { CounselingInfoFormValues } from '@/features/clients/client-registration/types/client-registration';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Button } from '@/shared/ui/button';

const REFERRAL_OPTIONS = [
  { labelKey: 'search', value: 'search' },
  { labelKey: 'referral', value: 'referral' },
  { labelKey: 'hospital', value: 'hospital' },
  { labelKey: 'kkebiApp', value: 'kkebi-app' },
  { labelKey: 'other', value: 'other' },
] as const;

const TIME_OPTIONS = Array.from({ length: 24 * 60 }, (_, index) => {
  const hour = String(Math.floor(index / 60)).padStart(2, '0');
  const minute = String(index % 60).padStart(2, '0');
  return `${hour}:${minute}`;
});

const getWrappedIndex = (index: number, length: number) => ((index % length) + length) % length;

interface ClientRegistrationCounselingInfoFormProps {
  form: UseFormReturn<CounselingInfoFormValues>;
}

const ClientRegistrationCounselingInfoForm = ({
  form,
}: ClientRegistrationCounselingInfoFormProps) => {
  const t = useTranslations('clientRegistration.counselingInfo');
  const locale = useLocale();
  const [openTimePicker, setOpenTimePicker] = useState<'start' | 'end' | null>(null);
  const referralOptions = REFERRAL_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`referralOptions.${option.labelKey}`),
  }));

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">{t('title')}</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="counselingStartDate"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">
                  {t('fields.counselingStartDate')}
                </FormLabel>
                <FormControl>
                  <DatePickerField
                    locale={locale}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('placeholders.counselingStartDate')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className="flex w-full flex-col gap-2">
            <span className="body-14 font-medium text-label-normal">
              {t('fields.counselingTime')}
            </span>
            <div className="grid w-full grid-cols-[minmax(0,1fr)_10px_minmax(0,1fr)] items-start gap-[15px]">
              <FormField
                control={form.control}
                name="counselingStartTime"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <FormControl>
                      <TimeWheelPicker
                        label={t('fields.counselingStartTime')}
                        value={field.value || '09:00'}
                        onValueChange={field.onChange}
                        align="start"
                        open={openTimePicker === 'start'}
                        onOpenChange={(nextOpen) => setOpenTimePicker(nextOpen ? 'start' : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex h-14.5 w-full items-center justify-center">
                <span className="block h-[2.5px] w-[10px] rounded-full bg-[#303030]" />
              </div>
              <FormField
                control={form.control}
                name="counselingEndTime"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <FormControl>
                      <TimeWheelPicker
                        label={t('fields.counselingEndTime')}
                        value={field.value || '10:00'}
                        onValueChange={field.onChange}
                        align="end"
                        open={openTimePicker === 'end'}
                        onOpenChange={(nextOpen) => setOpenTimePicker(nextOpen ? 'end' : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormItem>
          <FormField
            control={form.control}
            name="chiefConcern"
            rules={{ required: t('errors.chiefConcernRequired') }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  {t('fields.chiefConcern')}
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('placeholders.chiefConcern')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referralPath"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">
                  {t('fields.referralPath')}
                </FormLabel>
                <FormControl>
                  <Select
                    options={referralOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('placeholders.referralPath')}
                    placeholderTextClassName="text-label-alternative font-normal"
                    triggerClassName="h-14.5 rounded-2xl border border-neutral-95 bg-white px-4 py-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
};

interface TimeWheelPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  align?: 'start' | 'center' | 'end';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TimeWheelPicker({
  label,
  value,
  onValueChange,
  align = 'center',
  open,
  onOpenChange,
}: TimeWheelPickerProps) {
  const tCommon = useTranslations('common');
  const normalizedValue = TIME_OPTIONS.includes(value) ? value : '09:00';
  const [draftValue, setDraftValue] = useState(normalizedValue);
  const [manualValue, setManualValue] = useState(normalizedValue);
  const [initialValueAtOpen, setInitialValueAtOpen] = useState(normalizedValue);
  const activeIndex = TIME_OPTIONS.indexOf(draftValue);
  const isUnchanged = draftValue === initialValueAtOpen;
  const isValidTimeFormat = (input: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(input);

  const step = (delta: number) => {
    const nextIndex = getWrappedIndex(activeIndex + delta, TIME_OPTIONS.length);
    const nextValue = TIME_OPTIONS[nextIndex];
    setDraftValue(nextValue);
    setManualValue(nextValue);
  };

  const panelAlignClass =
    align === 'end'
      ? '-ml-[calc(100%+45px)] translate-x-[5px]'
      : align === 'center'
        ? '-ml-[calc(50%+22.5px)]'
        : '';

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <div className="group relative flex h-14.5 w-full items-center gap-2 rounded-2xl border border-neutral-95 bg-white px-4 transition-all hover:border-label-strong focus-within:border-label-normal">
        <input
          aria-label={label}
          inputMode="numeric"
          placeholder="HH:mm"
          maxLength={5}
          value={open ? manualValue : normalizedValue}
          onChange={(event) => {
            const nextValue = event.target.value.replace(/[^\d:]/g, '').slice(0, 5);
            setManualValue(nextValue);
            if (open && isValidTimeFormat(nextValue)) {
              setDraftValue(nextValue);
            }
          }}
          onBlur={() => {
            if (!isValidTimeFormat(manualValue)) {
              setManualValue(normalizedValue);
              return;
            }
            setDraftValue(manualValue);
            onValueChange(manualValue);
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            if (!isValidTimeFormat(manualValue)) {
              setManualValue(normalizedValue);
              return;
            }
            setDraftValue(manualValue);
            onValueChange(manualValue);
          }}
          className="body-14 min-w-0 flex-1 bg-transparent font-medium text-label-alternative outline-none"
        />
        <button
          type="button"
          aria-label={label}
          onClick={() => {
            const nextOpen = !open;
            if (nextOpen) {
              setInitialValueAtOpen(normalizedValue);
              setDraftValue(normalizedValue);
              setManualValue(normalizedValue);
            }
            onOpenChange(nextOpen);
          }}
          className="flex h-6 w-6 shrink-0 items-center justify-center hover:cursor-pointer"
        >
          <Image src="/icons/clock.svg" alt="" width={24} height={24} aria-hidden />
        </button>
      </div>
      {open && (
        <div
          className={`mt-3 flex w-[calc(200%+45px)] self-stretch flex-col items-center gap-[26px] rounded-[16px] border border-neutral-95 bg-white px-6 py-[18px] shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)] ${panelAlignClass}`}
        >
          <div
            className="relative h-21 w-full overflow-hidden rounded-xl bg-white overscroll-contain"
            onWheel={(event) => {
              event.preventDefault();
              event.stopPropagation();
              step(event.deltaY > 0 ? 1 : -1);
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 rounded-lg" />
            <div className="flex h-full w-full flex-col items-center justify-center gap-[10px]">
              {[-1, 0, 1].map((offset) => {
                const optionIndex = getWrappedIndex(activeIndex + offset, TIME_OPTIONS.length);
                const option = TIME_OPTIONS[optionIndex];
                const [hour, minute] = option.split(':');
                const distance = Math.abs(offset);

                return (
                  <button
                    key={`${option}-${offset}`}
                    type="button"
                    onClick={() => {
                      setDraftValue(option);
                      setManualValue(option);
                    }}
                    className={`flex h-[22px] w-full items-center justify-center text-center leading-[22px] transition-colors hover:cursor-pointer ${
                      distance === 0
                        ? 'body-14 font-semibold text-primary'
                        : 'body-14 text-label-alternative'
                    }`}
                  >
                    <span className="flex items-center gap-2 self-stretch">
                      <span>{hour}</span>
                      <span>:</span>
                      <span>{minute}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <Button
            type="button"
            size="md"
            className="w-full max-w-[244px]"
            disabled={isUnchanged}
            onClick={() => {
              onValueChange(draftValue);
              setManualValue(draftValue);
              onOpenChange(false);
            }}
          >
            {tCommon('save')}
          </Button>
        </div>
      )}
    </div>
  );
}

const DatePickerField = ({
  locale,
  value,
  onValueChange,
  placeholder,
}: {
  locale: string;
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
            {formatDateForDisplay(value, locale) || placeholder}
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
        className="flex w-[var(--radix-popover-trigger-width)] flex-col items-center gap-[8.889px] rounded-[16px] px-6 py-[18px] shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)]"
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
            className="inline-flex h-[42px] w-full max-w-[244px] rounded-[12px]"
          >
            {locale === 'en' ? 'Save' : '저장'}
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

const formatDateForDisplay = (input: string, locale: string) => {
  if (!input) return '';
  const [year, month, day] = input.split('-');
  if (!year || !month || !day) return input;
  if (locale === 'en') {
    const safeDate = new Date(Number(year), Number(month) - 1, Number(day));
    return safeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

export default ClientRegistrationCounselingInfoForm;
