import { describe, expect, it } from 'vitest';
import { isRiskType, isSessionType } from './types';

describe('summary type guards', () => {
  it('유효한 sessionType을 판별한다', () => {
    expect(isSessionType('초기')).toBe(true);
    expect(isSessionType('정기')).toBe(true);
    expect(isSessionType('위기')).toBe(true);
  });

  it('유효하지 않은 sessionType을 거부한다', () => {
    expect(isSessionType('other')).toBe(false);
    expect(isSessionType(undefined)).toBe(false);
  });

  it('유효한 riskType을 판별한다', () => {
    expect(isRiskType('안정')).toBe(true);
    expect(isRiskType('주의')).toBe(true);
    expect(isRiskType('위험')).toBe(true);
  });

  it('유효하지 않은 riskType을 거부한다', () => {
    expect(isRiskType('unknown')).toBe(false);
    expect(isRiskType(undefined)).toBe(false);
  });
});
