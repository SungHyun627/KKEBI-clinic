'use client';

import Divider from '@/shared/ui/divider';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { SessionAutoRecordData } from '../types/session-page';

interface SessionAutoRecordPanelProps {
  autoRecord: SessionAutoRecordData;
}

export default function SessionAutoRecordPanel({ autoRecord }: SessionAutoRecordPanelProps) {
  const locale = useLocale();

  return (
    <section className="flex min-h-full flex-col gap-[25px] px-8 py-[26px] bg-neutral-99">
      <div className="text-[24px] font-semibold">
        {locale === 'en' ? 'Session record' : '상담 기록'}
      </div>
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white">
          <div className="flex w-full flex-col divide-y divide-neutral-95">
            {autoRecord.transcripts.map((item) => (
              <div key={item.id} className="flex w-full flex-col">
                <div className="flex w-full py-4 items-center gap-3">
                  <span
                    className={`flex px-3 py-[3px] justify-center items-center gap-3 border border-neutral-95 rounded-[10px] body-14 font-semibold text-center ${
                      locale === 'en' ? 'w-[90px] whitespace-nowrap' : ''
                    } ${item.speaker === 'counselor' ? 'text-label-neutral' : 'text-[#FF6363]'}`}
                  >
                    {item.speaker === 'counselor'
                      ? locale === 'en'
                        ? 'Counselor'
                        : '상담사'
                      : locale === 'en'
                        ? 'Client'
                        : '내담자'}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="body-14 min-w-0 flex-1 text-label-normal">{item.text}</div>
                    <div className="flex items-center gap-[6px]">
                      <span className="body-14 text-label-alternative">{item.timestamp}</span>
                      <button
                        type="button"
                        className="inline-flex h-5 w-5 items-center justify-center hover:cursor-pointer"
                        aria-label={locale === 'en' ? 'Bookmark' : '북마크'}
                      >
                        <Image
                          src="/icons/bookmark.svg"
                          alt=""
                          width={24}
                          height={24}
                          aria-hidden
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white gap-[23px]">
          <div className="flex flex-col gap-3">
            <span className="body-18 font-medium text-neutral-40">
              {locale === 'en' ? 'Live summary' : '실시간 요약'}
            </span>
            <div className="w-full body-18 font-semibold">{autoRecord.liveSummaryTitle}</div>
          </div>
          <Divider />
          <div className="flex items-start gap-3">
            <Image src="/icons/speaker.svg" alt="speaker" width={20} height={20} />
            <div className="body-14 text-label-alternative">{autoRecord.liveSummaryBody}</div>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white gap-[18px]">
          <span className="body-18 font-medium text-neutral-40">
            {locale === 'en' ? 'Counselor memo' : '상담사 메모'}
          </span>
          <div className="body-14 text-label-normal">{autoRecord.counselorMemo}</div>
        </div>
      </div>
    </section>
  );
}
