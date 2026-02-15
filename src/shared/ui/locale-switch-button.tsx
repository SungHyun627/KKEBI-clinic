'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';

export function LocaleSwitchButton({ className = '' }: { className?: string }) {
  const locale = useLocale();

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
    <button
      className={`hover:cursor-pointer ${className}`.trim()}
      type="button"
      onClick={switchLocale}
      aria-label="한, 영변환"
    >
      <Image src="/icons/global.svg" alt="한, 영변환" width={24} height={24} />
    </button>
  );
}
