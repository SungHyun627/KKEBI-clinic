import Image from 'next/image';
import { Button } from '@/shared/ui/button';

interface TodayScheduleActionProps {
  clientName: string;
}

export default function TodayScheduleAction({ clientName }: TodayScheduleActionProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="icon"
        size="icon"
        aria-label={`${clientName} 알림 전송`}
        className="h-9 w-9 rounded-full border-neutral-95"
      >
        <Image src="/icons/sent.svg" alt="" width={18} height={18} aria-hidden />
      </Button>
      <Button type="button" size="sm">
        시작하기
      </Button>
    </div>
  );
}
