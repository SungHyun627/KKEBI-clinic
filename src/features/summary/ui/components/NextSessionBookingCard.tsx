'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import Divider from '@/shared/ui/divider';

interface NextSessionBookingCardProps {
  locale: string;
  nextDate: string;
  nextStartTime: string;
  nextEndTime: string;
  onNextDateChange: (value: string) => void;
  onNextStartTimeChange: (value: string) => void;
  onNextEndTimeChange: (value: string) => void;
}

const TIME_OPTIONS = Array.from({ length: 24 * 60 }, (_, index) => {
  const hour = String(Math.floor(index / 60)).padStart(2, '0');
  const minute = String(index % 60).padStart(2, '0');
  return `${hour}:${minute}`;
});

const getWrappedIndex = (index: number, length: number) => ((index % length) + length) % length;

const parseDateFromKey = (value: string) => {
  if (!value) return new Date();
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface TimeWheelPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  align?: 'start' | 'end';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TimeWheelPicker({
  label,
  value,
  onValueChange,
  align = 'start',
  open,
  onOpenChange,
}: TimeWheelPickerProps) {
  const tSummary = useTranslations('summary');
  const hasSelectedValue = TIME_OPTIONS.includes(value);
  const normalizedValue = hasSelectedValue ? value : '09:00';
  const [draftValue, setDraftValue] = useState(normalizedValue);
  const activeIndex = TIME_OPTIONS.indexOf(draftValue);
  const isUnchanged = hasSelectedValue && draftValue === normalizedValue;
  const panelAlignClass = align === 'end' ? '-ml-[calc(100%+45px)]' : '';

  const step = (delta: number) => {
    const nextIndex = getWrappedIndex(activeIndex + delta, TIME_OPTIONS.length);
    setDraftValue(TIME_OPTIONS[nextIndex]);
  };

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <span className="body-16 font-semibold text-label-neutral">{label}</span>
      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          if (nextOpen) setDraftValue(normalizedValue);
          onOpenChange(nextOpen);
        }}
        className="group relative flex h-14.5 w-full items-center gap-2 rounded-2xl border border-neutral-95 bg-white px-4 text-left transition-all hover:cursor-pointer hover:border-label-strong focus-within:border-label-normal"
      >
        <span className="body-14 min-w-0 flex-1 truncate font-medium text-label-alternative">
          {value || tSummary('nextSessionSelectTime')}
        </span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center">
          <Image src="/icons/clock.svg" alt="" width={24} height={24} aria-hidden />
        </span>
      </button>
      {open && (
        <div
          className={`mt-3 flex w-[calc(200%+45px)] flex-col items-center gap-[26px] rounded-[16px] border border-neutral-95 bg-white px-6 py-[18px] shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)] ${panelAlignClass}`}
        >
          <div
            className="relative h-21 w-full overflow-hidden rounded-xl bg-white"
            onWheel={(event) => {
              event.preventDefault();
              step(event.deltaY > 0 ? 1 : -1);
            }}
          >
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
                    onClick={() => setDraftValue(option)}
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
            className="w-full"
            disabled={isUnchanged}
            onClick={() => {
              onValueChange(draftValue);
              onOpenChange(false);
            }}
          >
            {tSummary('nextSessionSave')}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function NextSessionBookingCard({
  locale,
  nextDate,
  nextStartTime,
  nextEndTime,
  onNextDateChange,
  onNextStartTimeChange,
  onNextEndTimeChange,
}: NextSessionBookingCardProps) {
  const tSummary = useTranslations('summary');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState<'start' | 'end' | null>(null);
  const dateAreaRef = useRef<HTMLDivElement | null>(null);
  const timeAreaRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = useMemo(() => parseDateFromKey(nextDate), [nextDate]);
  const [draftDate, setDraftDate] = useState<Date>(selectedDate);
  const [visibleMonth, setVisibleMonth] = useState<Date>(selectedDate);

  const selectedDateLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(selectedDate);
  }, [selectedDate, locale]);

  const isDateUnchanged = toDateKey(draftDate) === toDateKey(selectedDate);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isInDateArea = dateAreaRef.current?.contains(target) ?? false;
      const isInTimeArea = timeAreaRef.current?.contains(target) ?? false;
      if (isInDateArea || isInTimeArea) return;
      setIsDatePickerOpen(false);
      setOpenTimePicker(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/add-reservation.svg"
            alt={tSummary('nextSessionIconAlt')}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {tSummary('nextSessionTitle')}
        </div>
      </div>

      <div className="grid w-full items-start gap-[52px] md:grid-cols-[270px_minmax(0,1fr)]">
        <div ref={dateAreaRef} className="flex w-[270px] flex-col items-start gap-[10px]">
          <span className="body-16 font-semibold text-label-neutral">
            {tSummary('nextSessionDateLabel')}
          </span>
          <button
            type="button"
            aria-label={tSummary('nextSessionPickDateAria')}
            onClick={() => {
              const nextOpen = !isDatePickerOpen;
              if (nextOpen) {
                setDraftDate(selectedDate);
                setVisibleMonth(selectedDate);
                setOpenTimePicker(null);
              }
              setIsDatePickerOpen(nextOpen);
            }}
            className="group relative flex h-14.5 w-full items-center gap-[10px] rounded-2xl border border-neutral-95 bg-white px-4 text-left transition-all hover:cursor-pointer hover:border-label-strong focus-within:border-label-normal"
          >
            <span className="body-14 min-w-0 flex-1 truncate font-medium text-label-alternative">
              {selectedDateLabel}
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
              <Image src="/icons/calendar.svg" alt="" width={20} height={20} aria-hidden />
            </span>
          </button>
          {isDatePickerOpen && (
            <div className="mt-3 flex w-full flex-col gap-3 rounded-[16px] border border-neutral-95 px-1 py-4.5 shadow-[0_2px_8px_0_rgba(0,0,0,0.12),0_1px_4px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.08)]">
              <Calendar
                className="mx-auto"
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
                  disabled={isDateUnchanged}
                  onClick={() => {
                    onNextDateChange(toDateKey(draftDate));
                    setIsDatePickerOpen(false);
                  }}
                >
                  {tSummary('nextSessionSave')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div
          ref={timeAreaRef}
          className="grid w-full max-w-[405px] grid-cols-[minmax(0,1fr)_15px_minmax(0,1fr)] items-start gap-[15px]"
        >
          <TimeWheelPicker
            label={tSummary('nextSessionStartTime')}
            value={nextStartTime}
            onValueChange={onNextStartTimeChange}
            align="start"
            open={openTimePicker === 'start'}
            onOpenChange={(nextOpen) => {
              setOpenTimePicker(nextOpen ? 'start' : null);
            }}
          />
          <div className="flex h-full w-full justify-center items-start pt-16">
            <Divider className="h-[2.5px] bg-[#303030]" />
          </div>
          <TimeWheelPicker
            label={tSummary('nextSessionEndTime')}
            value={nextEndTime}
            onValueChange={onNextEndTimeChange}
            align="end"
            open={openTimePicker === 'end'}
            onOpenChange={(nextOpen) => {
              setOpenTimePicker(nextOpen ? 'end' : null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
