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
}

export async function requestCounselorInquiry(
  payload: CounselorInquiryPayload,
): Promise<CounselorInquiryResult> {
  if (
    !payload.name ||
    !payload.email ||
    !payload.phone ||
    !payload.organization ||
    !payload.licenseNumber
  ) {
    return { success: false, message: '필수 항목을 입력해주세요.' };
  }

  // TODO: 상담사 등록 문의 API가 준비되면 실제 엔드포인트 호출로 교체합니다.
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true, message: '문의가 접수되었습니다.' };
}
