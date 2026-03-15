import type { RiskType, SessionType } from '@/entities/dashboard/model/types';

const STORAGE_KEY = 'kkebi-session-start-context';

export interface SessionStartContextValue {
  name?: string;
  sessionType?: SessionType;
  riskType?: RiskType;
}

type SessionIdentifier = string | number;

type SessionStartContextMap = Record<string, SessionStartContextValue>;

let memoryStore: SessionStartContextMap = {};

const isBrowser = () => typeof window !== 'undefined';

const readStorage = (): SessionStartContextMap => {
  if (!isBrowser()) return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SessionStartContextMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStorage = (value: SessionStartContextMap) => {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

export const setSessionStartContext = (
  sessionId: SessionIdentifier,
  value: SessionStartContextValue,
) => {
  if (!sessionId) return;
  const key = String(sessionId);
  const next = { ...readStorage(), ...memoryStore, [key]: value };
  memoryStore = next;
  writeStorage(next);
};

export const getSessionStartContext = (
  sessionId: SessionIdentifier,
): SessionStartContextValue | null => {
  if (!sessionId) return null;
  const key = String(sessionId);
  const stored = readStorage();
  memoryStore = { ...stored, ...memoryStore };
  return memoryStore[key] ?? null;
};
