import { httpClient } from '@/shared/api/http-client';

export interface RescheduleSessionRequest {
  sessionDate: string;
  startTime: string;
  endTime: string;
}

export interface RescheduleSessionResponse {
  success: boolean;
  message?: string;
  data?: {
    sessionId: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
  };
}

export const rescheduleSession = async (
  sessionId: string,
  payload: RescheduleSessionRequest,
): Promise<RescheduleSessionResponse> => {
  return httpClient.patch<RescheduleSessionResponse>(
    `/api/v1/sessions/${sessionId}/reschedule`,
    payload,
    {
      skipAuth: true,
    },
  );
};
