import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface SettingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SettingPage({ params }: SettingPageProps) {
  const { locale } = await params;
  const tNav = await getTranslations('nav');
  const tCommon = await getTranslations('common');

  return (
    <section className="flex min-h-[260px] w-full items-center justify-center rounded-2xl border border-neutral-95 bg-neutral-99 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-pretendard text-[22px] leading-[30px] font-semibold text-label-normal">
          {tNav('settings')}
        </h2>
        <p className="body-14 text-label-alternative">{tCommon('underConstruction')}</p>
        <code className="body-12 rounded-md bg-white px-2 py-1 text-neutral-60">/settings</code>
        <Link
          href={`/${locale}`}
          className="mt-2 rounded-[10px] border border-neutral-95 bg-white px-4 py-2 body-14 text-label-normal hover:bg-neutral-99"
        >
          {tCommon('backToDashboard')}
        </Link>
      </div>
    </section>
  );
}
