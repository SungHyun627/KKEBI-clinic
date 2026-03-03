import type { components } from '@/shared/api/generated-types';

type RegisterClientRequest = components['schemas']['ClientRegistrationRequest'];
type AddTestResultRequest = components['schemas']['ClientTestResultRequest'];

interface RegisterClientResponse {
  success: boolean;
  message?: string;
  clientId?: number;
}

interface AddTestResultResponse {
  success: boolean;
  message?: string;
}

export const registerClient = async (
  payload: RegisterClientRequest,
): Promise<RegisterClientResponse> => {
  try {
    const response = await fetch('/api/v1/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
      data?: { clientId?: number };
      clientId?: number;
    } | null;

    if (!data) {
      return {
        success: false,
        message: '내담자 등록 응답을 확인할 수 없습니다.',
      };
    }

    return {
      success: Boolean(data.success),
      message: data.message,
      clientId: data.data?.clientId ?? data.clientId,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const addClientTestResult = async (
  clientId: number,
  payload: AddTestResultRequest,
): Promise<AddTestResultResponse> => {
  try {
    const response = await fetch(`/api/v1/clients/${clientId}/tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;

    if (!data) {
      return {
        success: false,
        message: '검사 결과 저장 응답을 확인할 수 없습니다.',
      };
    }

    return {
      success: Boolean(data.success),
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};
