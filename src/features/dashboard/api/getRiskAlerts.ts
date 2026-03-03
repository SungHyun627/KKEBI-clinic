import { ApiError, httpClient } from '@/shared/api/http-client';
import type { RiskAlertsResponse } from '../types/statistics';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestRiskAlerts = async (url: string): Promise<RiskAlertsResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as RiskAlertsResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '위험 알림을 불러오지 못했습니다.',
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
    return await httpClient.get<RiskAlertsResponse>('/api/v1/dashboard/risk-alerts');
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
