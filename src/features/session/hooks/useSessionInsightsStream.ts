'use client';

import { useEffect, useRef, useState } from 'react';
import type { SessionInsightsStreamEvent, SessionInsightsStreamStatus } from '../types/session';
import { ensureAccessToken } from '@/shared/api/http-client';
import { clearAccessToken, getAccessToken } from '@/shared/api/token-store';

interface UseSessionInsightsStreamParams {
  sessionId: string;
  enabled: boolean;
  onEvent?: (event: SessionInsightsStreamEvent) => void;
}

const MAX_RETRY_DELAY_MS = 30_000;
const BASE_RETRY_DELAY_MS = 1_000;
const CUSTOM_EVENT_TYPES = [
  'insight',
  'INSIGHT',
  'insights',
  'INSIGHTS',
  'analysis',
  'ANALYSIS',
  'transcript',
  'TRANSCRIPT',
  'summary',
  'SUMMARY',
] as const;

const parseJsonSafely = (value: string) => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
};

const normalizeEvent = (type: string, raw: string): SessionInsightsStreamEvent => {
  const parsed = parseJsonSafely(raw);
  if (typeof parsed === 'object' && parsed && 'type' in parsed) {
    const payloadType = (parsed as { type?: unknown }).type;
    if (typeof payloadType === 'string' && payloadType.length > 0) {
      return { type: payloadType, data: parsed, raw };
    }
  }
  return { type, data: parsed, raw };
};

export const useSessionInsightsStream = ({
  sessionId,
  enabled,
  onEvent,
}: UseSessionInsightsStreamParams) => {
  // Connection status + retry metadata (updated by SSE callbacks)
  const [status, setStatus] = useState<SessionInsightsStreamStatus>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const onEventRef = useRef<typeof onEvent>(onEvent);

  // Keep latest callback without re-subscribing SSE connection.
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) {
      retryCountRef.current = 0;
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      return;
    }

    let isUnmounted = false;

    const connect = async () => {
      if (isUnmounted) return;

      const hasAccessToken = await ensureAccessToken();
      if (!hasAccessToken || isUnmounted) {
        setStatus('error');
        setErrorMessage('Failed to subscribe to insights stream');
        retryCountRef.current += 1;
        setRetryCount(retryCountRef.current);
        const delay = Math.min(
          BASE_RETRY_DELAY_MS * 2 ** (retryCountRef.current - 1),
          MAX_RETRY_DELAY_MS,
        );
        retryTimerRef.current = window.setTimeout(() => {
          void connect();
        }, delay);
        return;
      }

      const params = new URLSearchParams();
      // EventSource cannot send Authorization header, so forward token via BFF query
      const accessToken = getAccessToken();
      if (accessToken) params.set('accessToken', accessToken);
      const query = params.toString();
      const source = new EventSource(
        `/api/v1/sessions/${encodeURIComponent(sessionId)}/insights/stream${query ? `?${query}` : ''}`,
        { withCredentials: true },
      );
      eventSourceRef.current = source;

      source.onopen = () => {
        if (isUnmounted) return;
        retryCountRef.current = 0;
        setRetryCount(0);
        setStatus('open');
        setErrorMessage(null);
      };

      // Default "message" event
      source.onmessage = (event) => {
        onEventRef.current?.(normalizeEvent('message', event.data));
      };

      // Backend custom event names (if event: <type> is used)
      CUSTOM_EVENT_TYPES.forEach((eventType) => {
        source.addEventListener(eventType, (event) => {
          const data = (event as MessageEvent<string>).data;
          onEventRef.current?.(normalizeEvent(eventType, data));
        });
      });

      source.onerror = () => {
        if (isUnmounted) return;
        setStatus('error');
        setErrorMessage('Failed to subscribe to insights stream');
        // Force next reconnect attempt to refresh token instead of reusing a stale one.
        clearAccessToken();

        source.close();
        if (eventSourceRef.current === source) {
          eventSourceRef.current = null;
        }

        retryCountRef.current += 1;
        setRetryCount(retryCountRef.current);
        const delay = Math.min(
          BASE_RETRY_DELAY_MS * 2 ** (retryCountRef.current - 1),
          MAX_RETRY_DELAY_MS,
        );
        retryTimerRef.current = window.setTimeout(() => {
          void connect();
        }, delay);
      };
    };

    void connect();

    // Cleanup on unmount / dependency change
    return () => {
      isUnmounted = true;
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [enabled, sessionId]);

  // Derive public state for disabled mode without synchronously setting state in effect
  const derivedStatus: SessionInsightsStreamStatus = enabled ? status : 'idle';
  const derivedRetryCount = enabled ? retryCount : 0;
  const derivedErrorMessage = enabled ? errorMessage : null;

  return {
    status: derivedStatus,
    retryCount: derivedRetryCount,
    errorMessage: derivedErrorMessage,
  };
};
