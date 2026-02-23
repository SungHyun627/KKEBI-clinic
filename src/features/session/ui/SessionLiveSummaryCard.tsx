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
  const isEmpty = title.trim().length === 0 && body.trim().length === 0;

  return (
    <div className="flex w-full flex-col justify-center items-start gap-[23px] rounded-[24px] bg-white p-[26px]">
      <div className="flex flex-col gap-3">
        <span className="body-18 font-medium text-neutral-40">
          {locale === 'en' ? 'Live summary' : '실시간 요약'}
        </span>
        <div
          className={`body-18 min-h-[28px] w-full ${
            isEmpty ? 'font-medium text-label-assistive' : 'font-semibold text-label-normal'
          }`}
        >
          {isEmpty
            ? locale === 'en'
              ? 'No active recording session.'
              : '녹음 중인 상담이 없습니다.'
            : title}
        </div>
      </div>
      <Divider />
      <div className="flex min-h-[21px] items-start gap-3">
        <Image src="/icons/speaker.svg" alt="speaker" width={20} height={20} />
        <div className="body-14 text-label-alternative">{isEmpty ? '' : body}</div>
      </div>
    </div>
  );
}
