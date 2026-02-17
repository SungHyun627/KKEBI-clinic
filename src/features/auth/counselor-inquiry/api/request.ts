import { ApiError, httpClient } from '@/shared/api/http-client';
import type {
  CounselorInquirySubmitRequest,
  CounselorInquirySubmitSuccessResponse,
} from '@/shared/api/type';

export interface CounselorInquiryPayload {
  name: string;
  email: string;
  phone: string;
  organization: string;
  licenseNumber: string;
  additionalInquiry: string;
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

export async function requestCounselorInquiry(
  payload: CounselorInquiryPayload,
): Promise<CounselorInquiryResult> {
  const invalid = validatePayload(payload);
  if (invalid) return invalid;

  const requestBody: CounselorInquirySubmitRequest = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    organization: payload.organization,
    licenseNumber: payload.licenseNumber,
    message: payload.additionalInquiry,
  };

  try {
    const response = await httpClient.post<CounselorInquirySubmitSuccessResponse>(
      '/api/v1/counselors/inquiries',
      requestBody,
      { skipAuth: true },
    );
    return {
      success: true,
      message:
        typeof response === 'object' &&
        response !== null &&
        'expectedResponseMessage' in response &&
        typeof response.expectedResponseMessage === 'string'
          ? response.expectedResponseMessage
          : undefined,
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
}
