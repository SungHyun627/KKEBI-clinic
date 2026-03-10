'use client';

import { useRef, useState } from 'react';
import { processAudioChunk } from '../api/processAudioChunk';
import type { ProcessAudioChunkResult } from '../api/processAudioChunk';

interface UploadChunkParams {
  speaker: 'counselor' | 'client';
  audioFile: Blob;
  timestamp?: string;
}

interface UseAudioChunkUploaderParams {
  sessionId: string;
  fastApiSessionId: string | null;
}

export const useAudioChunkUploader = ({
  sessionId,
  fastApiSessionId,
}: UseAudioChunkUploaderParams) => {
  // Upload status for UI/debugging
  const [isUploading, setIsUploading] = useState(false);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const inFlightRef = useRef<Promise<ProcessAudioChunkResult | null> | null>(null);

  // Serialize chunk uploads to avoid race conditions in transcript ordering.
  const uploadChunk = async ({ speaker, audioFile, timestamp }: UploadChunkParams) => {
    const task = async (): Promise<ProcessAudioChunkResult | null> => {
      if (!fastApiSessionId) {
        const message = 'fastApiSessionId is missing';
        setLastErrorMessage(message);
        return {
          success: false,
          message,
        };
      }

      setIsUploading(true);
      setLastErrorMessage(null);
      const result = await processAudioChunk({
        sessionId,
        speaker,
        fastApiSessionId,
        timestamp,
        audioFile,
      });
      if (!result.success) {
        setLastErrorMessage(result.message ?? 'Failed to upload audio chunk');
      }
      setIsUploading(false);
      return result;
    };

    const queuedTask = (inFlightRef.current ?? Promise.resolve(null)).catch(() => null).then(task);
    inFlightRef.current = queuedTask;
    return await queuedTask;
  };

  return {
    isUploading,
    lastErrorMessage,
    uploadChunk,
  };
};
