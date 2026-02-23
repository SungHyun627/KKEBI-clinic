import type { RiskType, SessionType } from '@/features/dashboard/types/schedule';

const STORAGE_KEY = 'kkebi-session-start-context';

export interface SessionStartContextValue {
  name?: string;
  sessionType?: SessionType;
  riskType?: RiskType;
}

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

export const setSessionStartContext = (sessionId: string, value: SessionStartContextValue) => {
  if (!sessionId) return;
  const next = { ...readStorage(), ...memoryStore, [sessionId]: value };
  memoryStore = next;
  writeStorage(next);
};

export const getSessionStartContext = (sessionId: string): SessionStartContextValue | null => {
  if (!sessionId) return null;
  const stored = readStorage();
  memoryStore = { ...stored, ...memoryStore };
  return memoryStore[sessionId] ?? null;
};
