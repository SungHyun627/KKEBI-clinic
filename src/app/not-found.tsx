import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { LocaleSwitchButton } from '@/shared/ui/locale-switch-button';

export default async function NotFound() {
  const locale = await getLocale();
  const tNotFound = await getTranslations('notFound');

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-white px-6">
      <LocaleSwitchButton className="absolute right-6 top-6 z-10" />
      <div className="flex w-full max-w-[520px] flex-col items-center gap-4 rounded-2xl border border-neutral-95 bg-neutral-99 p-8 text-center">
        <h1 className="text-[24px] font-semibold leading-[32px] text-label-normal">
          {tNotFound('title')}
        </h1>
        <p className="body-14 text-label-alternative">{tNotFound('description')}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white"
        >
          {tNotFound('goDashboard')}
        </Link>
      </div>
    </div>
  );
}
