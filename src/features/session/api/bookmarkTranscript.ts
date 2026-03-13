import { ApiError, httpClient } from '@/shared/api/http-client';

interface ApiResponseLong {
  code?: string;
  message?: string;
  data?: number;
}

interface ApiResponseVoid {
  code?: string;
  message?: string;
}

interface BookmarkResponse {
  success: boolean;
  bookmarkId?: number;
  message?: string;
}

interface RemoveBookmarkParams {
  sessionId: string;
  bookmarkId?: number;
}

const toValidNumber = (value: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

export const addTranscriptBookmark = async (
  sessionId: string,
  transcriptId: string,
): Promise<BookmarkResponse> => {
  const parsedTranscriptId = toValidNumber(transcriptId);
  if (!parsedTranscriptId) {
    return { success: false, message: 'Invalid transcriptId' };
  }

  try {
    const response = await httpClient.post<ApiResponseLong>(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/bookmarks`,
      { transcriptId: parsedTranscriptId },
    );

    return {
      success: response.code === 'SUCCESS',
      bookmarkId: response.data,
      message: response.message,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add bookmark',
    };
  }
};

export const removeTranscriptBookmark = async ({
  sessionId,
  bookmarkId,
}: RemoveBookmarkParams): Promise<BookmarkResponse> => {
  if (!bookmarkId) {
    return { success: false, message: 'Bookmark id is required' };
  }

  try {
    const response = await httpClient.delete<ApiResponseVoid>(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/bookmarks/${bookmarkId}`,
    );

    return {
      success: response.code === 'SUCCESS',
      message: response.message,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to remove bookmark',
    };
  }
};
