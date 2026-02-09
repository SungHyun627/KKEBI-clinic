// 실제 비밀번호 재설정 이메일 요청 API
export async function requestPasswordResetEmail(email: string): Promise<{ success: boolean }> {
  // TODO: 실제 API 연동 구현
  // 예시: await fetch('/api/v1/auth/password-reset', ...)
  return { success: true };
}

// mock API (테스트/개발용)
export async function mockRequestPasswordResetEmail(email: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true };
}
