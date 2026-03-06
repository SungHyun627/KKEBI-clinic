'use client';

import { useQuery } from '@tanstack/react-query';
import { getSessionInfo } from '../api/getSessionInfo';
import type { SessionBasicInfo } from '../types/session-page';

interface UseSessionInfoParams {
  sessionId: string;
}

export const useSessionInfo = ({ sessionId }: UseSessionInfoParams) => {
  const query = useQuery({
    queryKey: ['session', 'info', sessionId],
    queryFn: async () => {
      const result = await getSessionInfo(sessionId);
      if (result.code !== 'SUCCESS' || !result.data) {
        throw new Error(result.message || 'Failed to load session data');
      }
      return result.data as SessionBasicInfo;
    },
    enabled: Boolean(sessionId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const errorMessage =
    query.error instanceof Error
      ? query.error.message
      : query.isError
        ? 'Failed to load session data'
        : null;

  return {
    data: query.data ?? null,
    loading: query.isPending,
    error: errorMessage,
  };
};
