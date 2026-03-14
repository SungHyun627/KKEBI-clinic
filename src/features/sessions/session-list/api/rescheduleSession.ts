import { httpClient } from '@/shared/api/http-client';

export interface RescheduleSessionRequest {
  date: string;
  startTime?: string;
  endTime?: string;
}

export interface RescheduleSessionResponse {
  code?: string;
  message?: string;
  data?: Record<string, never> | null;
}

export const rescheduleSession = async (
  sessionId: string,
  payload: RescheduleSessionRequest,
): Promise<RescheduleSessionResponse> => {
  return httpClient.patch<RescheduleSessionResponse>(
    `/api/v1/sessions/${sessionId}/schedule`,
    payload,
  );
};
