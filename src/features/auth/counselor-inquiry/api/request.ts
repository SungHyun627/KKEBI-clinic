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
  errorCode?: 'REQUIRED_FIELDS' | 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR';
}

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

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

const postInquiry = async (url: string, payload: CounselorInquiryPayload) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json() as Promise<CounselorInquiryResult>;
};

export async function requestCounselorInquiryDemo(
  payload: CounselorInquiryPayload,
): Promise<CounselorInquiryResult> {
  const invalid = validatePayload(payload);
  if (invalid) return invalid;

  return postInquiry('/api/v1/auth/counselor-inquiry', payload);
}

export async function requestCounselorInquiryServer(
  payload: CounselorInquiryPayload,
): Promise<CounselorInquiryResult> {
  const invalid = validatePayload(payload);
  if (invalid) return invalid;

  if (!SERVER_API_BASE_URL) {
    return { success: false, errorCode: 'CONFIG_ERROR' };
  }

  return postInquiry(`${SERVER_API_BASE_URL}/api/v1/auth/counselor-inquiry`, payload);
}

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const requestCounselorInquiry = requestCounselorInquiryDemo;
