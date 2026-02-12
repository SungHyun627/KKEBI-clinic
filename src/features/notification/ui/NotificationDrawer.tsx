'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getNotifications } from '@/features/notification/api/getNotifications';
import type {
  NotificationItem,
  NotificationViewMode,
} from '@/features/notification/types/notification';
import { Button } from '@/shared/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [viewMode, setViewMode] = useState<NotificationViewMode>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const loadNotifications = async () => {
      setIsLoading(true);
      const result = await getNotifications();

      if (!result.success || !result.data) {
        setNotifications([]);
        setViewMode('all');
        setErrorMessage(result.message || '알림 목록을 불러오지 못했습니다.');
        setIsLoading(false);
        return;
      }

      setNotifications(result.data.items);
      setViewMode(result.data.viewMode);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadNotifications();
  }, [open]);

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
            {!isLoading && !errorMessage ? (
              <p className="body-12 text-label-alternative">
                {viewMode === 'risk' ? '위험 알림만 표시 중' : '전체 알림 표시 중'}
              </p>
            ) : null}
            {isLoading ? (
              <p className="body-14 text-label-alternative">알림을 불러오는 중입니다.</p>
            ) : null}
            {!isLoading && errorMessage ? (
              <p className="body-14 text-status-negative">{errorMessage}</p>
            ) : null}
            {!isLoading && !errorMessage && notifications.length === 0 ? (
              <p className="body-14 text-label-alternative">최근 온 알림이 없습니다.</p>
            ) : null}

            {!isLoading &&
              !errorMessage &&
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className="w-full rounded-xl border px-4 py-3 text-left hover:cursor-pointer"
                  onClick={() => {
                    onOpenChange(false);
                    router.push(notification.detailPath);
                  }}
                >
                  {notification.type === 'risk' ? (
                    <div className="rounded-lg border border-status-negative/20 bg-status-negative/5 p-3">
                      <p className="body-14 font-semibold text-status-negative">
                        위험 알림 · {notification.name}
                      </p>
                      <p className="mt-1 body-14 text-label-normal">{notification.description}</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-neutral-95 bg-neutral-99 p-3">
                      <p className="body-14 font-medium text-label-normal">{notification.title}</p>
                      <p className="mt-1 body-14 text-neutral-40">{notification.description}</p>
                    </div>
                  )}
                  <p className="mt-2 body-12 text-label-alternative">{notification.createdAt}</p>
                </button>
              ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
