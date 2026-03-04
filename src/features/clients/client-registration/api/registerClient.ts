import { ApiError, httpClient } from '@/shared/api/http-client';
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
    const data = await httpClient.post<components['schemas']['ApiResponseLong']>(
      '/api/v1/clients',
      payload,
    );

    return {
      success: true,
      message: data.message,
      clientId: typeof data.data === 'number' ? data.data : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '내담자 등록에 실패했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const addClientTestResult = async (
  clientId: number,
  payload: AddTestResultRequest,
): Promise<AddTestResultResponse> => {
  try {
    const data = await httpClient.post<components['schemas']['ApiResponseLong']>(
      `/api/v1/clients/${clientId}/tests`,
      payload,
    );

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '검사 결과 저장에 실패했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};
