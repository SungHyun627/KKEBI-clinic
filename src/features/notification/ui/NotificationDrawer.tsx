'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getNotifications } from '@/features/notification/api/getNotifications';
import type {
  NotificationItem as NotificationItemType,
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
  const tNav = useTranslations('nav');
  const tNotification = useTranslations('notification');
  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
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
        setErrorMessage(result.message || tNotification('commonLoadFailed'));
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
      <DrawerContent
        className={`flex flex-col items-start gap-[26px] px-[20px] pb-0 pt-[23px] ${
          viewMode === 'risk' ? 'bg-fill-pressed' : 'bg-neutral-99'
        }`}
      >
        <DrawerClose asChild>
          <button
            type="button"
            aria-label={tNotification('commonFold')}
            className="flex h-6 w-6 items-center justify-center hover:cursor-pointer"
          >
            <Image src="/icons/fold.svg" alt={tNotification('commonFold')} width={20} height={20} />
          </button>
        </DrawerClose>
        <div className="flex h-full w-full flex-col items-start gap-4">
          <div className="w-full">
            <DrawerTitle>
              {viewMode === 'risk' ? tNotification('riskTitle') : tNav('notifications')}
            </DrawerTitle>
          </div>

          <div className="relative flex flex-col counselor-inquiry-scroll flex-1 w-full overflow-y-auto gap-4">
            {isLoading ? (
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="body-16 text-label-alternative">{tNotification('commonLoading')}</p>
              </div>
            ) : null}
            {!isLoading && errorMessage ? (
              <p className="body-16 text-status-negative">{errorMessage}</p>
            ) : null}
            {!isLoading && !errorMessage && notifications.length === 0 ? (
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="body-16 text-label-alternative">{tNotification('commonEmpty')}</p>
              </div>
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
                    onImmediateCheck={() => onOpenChange(false)}
                  />
                ))}

            {!isLoading &&
              !errorMessage &&
              viewMode === 'all' &&
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
