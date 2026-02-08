import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-6 py-16">
        {children}
      </div>
    </div>
  );
}
