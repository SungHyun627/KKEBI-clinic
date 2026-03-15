'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Toast } from '@/shared/ui/toast';
import { usePathname, useRouter } from '@/i18n/navigation';
import { getAuthSession } from '@/features/auth/login/lib/authSession';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const authSession = getAuthSession();
    if (!authSession?.authenticated) return;
    if (pathname === '/login' || pathname.startsWith('/login/2fa')) {
      router.replace('/');
    }
  }, [pathname, router]);

  const switchLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: nextLocale });
    router.refresh();
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <button
        type="button"
        onClick={switchLocale}
        className="absolute right-6 top-6 z-10 hover:cursor-pointer"
        aria-label={tCommon('localeSwitch')}
      >
        <Image src="/icons/global.svg" alt={tCommon('localeSwitch')} width={24} height={24} />
      </button>
      <div className="mx-auto flex h-full w-full items-center justify-center px-6 py-8">
        <div className="w-full max-w-[480px] shrink-0 flex flex-col items-center gap-[45px] bg-white">
          {children}
        </div>
      </div>
      <Toast />
    </div>
  );
}
