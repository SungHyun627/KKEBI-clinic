import { ApiError, httpClient } from '@/shared/api/http-client';
import type { RiskAlertsResponse } from '../../types/statistics';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const COUNSELOR_RISK_ALERTS_PATH = '/api/v1/counselor/dashboard/risk-alerts';

type BackendEnvelope<TData> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: TData;
};

const extractRiskAlertItems = (data: unknown): unknown[] | undefined => {
  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data !== 'object' || data === null) {
    return undefined;
  }

  const items = (data as Record<string, unknown>).items;
  if (Array.isArray(items)) {
    return items;
  }

  return undefined;
};

const mapRiskAlertItem = (item: unknown) => {
  if (typeof item !== 'object' || item === null) {
    return null;
  }

  const row = item as Record<string, unknown>;
  const rawClientId = row.clientId;
  const clientId =
    typeof rawClientId === 'number' || typeof rawClientId === 'string' ? String(rawClientId) : '';

  if (!clientId) {
    return null;
  }

  const alertType = row.alertType;
  const reasonKey =
    alertType === 'APP_INACTIVE' ? 'riskAlertsNoAppActivity7Days' : 'riskAlertsPhqIncreased';

  return {
    clientId,
    clientName: typeof row.clientName === 'string' ? row.clientName : `내담자 ${clientId}`,
    reasonKey,
    detailPath: `/clients/${encodeURIComponent(clientId)}`,
  } as const;
};

const toRiskAlerts = (data: unknown): RiskAlertsResponse['data'] | undefined => {
  const items = extractRiskAlertItems(data);
  if (!items) {
    return undefined;
  }

  const mapped = items
    .map(mapRiskAlertItem)
    .filter((item): item is NonNullable<ReturnType<typeof mapRiskAlertItem>> => item !== null);

  return mapped;
};

const normalizeRiskAlertsResponse = (
  payload: unknown,
  fallbackMessage: string,
): RiskAlertsResponse => {
  if (typeof payload !== 'object' || payload === null) {
    return { success: false, message: fallbackMessage };
  }

  if ('success' in payload) {
    const response = payload as RiskAlertsResponse;
    const alerts = toRiskAlerts(response.data);
    if (!alerts) {
      return {
        success: false,
        message: response.message || fallbackMessage,
      };
    }
    return {
      success: true,
      data: alerts,
      message: response.message,
    };
  }

  if ('code' in payload) {
    const envelope = payload as BackendEnvelope<unknown>;
    const alerts = toRiskAlerts(envelope.data);
    if (!alerts) {
      return {
        success: false,
        message: envelope.message || fallbackMessage,
      };
    }
    return {
      success: true,
      data: alerts,
      message: envelope.message,
    };
  }

  if ('data' in payload) {
    const envelope = payload as BackendEnvelope<unknown>;
    const alerts = toRiskAlerts(envelope.data);
    if (!alerts) {
      return {
        success: false,
        message: envelope.message || fallbackMessage,
      };
    }
    return {
      success: true,
      data: alerts,
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
    const response = await httpClient.get<unknown>(COUNSELOR_RISK_ALERTS_PATH);
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

  return requestRiskAlerts(`${SERVER_API_BASE_URL}${COUNSELOR_RISK_ALERTS_PATH}`);
};

export const getRiskAlertsMock = getRiskAlerts;
