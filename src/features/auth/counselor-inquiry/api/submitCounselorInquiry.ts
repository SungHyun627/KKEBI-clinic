import { ApiError, httpClient } from '@/shared/api/http-client';
import type { CounselorInquirySubmitRequest } from '@/shared/api/type';

export interface CounselorInquiryPayload {
  name: string;
  email: string;
  phone: string;
  organization: string;
  licenseNumber: string;
  additionalInquiry: string;
  language?: 'ko' | 'en';
}

interface CounselorInquiryResult {
  success: boolean;
  message?: string;
  errorCode?:
    | 'REQUIRED_FIELDS'
    | 'DUPLICATE_PENDING'
    | 'NETWORK_ERROR'
    | 'CONFIG_ERROR'
    | 'UNKNOWN_ERROR';
}

interface CounselorInquiryResponseShape {
  success?: boolean;
  message?: string;
  expectedResponseMessage?: string;
  code?: string;
  data?: unknown;
}

const validatePayload = (payload: CounselorInquiryPayload) => {
  if (
    !payload.name ||
    !payload.email ||
    !payload.phone ||
    !payload.organization ||
    !payload.licenseNumber
  ) {
    return {
      success: false,
      errorCode: 'REQUIRED_FIELDS',
    } satisfies CounselorInquiryResult;
  }
  return null;
};

const extractSuccessMessage = (response: CounselorInquiryResponseShape): string | undefined => {
  if (typeof response.expectedResponseMessage === 'string') {
    return response.expectedResponseMessage;
  }
  if (typeof response.message === 'string') {
    return response.message;
  }
  return undefined;
};

const isSuccessResponse = (response: CounselorInquiryResponseShape): boolean => {
  if (response.success === true) return true;
  if (response.code === 'SUCCESS') return true;
  return false;
};

export const requestCounselorInquiry = async (
  payload: CounselorInquiryPayload,
): Promise<CounselorInquiryResult> => {
  const invalid = validatePayload(payload);
  if (invalid) return invalid;

  const requestBody: CounselorInquirySubmitRequest = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    organization: payload.organization,
    licenseNumber: payload.licenseNumber,
    message: payload.additionalInquiry,
    language: payload.language,
  };

  try {
    const response = await httpClient.post<CounselorInquiryResponseShape>(
      '/api/v1/counselors/inquiries',
      requestBody,
      { skipAuth: true },
    );

    if (!isSuccessResponse(response)) {
      return {
        success: false,
        errorCode: 'UNKNOWN_ERROR',
        message: extractSuccessMessage(response),
      };
    }

    return {
      success: true,
      message: extractSuccessMessage(response),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 409) {
        return { success: false, errorCode: 'DUPLICATE_PENDING', message: error.message };
      }
      return { success: false, errorCode: 'UNKNOWN_ERROR', message: error.message };
    }
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : undefined,
    };
  }
};
