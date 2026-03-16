import { describe, expect, it } from 'vitest';
import { getSessionAutoRecordStorageKey, getSessionSummaryStorageKey } from './storage';

describe('session storage key', () => {
  it('세션 자동기록 저장 키를 생성한다', () => {
    expect(getSessionAutoRecordStorageKey('123')).toBe('kkebi:session-auto-record:123');
  });

  it('세션 요약 저장 키를 생성한다', () => {
    expect(getSessionSummaryStorageKey('abc')).toBe('kkebi:session-summary:abc');
  });
});
