import { ensureAccessToken } from '@/shared/api/http-client';
import { getAccessToken } from '@/shared/api/token-store';

interface ApiResponseVoid {
  code?: string;
  message?: string;
}

interface UploadFullAudioFileParams {
  sessionId: string;
  audioFile: Blob;
}

interface UploadFullAudioFileResult {
  success: boolean;
  message?: string;
}

export const uploadFullAudioFile = async ({
  sessionId,
  audioFile,
}: UploadFullAudioFileParams): Promise<UploadFullAudioFileResult> => {
  try {
    const hasAccessToken = await ensureAccessToken();
    if (!hasAccessToken) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    const formData = new FormData();
    formData.append('audioFile', audioFile, `session-${sessionId}-${Date.now()}.webm`);

    const headers = new Headers();
    const accessToken = getAccessToken();
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

    const response = await fetch(`/api/v1/sessions/${encodeURIComponent(sessionId)}/audio-file`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as ApiResponseVoid | null;
    if (!response.ok || !payload) {
      return {
        success: false,
        message: payload?.message ?? 'Failed to upload full audio file',
      };
    }

    return {
      success: payload.code === 'SUCCESS',
      message: payload.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload full audio file',
    };
  }
};
