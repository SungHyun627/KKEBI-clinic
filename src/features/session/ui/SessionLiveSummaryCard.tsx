'use client';

import Divider from '@/shared/ui/divider';
import Image from 'next/image';

interface SessionLiveSummaryCardProps {
  locale: string;
  title: string;
  body: string;
}

export default function SessionLiveSummaryCard({
  locale,
  title,
  body,
}: SessionLiveSummaryCardProps) {
  return (
    <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white gap-[23px]">
      <div className="flex flex-col gap-3">
        <span className="body-18 font-medium text-neutral-40">
          {locale === 'en' ? 'Live summary' : '실시간 요약'}
        </span>
        <div className="w-full body-18 font-semibold">{title}</div>
      </div>
      <Divider />
      <div className="flex items-start gap-3">
        <Image src="/icons/speaker.svg" alt="speaker" width={20} height={20} />
        <div className="body-14 text-label-alternative">{body}</div>
      </div>
    </div>
  );
}
