'use client';

import { useEffect, useReducer } from 'react';
import { useTranslations } from 'next-intl';
import { startSessionById } from '../api/startSessionById';
import { toast } from '@/shared/ui/toast';

export type MicPermissionState = 'idle' | 'requesting' | 'granted' | 'denied';

interface UseRecordingControllerParams {
  sessionId: string;
}

// Session start/auth-related state (mic permission + start request lifecycle)
interface SessionStartState {
  micPermission: MicPermissionState;
  isStartingSession: boolean;
}

type SessionStartAction =
  | { type: 'setMicPermission'; payload: MicPermissionState }
  | { type: 'setIsStartingSession'; payload: boolean };

// Runtime recording state (recording/pause/timer/level)
interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  audioLevel: number;
}

type RecordingAction =
  | { type: 'setIsRecording'; payload: boolean }
  | { type: 'setIsPaused'; payload: boolean }
  | { type: 'togglePaused' }
  | { type: 'setElapsedSeconds'; payload: number }
  | { type: 'tickElapsedSeconds' }
  | { type: 'setAudioLevel'; payload: number };

const initialSessionStartState: SessionStartState = {
  micPermission: 'idle',
  isStartingSession: false,
};

const initialRecordingState: RecordingState = {
  isRecording: false,
  isPaused: false,
  elapsedSeconds: 0,
  audioLevel: 0,
};

// Reducer: session start/auth state transitions
const sessionStartReducer = (
  state: SessionStartState,
  action: SessionStartAction,
): SessionStartState => {
  switch (action.type) {
    case 'setMicPermission':
      return { ...state, micPermission: action.payload };
    case 'setIsStartingSession':
      return { ...state, isStartingSession: action.payload };
    default:
      return state;
  }
};

// Reducer: recording runtime state transitions
const recordingReducer = (state: RecordingState, action: RecordingAction): RecordingState => {
  switch (action.type) {
    case 'setIsRecording':
      return { ...state, isRecording: action.payload };
    case 'setIsPaused':
      return { ...state, isPaused: action.payload };
    case 'togglePaused':
      return { ...state, isPaused: !state.isPaused };
    case 'setElapsedSeconds':
      return { ...state, elapsedSeconds: action.payload };
    case 'tickElapsedSeconds':
      return { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
    case 'setAudioLevel':
      return { ...state, audioLevel: action.payload };
    default:
      return state;
  }
};

export const useRecordingController = ({ sessionId }: UseRecordingControllerParams) => {
  const tSession = useTranslations('sessionList');

  // State reducers
  const [sessionStartState, dispatchSessionStart] = useReducer(
    sessionStartReducer,
    initialSessionStartState,
  );
  const [recordingState, dispatchRecording] = useReducer(recordingReducer, initialRecordingState);
  const { micPermission, isStartingSession } = sessionStartState;
  const { isRecording, isPaused, elapsedSeconds, audioLevel } = recordingState;

  // Effects: elapsed time tick while recording
  useEffect(() => {
    if (!isRecording || isPaused) return;
    const timer = window.setInterval(() => {
      dispatchRecording({ type: 'tickElapsedSeconds' });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPaused, isRecording]);

  // Effects: demo audio level updates while recording
  useEffect(() => {
    if (!isRecording || isPaused) return;
    const levelTimer = window.setInterval(() => {
      dispatchRecording({ type: 'setAudioLevel', payload: Math.floor(Math.random() * 100) });
    }, 250);
    return () => window.clearInterval(levelTimer);
  }, [isPaused, isRecording]);

  // Action: start recording (mic permission + start-session API)
  const handleStartRecording = async () => {
    if (isRecording || isStartingSession) return;
    if (!navigator?.mediaDevices?.getUserMedia) {
      toast(tSession('toastMicUnsupported'));
      return;
    }

    dispatchSessionStart({ type: 'setMicPermission', payload: 'requesting' });
    dispatchSessionStart({ type: 'setIsStartingSession', payload: true });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const startResult = await startSessionById({ sessionId, source: 'WEB' });
      if (!startResult.success) {
        dispatchSessionStart({ type: 'setMicPermission', payload: 'idle' });
        toast(startResult.message || tSession('loadFailed'));
        return;
      }

      dispatchSessionStart({ type: 'setMicPermission', payload: 'granted' });
      dispatchRecording({ type: 'setIsRecording', payload: true });
      dispatchRecording({ type: 'setIsPaused', payload: false });
    } catch {
      dispatchSessionStart({ type: 'setMicPermission', payload: 'denied' });
      toast(tSession('toastMicPermissionDenied'));
    } finally {
      dispatchSessionStart({ type: 'setIsStartingSession', payload: false });
    }
  };

  // Action: toggle pause/resume
  const handlePauseResume = () => {
    if (!isRecording) return;
    dispatchRecording({ type: 'togglePaused' });
  };

  // Action: prepare session end (pause + zero visible level)
  const handlePrepareEndSession = () => {
    if (!isRecording) return;
    dispatchRecording({ type: 'setIsPaused', payload: true });
    dispatchRecording({ type: 'setAudioLevel', payload: 0 });
  };

  // Public API for UI + persistence hydration
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
    setMicPermission: (value: MicPermissionState) =>
      dispatchSessionStart({ type: 'setMicPermission', payload: value }),
    setIsRecording: (value: boolean) =>
      dispatchRecording({ type: 'setIsRecording', payload: value }),
    setIsPaused: (value: boolean) => dispatchRecording({ type: 'setIsPaused', payload: value }),
    setElapsedSeconds: (value: number) =>
      dispatchRecording({ type: 'setElapsedSeconds', payload: value }),
    setAudioLevel: (value: number) => dispatchRecording({ type: 'setAudioLevel', payload: value }),
  };
};
