'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { startSessionById } from '../api/startSessionById';
import { toast } from '@/shared/ui/toast';

export type MicPermissionState = 'idle' | 'requesting' | 'granted' | 'denied';

interface UseRecordingControllerParams {
  sessionId: string;
}

export const useRecordingController = ({ sessionId }: UseRecordingControllerParams) => {
  const tSession = useTranslations('sessionList');
  const [micPermission, setMicPermission] = useState<MicPermissionState>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (!isRecording || isPaused) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPaused, isRecording]);

  useEffect(() => {
    if (!isRecording || isPaused) return;
    const levelTimer = window.setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 100));
    }, 250);
    return () => window.clearInterval(levelTimer);
  }, [isPaused, isRecording]);

  const handleStartRecording = async () => {
    if (isRecording || isStartingSession) return;
    if (!navigator?.mediaDevices?.getUserMedia) {
      toast(tSession('toastMicUnsupported'));
      return;
    }

    setMicPermission('requesting');
    setIsStartingSession(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const startResult = await startSessionById({ sessionId, source: 'WEB' });
      if (!startResult.success) {
        setMicPermission('idle');
        toast(startResult.message || tSession('loadFailed'));
        return;
      }

      setMicPermission('granted');
      setIsRecording(true);
      setIsPaused(false);
    } catch {
      setMicPermission('denied');
      toast(tSession('toastMicPermissionDenied'));
    } finally {
      setIsStartingSession(false);
    }
  };

  const handlePauseResume = () => {
    if (!isRecording) return;
    setIsPaused((prev) => !prev);
  };

  const handlePrepareEndSession = () => {
    if (!isRecording) return;
    setIsPaused(true);
    setAudioLevel(0);
  };

  return {
    micPermission,
    isRecording,
    isStartingSession,
    isPaused,
    elapsedSeconds,
    audioLevel,
    visibleAudioLevel: isRecording && !isPaused ? audioLevel : 0,
    handleStartRecording,
    handlePauseResume,
    handlePrepareEndSession,
    setMicPermission,
    setIsRecording,
    setIsPaused,
    setElapsedSeconds,
    setAudioLevel,
  };
};
