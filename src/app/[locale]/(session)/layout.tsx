'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from '@/i18n/navigation';
import { clearAuthSession, getAuthSession } from '@/features/auth';
import { ensureAccessToken } from '@/shared/api/http-client';
import { subscribeAuthRequired } from '@/shared/lib/auth-events';
import { Toast } from '@/shared/ui/toast';

export default function SessionLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const latestSession = getAuthSession();
    if (!latestSession?.authenticated) {
      router.replace('/login');
      return;
    }

    // session 그룹 진입 시에도 access token 복구를 선행한다.
    void ensureAccessToken();
  }, [router]);

  useEffect(() => {
    return subscribeAuthRequired(() => {
      clearAuthSession();
      localStorage.removeItem('kkebi-login-info');
      router.replace('/login');
    });
  }, [router]);

  return (
    <main className="min-h-screen w-full px-8 bg-white">
      {children}
      <Toast />
    </main>
  );
}
