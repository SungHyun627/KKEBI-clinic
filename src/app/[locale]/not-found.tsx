'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { LocaleSwitchButton } from '@/shared/ui/locale-switch-button';

export default function LocaleNotFound() {
  const locale = useLocale();
  const isKo = locale === 'ko';

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-white px-6">
      <LocaleSwitchButton className="absolute right-6 top-6 z-10" />
      <div className="flex w-full max-w-[520px] flex-col items-center gap-4 rounded-2xl border border-neutral-95 bg-neutral-99 p-8 text-center">
        <h1 className="text-[24px] font-semibold leading-[32px] text-label-normal">
          {isKo ? '페이지를 찾을 수 없습니다.' : 'Page not found.'}
        </h1>
        <p className="body-14 text-label-alternative">
          {isKo
            ? '요청하신 페이지가 없거나 주소가 잘못되었습니다.'
            : 'The page you requested does not exist or the URL is invalid.'}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white"
        >
          {isKo ? '대시보드로 이동' : 'Go to dashboard'}
        </Link>
      </div>
    </div>
  );
}
