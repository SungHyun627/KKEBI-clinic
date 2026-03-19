import { describe, expect, it } from 'vitest';
import enMessages from '../../messages/en.json';
import koMessages from '../../messages/ko.json';

type JsonObject = Record<string, unknown>;

const collectLeafPaths = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  const entries = Object.entries(value as JsonObject);
  if (entries.length === 0) {
    return prefix ? [prefix] : [];
  }

  return entries.flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return collectLeafPaths(child, nextPrefix);
  });
};

describe('i18n message parity', () => {
  it('ko/en 메시지 키가 동일하다', () => {
    const koPaths = new Set(collectLeafPaths(koMessages));
    const enPaths = new Set(collectLeafPaths(enMessages));

    const missingInEn = [...koPaths].filter((path) => !enPaths.has(path));
    const missingInKo = [...enPaths].filter((path) => !koPaths.has(path));

    expect(
      {
        missingInEn,
        missingInKo,
      },
      'ko/en message key mismatch',
    ).toEqual({
      missingInEn: [],
      missingInKo: [],
    });
  });
});
