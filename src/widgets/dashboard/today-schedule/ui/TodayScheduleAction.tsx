import Image from 'next/image';
import { Button } from '@/shared/ui/button';

interface TodayScheduleActionProps {
  clientName: string;
}

export default function TodayScheduleAction({ clientName }: TodayScheduleActionProps) {
  return (
    <div className="flex w-full items-center justify-end gap-3 pl-6">
      <Button
        type="button"
        variant="icon"
        size="icon"
        aria-label={`${clientName} 알림 전송`}
        className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
      >
        <Image src="/icons/sent.svg" alt="send-notification" width={24} height={24} aria-hidden />
      </Button>
      <Button type="button" size="md" className="w-full">
        시작하기
      </Button>
    </div>
  );
}
