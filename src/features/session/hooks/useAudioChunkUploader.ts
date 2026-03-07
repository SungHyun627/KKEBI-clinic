'use client';

import { useRef, useState } from 'react';
import { processAudioChunk } from '../api/processAudioChunk';

interface UploadChunkParams {
  speaker: 'counselor' | 'client';
  audioFile: Blob;
  timestamp?: string;
}

interface UseAudioChunkUploaderParams {
  sessionId: string;
  fastApiSessionId: string;
}

export const useAudioChunkUploader = ({
  sessionId,
  fastApiSessionId,
}: UseAudioChunkUploaderParams) => {
  // Upload status for UI/debugging
  const [isUploading, setIsUploading] = useState(false);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const inFlightRef = useRef<Promise<void> | null>(null);

  // Serialize chunk uploads to avoid race conditions in transcript ordering.
  const uploadChunk = async ({ speaker, audioFile, timestamp }: UploadChunkParams) => {
    const task = async () => {
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
    };

    inFlightRef.current = (inFlightRef.current ?? Promise.resolve()).then(task).catch(task);
    await inFlightRef.current;
  };

  return {
    isUploading,
    lastErrorMessage,
    uploadChunk,
  };
};
