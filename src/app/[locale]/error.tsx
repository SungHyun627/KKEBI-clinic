'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { LocaleSwitchButton } from '@/shared/ui/locale-switch-button';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isKo = locale === 'ko';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-white px-6">
      <LocaleSwitchButton className="absolute right-6 top-6 z-10" />
      <div className="flex w-full max-w-[520px] flex-col items-center gap-4 rounded-2xl border border-neutral-95 bg-neutral-99 p-8 text-center">
        <h1 className="text-[24px] font-semibold leading-[32px] text-label-normal">
          {isKo ? '오류가 발생했습니다.' : 'Something went wrong.'}
        </h1>
        <p className="body-14 text-label-alternative">
          {isKo ? '잠시 후 다시 시도해 주세요.' : 'Please try again shortly.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white"
        >
          {isKo ? '다시 시도' : 'Try again'}
        </button>
      </div>
    </div>
  );
}
