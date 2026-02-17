'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useEffect, useSyncExternalStore } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Toast } from '@/shared/ui/toast';
import { usePathname, useRouter } from '@/i18n/navigation';
import { getAuthSession, subscribeAuthSession } from '@/features/auth/login/lib/authSession';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const authSession = useSyncExternalStore(subscribeAuthSession, getAuthSession, () => null);

  useEffect(() => {
    if (!authSession?.authenticated) return;
    if (pathname === '/login' || pathname.startsWith('/login/2fa')) {
      router.replace('/');
    }
  }, [authSession, pathname, router]);

  const switchLocale = () => {
    if (typeof window === 'undefined') return;
    const { pathname, search, hash } = window.location;
    const currentLocaleFromPath = pathname.startsWith('/en')
      ? 'en'
      : pathname.startsWith('/ko')
        ? 'ko'
        : locale;
    const nextLocale = currentLocaleFromPath === 'ko' ? 'en' : 'ko';
    const normalizedPath = pathname.replace(/^\/(ko|en)(?=\/|$)/, '') || '/';
    const nextPath = `/${nextLocale}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;
    window.location.replace(`${nextPath}${search}${hash}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      <button
        type="button"
        onClick={switchLocale}
        className="absolute right-6 top-6 z-10 hover:cursor-pointer"
        aria-label={tCommon('localeSwitch')}
      >
        <Image src="/icons/global.svg" alt={tCommon('localeSwitch')} width={24} height={24} />
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
