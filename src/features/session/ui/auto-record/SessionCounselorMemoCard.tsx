'use client';

import { useTranslations } from 'next-intl';

interface SessionCounselorMemoCardProps {
  defaultValue: string;
}

export default function SessionCounselorMemoCard({ defaultValue }: SessionCounselorMemoCardProps) {
  const tSession = useTranslations('sessionList');

  return (
    <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white gap-[18px]">
      <span className="body-18 font-medium text-neutral-40">{tSession('counselorMemoTitle')}</span>
      <textarea
        defaultValue={defaultValue}
        className="body-14 min-h-[60px] w-full resize-none rounded-[12px] bg-white p-3 text-label-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary placehoder:text-label-assistive"
        placeholder={tSession('counselorMemoPlaceholder')}
      />
    </div>
  );
}
