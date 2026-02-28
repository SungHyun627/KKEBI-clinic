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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const registerClientMock = async (
  payload: RegisterClientRequest,
): Promise<RegisterClientResponse> => {
  await wait(250);

  if (!payload.name?.trim()) {
    return {
      success: false,
      message: '내담자 이름이 필요합니다.',
    };
  }

  return {
    success: true,
    clientId: Date.now(),
  };
};

const addClientTestResultMock = async (
  _clientId: number,
  _payload: AddTestResultRequest,
): Promise<AddTestResultResponse> => {
  await wait(100);
  return { success: true };
};

export const registerClient = registerClientMock;
export const addClientTestResult = addClientTestResultMock;
