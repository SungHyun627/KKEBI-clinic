import { ApiError, httpClient } from '@/shared/api/http-client';
import { isApiResponse, toBaseResponse } from '@/shared/api/base-response';
import type { components } from '@/shared/api/generated-types';
import type { ClosedClientsResponse } from '@/features/clients/client-closure/types/client-closure';
import type { ClosedClientItem } from '@/entities/client/model/types';

type ApiTerminatedClientsPage = components['schemas']['PageTerminatedClientResponse'];
type ApiTerminatedClient = components['schemas']['TerminatedClientResponse'];
const SERVER_API_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/$/, '') ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const toClosedReason = (terminationReason?: string): ClosedClientItem['closeReason'] => {
  const normalized = terminationReason?.trim() ?? '';
  if (!normalized) return '기타';
  if (normalized.includes('회기')) return '회기 종료';
  if (normalized.includes('중도') || normalized.toLowerCase().includes('drop')) return '중도 탈락';
  return '기타';
};

const toAgeGender = (age?: number, gender?: ApiTerminatedClient['gender']) => {
  const normalizedAge = typeof age === 'number' && Number.isFinite(age) ? age : 0;
  const genderLabel = gender === 'MALE' ? '남성' : gender === 'FEMALE' ? '여성' : '논바이너리';
  return `${genderLabel} ${normalizedAge}세`;
};

const toDate = (raw?: string) => {
  if (!raw) return '';
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const date = String(parsed.getDate()).padStart(2, '0');
    return `${year}/${month}/${date}`;
  }

  const matched = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!matched) return raw;
  return `${matched[1]}/${matched[2]}/${matched[3]}`;
};

const toChiefConcerns = (chiefComplaint?: string) => {
  if (!chiefComplaint?.trim()) return ['기타'];
  const concerns = chiefComplaint
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return concerns.length > 0 ? concerns : ['기타'];
};

const mapTerminatedClients = (content?: ApiTerminatedClient[]) =>
  (Array.isArray(content) ? content : []).map((item) => {
    const clientId = String(item.id ?? '');
    const startDate = toDate(item.counselingStartDate);
    const terminatedDate = toDate(item.terminatedAt);

    return {
      id: `terminated-${clientId}-${terminatedDate || 'unknown'}`,
      clientId,
      counselingPeriod:
        startDate && terminatedDate ? `${startDate} - ${terminatedDate}` : terminatedDate || '-',
      clientName: item.name?.trim() || '-',
      ageGender: toAgeGender(item.age, item.gender),
      chiefConcern: toChiefConcerns(item.chiefComplaint),
      closeReason: toClosedReason(item.terminationReason),
    } satisfies ClosedClientItem;
  });

const toClosedClientsResponse = (value: unknown): ClosedClientsResponse => {
  if (!isApiResponse(value)) {
    return {
      success: false,
      message: '종결 상담자 목록 응답 형식이 올바르지 않습니다.',
    };
  }

  const base = toBaseResponse<ApiTerminatedClientsPage>(value);
  return {
    success: base.success,
    data: mapTerminatedClients(base.data?.content),
    message: base.message,
  };
};

const requestTerminatedClients = async (): Promise<ClosedClientsResponse> => {
  try {
    const response =
      await httpClient.get<components['schemas']['ApiResponsePageTerminatedClientResponse']>(
        '/api/v1/clients/closed',
      );
    return toClosedClientsResponse(response);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '종결 상담자 목록을 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

const requestTerminatedClientsServer = async (): Promise<ClosedClientsResponse> => {
  if (!SERVER_API_BASE_URL) {
    return {
      success: false,
      message: 'API base URL is not configured',
    };
  }

  try {
    const response = await fetch(`${SERVER_API_BASE_URL}/api/v1/clients/closed`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => null);
    return toClosedClientsResponse(payload);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const getClosedClients = () => requestTerminatedClients();
export const getClosedClientsServer = () => requestTerminatedClientsServer();
export const getClosedClientsMock = getClosedClients;
