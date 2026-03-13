'use client';

import { useEffect } from 'react';
import { ensureAccessToken } from '@/shared/api/http-client';
import { getAccessToken } from '@/shared/api/token-store';
import { mapNotificationPayload } from '../api/getNotifications';
import { emitNotificationReceived } from '../lib/notification-events';
import type { NotificationItem } from '../types/notification';

interface UseNotificationSseOptions {
  enabled: boolean;
  onNotification?: (notification: NotificationItem) => void;
}

const RECONNECT_DELAY_MS = 3000;

export const useNotificationSse = ({ enabled, onNotification }: UseNotificationSseOptions) => {
  useEffect(() => {
    if (!enabled) return;

    let isCancelled = false;
    let eventSource: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const clearReconnectTimer = () => {
      if (!reconnectTimer) return;
      window.clearTimeout(reconnectTimer);
      reconnectTimer = null;
    };

    const teardown = () => {
      clearReconnectTimer();
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };

    const handleEventData = (payload: string) => {
      if (!payload) return;

      try {
        const parsed = JSON.parse(payload) as unknown;
        const notification = mapNotificationPayload(parsed);
        if (!notification) return;
        emitNotificationReceived(notification);
        onNotification?.(notification);
      } catch {
        // no-op
      }
    };

    const connect = async () => {
      const hasAccessToken = await ensureAccessToken();
      if (!hasAccessToken || isCancelled) return;

      const accessToken = getAccessToken();
      if (!accessToken) return;

      const query = new URLSearchParams({ accessToken });
      const source = new EventSource(`/api/v1/notifications/subscribe?${query.toString()}`);
      eventSource = source;

      source.addEventListener('notification', (event) => {
        handleEventData((event as MessageEvent).data);
      });

      source.onmessage = (event) => {
        handleEventData(event.data);
      };

      source.onerror = () => {
        teardown();
        if (isCancelled) return;
        reconnectTimer = window.setTimeout(() => {
          void connect();
        }, RECONNECT_DELAY_MS);
      };
    };

    void connect();

    return () => {
      isCancelled = true;
      teardown();
    };
  }, [enabled, onNotification]);
};
