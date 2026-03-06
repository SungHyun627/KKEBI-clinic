'use client';

import { useLocale } from 'next-intl';
import { toast } from '@/shared/ui/toast';
import { scheduleSession } from '../api/scheduleSession';

interface ScheduleSessionButtonProps {
  onCreated?: () => void;
}

const ScheduleSessionButton = ({ onCreated }: ScheduleSessionButtonProps) => {
  const locale = useLocale();

  const handleCreateReservation = async () => {
    const clientIdInput = window.prompt(
      locale === 'en' ? 'Client ID' : '내담자 ID를 입력하세요',
      '1',
    );
    if (!clientIdInput) return;

    const clientId = Number(clientIdInput);
    if (!Number.isFinite(clientId) || clientId <= 0) {
      toast(locale === 'en' ? 'Invalid client ID.' : '유효한 내담자 ID가 아닙니다.');
      return;
    }

    const now = new Date();
    const defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')}`;
    const scheduledDateInput = window.prompt(
      locale === 'en'
        ? 'Scheduled date (YYYY-MM-DD, e.g. 2026-03-06)'
        : '상담 일자를 입력하세요 (YYYY-MM-DD, 예: 2026-03-06)',
      defaultDate,
    );
    if (!scheduledDateInput) return;

    const scheduledTimeInput = window.prompt(
      locale === 'en'
        ? 'Scheduled time (HH:mm, e.g. 23:00 or 11:00)'
        : '상담 시간을 입력하세요 (HH:mm, 예: 23:00 또는 11:00)',
      '10:00',
    );
    if (!scheduledTimeInput) return;

    const normalizedDateInput = scheduledDateInput.includes('T')
      ? scheduledDateInput
      : `${scheduledDateInput}T${scheduledTimeInput}:00`;
    const parsedDate = new Date(normalizedDateInput);
    if (Number.isNaN(parsedDate.getTime())) {
      toast(
        locale === 'en'
          ? 'Invalid scheduled date/time format.'
          : '상담 일자/시간 형식이 올바르지 않습니다.',
      );
      return;
    }

    const result = await scheduleSession({
      clientId,
      scheduledAt: parsedDate.toISOString(),
    });

    if (!result.success) {
      toast(
        result.message ||
          (locale === 'en' ? 'Failed to create session.' : '상담 예약 생성에 실패했습니다.'),
      );
      return;
    }

    toast(locale === 'en' ? 'Session reservation created.' : '상담 예약이 생성되었습니다.');
    onCreated?.();
  };

  return (
    <button
      type="button"
      onClick={handleCreateReservation}
      className="rounded-[10px] border border-neutral-95 px-3 py-2 body-14 font-medium text-label-normal hover:cursor-pointer hover:bg-neutral-99"
    >
      {locale === 'en' ? 'Create Session' : '상담 예약 생성'}
    </button>
  );
};

export default ScheduleSessionButton;
