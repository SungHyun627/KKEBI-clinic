'use client';

import { Button } from '@/shared/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockNotifications = [
  { id: 'n1', title: '상담 세션 시작 10분 전', time: '방금 전' },
  { id: 'n2', title: '새 내담자 문진표가 도착했어요.', time: '5분 전' },
  { id: 'n3', title: '오늘 15:00 세션 기록 작성이 필요합니다.', time: '20분 전' },
  { id: 'n4', title: '설정 변경 요청이 접수되었습니다.', time: '1시간 전' },
];

export default function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex h-full flex-col">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="font-pretendard text-[20px] leading-[30px] text-label-normal">
              알림
            </DrawerTitle>
            <DrawerClose asChild>
              <Button type="button" variant="outline" size="sm">
                접기
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-xl border border-neutral-95 bg-neutral-99 px-4 py-3"
              >
                <p className="body-14 font-medium text-label-normal">{notification.title}</p>
                <p className="mt-1 body-12 text-label-alternative">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
