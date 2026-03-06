'use client';

import { useState } from 'react';
import { startSessionById } from '../api/startSessionById';

interface UseStartSessionParams {
  sessionId: string;
}

interface StartSessionResult {
  success: boolean;
  message?: string;
}

export const useStartSession = ({ sessionId }: UseStartSessionParams) => {
  const [isStartingSession, setIsStartingSession] = useState(false);

  const startSession = async (): Promise<StartSessionResult> => {
    if (isStartingSession) {
      return { success: false, message: 'Session start is already in progress' };
    }

    setIsStartingSession(true);
    try {
      const result = await startSessionById({ sessionId, source: 'WEB' });
      return { success: result.success, message: result.message };
    } finally {
      setIsStartingSession(false);
    }
  };

  return {
    isStartingSession,
    startSession,
  };
};
