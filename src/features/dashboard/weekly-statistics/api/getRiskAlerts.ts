import { ApiError, httpClient } from '@/shared/api/http-client';
import type { RiskAlertsResponse } from '../../types/statistics';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

type BackendEnvelope<TData> = {
  code?: string;
  message?: string;
  data?: TData;
};

const normalizeRiskAlertsResponse = (
  payload: unknown,
  fallbackMessage: string,
): RiskAlertsResponse => {
  if (typeof payload !== 'object' || payload === null) {
    return { success: false, message: fallbackMessage };
  }

  if ('success' in payload) {
    return payload as RiskAlertsResponse;
  }

  if ('data' in payload) {
    const envelope = payload as BackendEnvelope<RiskAlertsResponse['data']>;
    return {
      success: true,
      data: envelope.data,
      message: envelope.message,
    };
  }

  return { success: false, message: fallbackMessage };
};

const requestRiskAlerts = async (url: string): Promise<RiskAlertsResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (response.ok) {
      return normalizeRiskAlertsResponse(data, '위험 알림을 불러오지 못했습니다.');
    }

    return {
      success: false,
      message:
        (typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
          ? data.message
          : undefined) || '위험 알림을 불러오지 못했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const getRiskAlerts = async (): Promise<RiskAlertsResponse> => {
  try {
    const response = await httpClient.get<unknown>('/api/v1/dashboard/risk-alerts');
    return normalizeRiskAlertsResponse(response, '위험 알림을 불러오지 못했습니다.');
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '위험 알림을 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const getRiskAlertsServer = () => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    } satisfies RiskAlertsResponse);
  }

  return requestRiskAlerts(`${SERVER_API_BASE_URL}/api/v1/dashboard/risk-alerts`);
};

export const getRiskAlertsMock = getRiskAlerts;
