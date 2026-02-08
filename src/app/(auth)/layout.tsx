import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-[480px] rounded-3xl border border-neutral-95 bg-white px-8 py-10 shadow-[0_20px_60px_rgba(23,23,23,0.08)]">
          {children}
        </div>
      </div>
    </div>
  );
}
