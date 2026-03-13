import type { SessionStatus } from '../types/session-list';

export const sessionListQueryKey = (status: SessionStatus, locale: string) =>
  ['sessions', 'list', status, locale] as const;
