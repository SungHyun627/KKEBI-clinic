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

export interface ProcessAudioChunkResult {
  success: boolean;
  message?: string;
  data?: AudioChunkResponse;
}

const toApiSpeaker = (speaker: ProcessAudioChunkParams['speaker']) =>
  speaker === 'counselor' ? 'COUNSELOR' : 'CLIENT';

const SPRING_LOCAL_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?$/;

const normalizeTimestampParam = (value?: string) => {
  if (!value) return null;
  const formatLocalDateTime = (date: Date) => {
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
  };

  if (SPRING_LOCAL_DATE_TIME_PATTERN.test(value)) return value;

  if (/^\d+$/.test(value)) {
    const parsedEpoch = Number(value);
    if (!Number.isFinite(parsedEpoch)) return null;
    return formatLocalDateTime(new Date(parsedEpoch));
  }
  const parsedDate = Date.parse(value);
  if (Number.isNaN(parsedDate)) return null;
  return formatLocalDateTime(new Date(parsedDate));
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
      speaker: toApiSpeaker(speaker),
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
