/** @vitest-environment jsdom */

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSessionInsightsStream } from './useSessionInsightsStream';
import { clearAccessToken, getAccessToken } from '@/shared/api/token-store';
import { ensureAccessToken } from '@/shared/api/http-client';

vi.mock('@/shared/api/http-client', () => ({
  ensureAccessToken: vi.fn(),
}));

vi.mock('@/shared/api/token-store', () => ({
  getAccessToken: vi.fn(),
  clearAccessToken: vi.fn(),
}));

type EventSourceListener = (event: MessageEvent<string>) => void;

class FakeEventSource {
  static instances: FakeEventSource[] = [];

  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent<string>) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  close = vi.fn();
  listeners = new Map<string, EventSourceListener[]>();

  constructor(
    public url: string,
    public init?: EventSourceInit,
  ) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: EventSourceListener) {
    const prev = this.listeners.get(type) ?? [];
    this.listeners.set(type, [...prev, listener]);
  }

  emitOpen() {
    this.onopen?.(new Event('open'));
  }

  emitMessage(data: string) {
    this.onmessage?.({ data } as MessageEvent<string>);
  }

  emitError() {
    this.onerror?.(new Event('error'));
  }

  emitCustom(type: string, data: string) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.forEach((listener) => listener({ data } as MessageEvent<string>));
  }
}

describe('useSessionInsightsStream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    FakeEventSource.instances = [];
    vi.mocked(ensureAccessToken).mockResolvedValue(true);
    vi.mocked(getAccessToken).mockReturnValue('token-1');
    globalThis.EventSource = FakeEventSource as unknown as typeof EventSource;
  });

  const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

  it('연결 성공 시 open 상태와 토큰 쿼리 URL을 사용한다', async () => {
    const { result } = renderHook(() =>
      useSessionInsightsStream({
        sessionId: 'session-1',
        enabled: true,
      }),
    );

    await waitFor(() => {
      expect(FakeEventSource.instances.length).toBe(1);
    });

    const source = FakeEventSource.instances[0];
    expect(source?.url).toBe('/api/v1/sessions/session-1/insights/stream?accessToken=token-1');
    expect(source?.init).toEqual({ withCredentials: true });

    act(() => {
      source?.emitOpen();
    });

    await waitFor(() => {
      expect(result.current.status).toBe('open');
      expect(result.current.retryCount).toBe(0);
      expect(result.current.errorMessage).toBeNull();
    });
  });

  it('연결 에러 시 backoff 재시도하고 복구되면 retryCount를 초기화한다', async () => {
    const { result } = renderHook(() =>
      useSessionInsightsStream({
        sessionId: 'session-2',
        enabled: true,
      }),
    );

    await waitFor(() => {
      expect(FakeEventSource.instances.length).toBe(1);
    });

    const firstSource = FakeEventSource.instances[0];
    act(() => {
      firstSource?.emitError();
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(result.current.retryCount).toBe(1);
      expect(result.current.errorMessage).toBe('Failed to subscribe to insights stream');
    });
    expect(vi.mocked(clearAccessToken)).toHaveBeenCalledTimes(1);
    expect(firstSource?.close).toHaveBeenCalledTimes(1);

    await sleep(900);
    expect(FakeEventSource.instances.length).toBe(1);

    await waitFor(() => {
      expect(FakeEventSource.instances.length).toBe(2);
    });

    const secondSource = FakeEventSource.instances[1];
    act(() => {
      secondSource?.emitOpen();
    });

    await waitFor(() => {
      expect(result.current.status).toBe('open');
      expect(result.current.retryCount).toBe(0);
      expect(result.current.errorMessage).toBeNull();
    });
  });

  it('cleanup 시 타이머와 EventSource를 정리한다', async () => {
    const { unmount } = renderHook(() =>
      useSessionInsightsStream({
        sessionId: 'session-3',
        enabled: true,
      }),
    );

    await waitFor(() => {
      expect(FakeEventSource.instances.length).toBe(1);
    });

    const source = FakeEventSource.instances[0];
    act(() => {
      source?.emitError();
    });

    unmount();

    await sleep(1_100);
    expect(FakeEventSource.instances.length).toBe(1);
  });

  it('message/custom 이벤트를 정규화해서 onEvent로 전달한다', async () => {
    const onEvent = vi.fn();

    renderHook(() =>
      useSessionInsightsStream({
        sessionId: 'session-4',
        enabled: true,
        onEvent,
      }),
    );

    await waitFor(() => {
      expect(FakeEventSource.instances.length).toBe(1);
    });

    const source = FakeEventSource.instances[0];
    act(() => {
      source?.emitMessage('{"type":"transcript","text":"hello"}');
      source?.emitCustom('analysis', '{"score":14}');
    });

    await waitFor(() => {
      expect(onEvent).toHaveBeenCalledTimes(2);
    });
    expect(onEvent).toHaveBeenNthCalledWith(1, {
      type: 'transcript',
      data: { type: 'transcript', text: 'hello' },
      raw: '{"type":"transcript","text":"hello"}',
    });
    expect(onEvent).toHaveBeenNthCalledWith(2, {
      type: 'analysis',
      data: { score: 14 },
      raw: '{"score":14}',
    });
  });

  it('enabled=false면 공개 상태를 idle로 유지한다', () => {
    const { result } = renderHook(() =>
      useSessionInsightsStream({
        sessionId: 'session-5',
        enabled: false,
      }),
    );

    expect(result.current.status).toBe('idle');
    expect(result.current.retryCount).toBe(0);
    expect(result.current.errorMessage).toBeNull();
    expect(FakeEventSource.instances.length).toBe(0);
  });
});
