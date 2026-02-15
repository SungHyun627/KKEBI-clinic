'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Toast } from '@/shared/ui/toast';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === 'ko' ? 'en' : 'ko';

  return (
    <div className="relative min-h-screen w-full bg-white">
      <button
        type="button"
        onClick={() => router.replace(pathname, { locale: nextLocale })}
        className="absolute right-6 top-6 z-10 hover:cursor-pointer"
        aria-label="한, 영변환"
      >
        <Image src="/icons/global.svg" alt="한, 영변환" width={24} height={24} />
      </button>
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-[480px] shrink-0 flex flex-col items-center gap-[45px] bg-white">
          {children}
        </div>
      </div>
      <Toast />
    </div>
  );
}
