'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSwitchButton({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: nextLocale });
    router.refresh();
  };

  return (
    <button
      className={`hover:cursor-pointer ${className}`.trim()}
      type="button"
      onClick={switchLocale}
      aria-label={tCommon('localeSwitch')}
    >
      <Image src="/icons/global.svg" alt={tCommon('localeSwitch')} width={24} height={24} />
    </button>
  );
}
