'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Button } from '@/shared/ui/button';

interface NextCounselingDatePickerProps {
  label?: string;
  initialValue: string;
}

export default function NextCounselingDatePicker({
  label = '다음 상담일',
  initialValue,
}: NextCounselingDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(extractDatePart(initialValue));
  const [draftDate, setDraftDate] = useState(extractDatePart(initialValue));
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    parseDateFromIso(extractDatePart(initialValue)) ?? new Date(),
  );

  const displayValue = useMemo(() => toKoreanDate(selectedDate), [selectedDate]);

  const selected = draftDate ? new Date(draftDate) : undefined;

  return (
    <div className="flex w-full flex-col items-start gap-[9px]">
      <span className="body-14 w-[74px] text-neutral-60">{label}</span>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setDraftDate(selectedDate);
            setVisibleMonth(parseDateFromIso(selectedDate) ?? new Date());
          }
          setOpen(nextOpen);
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="다음 상담일 선택"
            className="group relative flex h-14.5 w-full items-center gap-2 rounded-2xl border border-neutral-95 bg-white px-4 text-left transition-all hover:cursor-pointer hover:border-label-strong focus-within:border-label-normal"
          >
            <span className="body-14 min-w-0 flex-1 truncate font-medium text-label-alternative">
              {displayValue}
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
              <Image src="/icons/calendar.svg" alt="calendar" width={20} height={20} aria-hidden />
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
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              setDraftDate(`${year}-${month}-${day}`);
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
                setOpen(false);
              }}
            >
              저장
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function extractDatePart(input: string) {
  const [date] = input.split(' ');
  if (!date) return '';
  return date;
}

function parseDateFromIso(input: string) {
  if (!input) return null;
  const parsed = new Date(input.includes(' ') ? input.replace(' ', 'T') : input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toKoreanDate(input: string) {
  const parsed = new Date(input.includes(' ') ? input.replace(' ', 'T') : input);
  if (Number.isNaN(parsed.getTime())) return input;
  return `${parsed.getFullYear()}년 ${parsed.getMonth() + 1}월 ${parsed.getDate()}일`;
}
