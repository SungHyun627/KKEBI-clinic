import { getAccessToken } from '@/shared/api/token-store';

interface AudioChunkResponse {
  transcriptId?: number;
  text?: string;
  audioUrl?: string;
  topEmotion?: string;
  emotionProbs?: Record<string, number>;
}

interface ApiResponseAudioChunk {
  code?: string;
  message?: string;
  data?: AudioChunkResponse;
}

interface ProcessAudioChunkParams {
  sessionId: string;
  speaker: 'counselor' | 'client';
  fastApiSessionId: string;
  timestamp?: string;
  audioFile: Blob;
}

interface ProcessAudioChunkResult {
  success: boolean;
  message?: string;
  data?: AudioChunkResponse;
}

const normalizeTimestampParam = (value?: string) => {
  if (!value) return null;
  if (/^\d+$/.test(value)) return value;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return String(parsed);
};

export const processAudioChunk = async ({
  sessionId,
  speaker,
  fastApiSessionId,
  timestamp,
  audioFile,
}: ProcessAudioChunkParams): Promise<ProcessAudioChunkResult> => {
  try {
    const query = new URLSearchParams({
      speaker,
      fastApiSessionId,
    });
    const normalizedTimestamp = normalizeTimestampParam(timestamp);
    if (normalizedTimestamp) query.set('timestamp', normalizedTimestamp);

    const formData = new FormData();
    formData.append('audioFile', audioFile, `chunk-${Date.now()}.webm`);

    const headers = new Headers();
    const accessToken = getAccessToken();
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

    const response = await fetch(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/audio-chunk?${query.toString()}`,
      {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData,
      },
    );

    const payload = (await response.json().catch(() => null)) as ApiResponseAudioChunk | null;
    if (!response.ok || !payload) {
      return {
        success: false,
        message: payload?.message ?? 'Failed to process audio chunk',
      };
    }

    return {
      success: payload.code === 'SUCCESS',
      message: payload.message,
      data: payload.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process audio chunk',
    };
  }
};
