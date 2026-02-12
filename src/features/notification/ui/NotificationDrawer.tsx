'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getNotifications } from '@/features/notification/api/getNotifications';
import type {
  NotificationItem,
  RiskNotification,
  NotificationViewMode,
} from '@/features/notification/types/notification';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '@/shared/ui/drawer';
import NotificationItem from './NotificationItem';
import RiskNotificationItem from './RiskNotificationItem';

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

  const handleNotificationClick = (detailPath: string) => {
    onOpenChange(false);
    router.push(detailPath);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={`flex flex-col items-start gap-[26px] px-[20px] pb-0 pt-[23px] ${
          viewMode === 'risk' ? 'bg-fill-pressed' : 'bg-neutral-99'
        }`}
      >
        <DrawerClose asChild>
          <button
            type="button"
            aria-label="접기"
            className="flex h-6 w-6 items-center justify-center hover:cursor-pointer"
          >
            <Image src="/icons/fold.svg" alt="접기" width={20} height={20} />
          </button>
        </DrawerClose>
        <div className="flex h-full w-full flex-col items-start gap-4">
          <div className="w-full">
            <DrawerTitle>{viewMode === 'risk' ? '위험 알림' : '알림'}</DrawerTitle>
          </div>

          <div className="flex-1 w-full space-y-2 overflow-y-auto rounded-t-[12px] p-3">
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
              viewMode === 'risk' &&
              notifications
                .filter(
                  (notification): notification is RiskNotification => notification.type === 'risk',
                )
                .map((notification) => (
                  <RiskNotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification.detailPath)}
                  />
                ))}

            {!isLoading &&
              !errorMessage &&
              viewMode === 'all' &&
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification.detailPath)}
                />
              ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
