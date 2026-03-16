'use client';

import { useTranslations } from 'next-intl';
import { toast } from '@/shared/ui/toast';
import { scheduleSession } from '../api/scheduleSession';

interface ScheduleSessionButtonProps {
  onCreated?: () => void;
}

const ScheduleSessionButton = ({ onCreated }: ScheduleSessionButtonProps) => {
  const tSession = useTranslations('sessionList');

  const handleCreateReservation = async () => {
    const clientIdInput = window.prompt(tSession('createSessionPromptClientId'), '1');
    if (!clientIdInput) return;

    const clientId = Number(clientIdInput);
    if (!Number.isFinite(clientId) || clientId <= 0) {
      toast(tSession('createSessionInvalidClientId'));
      return;
    }

    const now = new Date();
    const defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')}`;
    const scheduledDateInput = window.prompt(tSession('createSessionPromptDate'), defaultDate);
    if (!scheduledDateInput) return;

    const scheduledTimeInput = window.prompt(tSession('createSessionPromptTime'), '10:00');
    if (!scheduledTimeInput) return;

    const normalizedDate = scheduledDateInput.includes('T')
      ? scheduledDateInput.slice(0, 10)
      : scheduledDateInput;
    const dateMatch = normalizedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const timeMatch = scheduledTimeInput.match(/^(\d{2}):(\d{2})$/);
    if (!dateMatch || !timeMatch) {
      toast(tSession('createSessionInvalidDateTime'));
      return;
    }

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
      toast(tSession('createSessionInvalidDateTime'));
      return;
    }

    // Interpret input as local time (KST for KR users), then convert to UTC ISO for backend.
    const parsedDate = new Date(year, month - 1, day, hour, minute, 0);
    if (Number.isNaN(parsedDate.getTime())) {
      toast(tSession('createSessionInvalidDateTime'));
      return;
    }

    const result = await scheduleSession({
      clientId,
      scheduledAt: parsedDate.toISOString(),
    });

    if (!result.success) {
      toast(result.message || tSession('createSessionFailed'));
      return;
    }

    toast(tSession('createSessionSuccess'));
    onCreated?.();
  };

  return (
    <button
      type="button"
      onClick={handleCreateReservation}
      className="rounded-[10px] border border-neutral-95 px-3 py-2 body-14 font-medium text-label-normal hover:cursor-pointer hover:bg-neutral-99"
    >
      {tSession('createSessionButton')}
    </button>
  );
};

export default ScheduleSessionButton;
