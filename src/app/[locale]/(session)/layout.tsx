import type { ReactNode } from 'react';
import { Toast } from '@/shared/ui/toast';

export default function SessionLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full px-8 bg-white">
      {children}
      <Toast />
    </main>
  );
}
