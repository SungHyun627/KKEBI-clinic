'use client';

import { useEffect, type ReactNode } from 'react';
import { getAuthSession } from '@/features/auth/login/lib/authSession';
import { ensureAccessToken } from '@/shared/api/http-client';
import { Toast } from '@/shared/ui/toast';

export default function SessionLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const latestSession = getAuthSession();
    if (!latestSession?.authenticated) return;
    void ensureAccessToken();
  }, []);

  return (
    <main className="min-h-screen w-full px-8 bg-white">
      {children}
      <Toast />
    </main>
  );
}
