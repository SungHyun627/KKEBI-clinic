'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import Divider from '@/shared/ui/divider';

interface RescheduleSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDate: string;
  initialStartTime?: string;
}

const parseDateFromIso = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNextTime = (value: string) => {
  const [hourRaw, minuteRaw] = value.split(':');
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return '10:00';

  const total = hour * 60 + minute + 60;
  const normalized = total % (24 * 60);
  const hh = String(Math.floor(normalized / 60)).padStart(2, '0');
  const mm = String(normalized % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

const TIME_OPTIONS = Array.from({ length: 24 * 60 }, (_, index) => {
  const hour = String(Math.floor(index / 60)).padStart(2, '0');
  const minute = String(index % 60).padStart(2, '0');
  return `${hour}:${minute}`;
});

const getWrappedIndex = (index: number, length: number) => ((index % length) + length) % length;

interface TimeWheelPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}

function TimeWheelPicker({ label, value, onValueChange }: TimeWheelPickerProps) {
  const [open, setOpen] = useState(false);
  const normalizedValue = TIME_OPTIONS.includes(value) ? value : '09:00';
  const activeIndex = TIME_OPTIONS.indexOf(normalizedValue);

  const step = (delta: number) => {
    const nextIndex = getWrappedIndex(activeIndex + delta, TIME_OPTIONS.length);
    onValueChange(TIME_OPTIONS[nextIndex]);
  };

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <span className="body-16 font-semibold text-label-neutral">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`${label} 선택`}
            className="group relative flex h-14.5 w-full items-center gap-2 rounded-2xl border border-neutral-95 bg-white px-4 text-left transition-all hover:cursor-pointer hover:border-label-strong focus-within:border-label-normal"
          >
            <span className="body-14 min-w-0 flex-1 truncate font-medium text-label-alternative">
              {value}
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
              <Image src="/icons/clock.svg" alt="" width={24} height={24} aria-hidden />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="center"
          sideOffset={12}
          avoidCollisions={false}
          className="flex w-[var(--radix-popover-trigger-width)] self-stretch flex-col items-center gap-[26px] rounded-[16px] bg-white px-6 py-[18px] shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)]"
        >
          <div
            className="relative h-21 w-full overflow-hidden rounded-xl bg-white"
            onWheel={(event) => {
              event.preventDefault();
              step(event.deltaY > 0 ? 1 : -1);
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 rounded-lg bg-white/80" />
            <div className="flex h-full w-full flex-col items-center justify-center gap-[10px]">
              {[-1, 0, 1].map((offset) => {
                const optionIndex = getWrappedIndex(activeIndex + offset, TIME_OPTIONS.length);
                const option = TIME_OPTIONS[optionIndex];
                const distance = Math.abs(offset);

                return (
                  <button
                    key={`${option}-${offset}`}
                    type="button"
                    onClick={() => onValueChange(option)}
                    className={`flex h-[22px] w-full items-center justify-center text-center leading-[22px] transition-colors hover:cursor-pointer ${
                      distance === 0
                        ? 'body-14 font-semibold text-primary'
                        : 'body-14 text-label-alternative'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <Button type="button" size="md" className="w-full" onClick={() => setOpen(false)}>
            저장
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function RescheduleSessionDialog({
  open,
  onOpenChange,
  currentDate,
  initialStartTime = '09:00',
}: RescheduleSessionDialogProps) {
  const locale = useLocale();
  const tCommon = useTranslations('common');

  const [selectedDate, setSelectedDate] = useState<Date>(parseDateFromIso(currentDate));
  const [draftDate, setDraftDate] = useState<Date>(parseDateFromIso(currentDate));
  const [visibleMonth, setVisibleMonth] = useState<Date>(parseDateFromIso(currentDate));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(getNextTime(initialStartTime));

  const currentDateLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parseDateFromIso(currentDate));
  }, [currentDate, locale]);

  const selectedDateLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(selectedDate);
  }, [selectedDate, locale]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-[784px] w-full items-center px-8 py-7 gap-[26px] rounded-[24px] p-7">
        <DialogTitle className="absolute w-0 h-0 p-0 m-0 overflow-hidden">
          <VisuallyHidden>{'상담 일정 변경'}</VisuallyHidden>
        </DialogTitle>
        <div className="flex flex-col w-full gap-[26px]">
          <div className="flex flex-col w-full gap-[23px]">
            <div className="flex w-full justify-between items-center">
              <span className="text-lg font-semibold">{'상담 일정 변경'}</span>
              <button
                type="button"
                aria-label={tCommon('close')}
                className="p-1 ml-2 hover:opacity-80 cursor-pointer"
                onClick={() => onOpenChange(false)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Image src="/icons/close.svg" alt={tCommon('close')} width={28} height={28} />
              </button>
            </div>
            <div className="flex w-full gap-[45px]">
              <div className="flex w-full max-w-[270px] flex-col items-start gap-[10px]">
                <span className="body-16 font-semibold text-label-neutral">날짜</span>
                <Popover
                  open={isDatePickerOpen}
                  onOpenChange={(nextOpen) => {
                    if (nextOpen) {
                      setDraftDate(selectedDate);
                      setVisibleMonth(selectedDate);
                    }
                    setIsDatePickerOpen(nextOpen);
                  }}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="변경 날짜 선택"
                      className="group relative flex h-14.5 w-full items-center gap-[10px] rounded-2xl border border-neutral-95 bg-white px-4 text-left transition-all hover:cursor-pointer hover:border-label-strong focus-within:border-label-normal"
                    >
                      <span className="body-14 min-w-0 flex-1 truncate font-medium text-label-alternative">
                        {selectedDateLabel}
                      </span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                        <Image
                          src="/icons/calendar.svg"
                          alt=""
                          width={20}
                          height={20}
                          aria-hidden
                        />
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={12}
                    avoidCollisions={false}
                    className="flex w-[var(--radix-popover-trigger-width)] flex-col gap-3 rounded-[16px] px-1 py-4.5 shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)]"
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
                    <div className="flex justify-end px-2 pb-1">
                      <Button
                        type="button"
                        size="md"
                        className="w-full"
                        onClick={() => {
                          setSelectedDate(draftDate);
                          setIsDatePickerOpen(false);
                        }}
                      >
                        저장
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex w-full gap-[15px] items-start justify-center">
                <TimeWheelPicker label="시작 시간" value={startTime} onValueChange={setStartTime} />
                <div className="flex w-[15px] self-end pb-[29px]">
                  <Divider className="h-[2.5px] bg-[#303030]" />
                </div>
                <TimeWheelPicker label="종료 시간" value={endTime} onValueChange={setEndTime} />
              </div>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="md" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              type="button"
              size="md"
              onClick={() => {
                void toDateKey(selectedDate);
                onOpenChange(false);
              }}
            >
              변경하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
