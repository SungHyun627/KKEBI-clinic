export async function requestResetPassword(email: string) {
  return fetch('/api/v1/auth/reset-password/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then((res) => res.json());
}

export async function resetPassword({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) {
  return fetch('/api/v1/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  }).then((res) => res.json());
}

export async function mockResetPassword(email: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  // 성공 응답 예시
  return { success: true, message: '비밀번호 재설정 링크가 이메일로 발송되었습니다.' };
}
