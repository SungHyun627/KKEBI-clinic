'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/ui/toast';
import { rescheduleSession } from '../api/rescheduleSession';
import { sessionListQueryKey } from '../lib/query-keys';

interface UseRescheduleSessionDialogParams {
  sessionId: string;
  currentDate: string;
  initialStartTime: string;
  onOpenChange: (open: boolean) => void;
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

const toUtcIsoString = (dateKey: string, time: string) => {
  const dateMatch = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = time.match(/^(\d{2}):(\d{2})$/);
  if (!dateMatch || !timeMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  const localDate = new Date(year, month - 1, day, hour, minute, 0);
  if (Number.isNaN(localDate.getTime())) return null;
  return localDate.toISOString();
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

export const useRescheduleSessionDialog = ({
  sessionId,
  currentDate,
  initialStartTime,
  onOpenChange,
}: UseRescheduleSessionDialogParams) => {
  const locale = useLocale();
  const tSessions = useTranslations('sessionList');
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date>(parseDateFromIso(currentDate));
  const [draftDate, setDraftDate] = useState<Date>(parseDateFromIso(currentDate));
  const [visibleMonth, setVisibleMonth] = useState<Date>(parseDateFromIso(currentDate));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(getNextTime(initialStartTime));
  const [openTimePicker, setOpenTimePicker] = useState<'start' | 'end' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDateLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(selectedDate);
  }, [selectedDate, locale]);

  const isDateUnchanged = toDateKey(draftDate) === toDateKey(selectedDate);
  const initialDateKey = toDateKey(parseDateFromIso(currentDate));
  const initialEndTime = getNextTime(initialStartTime);
  const hasRescheduleChanges =
    toDateKey(selectedDate) !== initialDateKey ||
    startTime !== initialStartTime ||
    endTime !== initialEndTime;

  const handleToggleDatePicker = () => {
    const nextOpen = !isDatePickerOpen;
    if (nextOpen) {
      setDraftDate(selectedDate);
      setVisibleMonth(selectedDate);
      setOpenTimePicker(null);
    }
    setIsDatePickerOpen(nextOpen);
  };

  const handleDateSelect = (date: Date) => {
    setDraftDate(date);
    setVisibleMonth(date);
  };

  const handleApplyDate = () => {
    setSelectedDate(draftDate);
    setIsDatePickerOpen(false);
  };

  const handleStartTimePickerOpenChange = (nextOpen: boolean) => {
    setIsDatePickerOpen(false);
    setOpenTimePicker(nextOpen ? 'start' : null);
  };

  const handleEndTimePickerOpenChange = (nextOpen: boolean) => {
    setIsDatePickerOpen(false);
    setOpenTimePicker(nextOpen ? 'end' : null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const nextScheduledAt = toUtcIsoString(toDateKey(selectedDate), startTime);
      if (!nextScheduledAt) {
        throw new Error('Invalid schedule date/time');
      }
      await rescheduleSession(sessionId, { newScheduledAt: nextScheduledAt });
      await queryClient.invalidateQueries({
        queryKey: sessionListQueryKey('scheduled', locale),
      });
      toast(tSessions('rescheduleSuccessToast'));
      onOpenChange(false);
    } catch {
      toast(locale === 'en' ? 'Failed to change schedule.' : '일정 변경에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedDateLabel,
    draftDate,
    visibleMonth,
    isDatePickerOpen,
    startTime,
    endTime,
    openTimePicker,
    isSubmitting,
    isDateUnchanged,
    hasRescheduleChanges,
    setVisibleMonth,
    setStartTime,
    setEndTime,
    handleToggleDatePicker,
    handleDateSelect,
    handleApplyDate,
    handleStartTimePickerOpenChange,
    handleEndTimePickerOpenChange,
    handleSubmit,
  };
};
