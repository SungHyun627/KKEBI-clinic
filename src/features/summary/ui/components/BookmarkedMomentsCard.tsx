import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { SummaryTranscriptItem } from '@/entities/summary/model/types';

interface BookmarkedMomentsCardProps {
  locale: string;
  moments: SummaryTranscriptItem[];
}

function formatTimestampToHms(value?: string) {
  if (!value) return '--:--:--';
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
  if (/^\d{2}:\d{2}$/.test(value)) return `00:${value}`;
  return value;
}

export default function BookmarkedMomentsCard({ locale, moments }: BookmarkedMomentsCardProps) {
  const tSummary = useTranslations('summary');

  const getFallbackText = (speaker?: SummaryTranscriptItem['speaker']) => {
    if (locale === 'en') {
      return speaker === 'counselor'
        ? 'This is bookmarked counselor text.'
        : 'This is bookmarked client text.';
    }
    return speaker === 'counselor'
      ? '상담자의 북마크된 텍스트입니다.'
      : '내담자의 북마크된 텍스트입니다.';
  };

  return (
    <div className="flex w-full flex-col items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/bookmark-2.svg"
            alt={tSummary('bookmarkedIconAlt')}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {tSummary('bookmarkedTitle')}
        </div>
      </div>

      <div className="flex min-h-[96px] w-full flex-col divide-y divide-[rgba(55, 56, 60, 0.16)] rounded-[24px] p-[26px] bg-neutral-99">
        {moments.length > 0 ? (
          moments.map((item, index) => (
            <div key={`${item.id ?? index}`} className="flex w-full flex-col">
              <div className="flex w-full py-4 items-center gap-3">
                <span
                  className={`flex px-3 py-[3px] justify-center items-center gap-3 border border-neutral-95 rounded-[10px] body-14 font-semibold text-center ${
                    locale === 'en' ? 'w-[90px] whitespace-nowrap' : ''
                  } ${item.speaker === 'counselor' ? 'text-label-neutral' : 'text-[#FF6363]'}`}
                >
                  {item.speaker === 'counselor'
                    ? tSummary('bookmarkedSpeakerCounselor')
                    : tSummary('bookmarkedSpeakerClient')}
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="body-14 min-w-0 flex-1 text-label-normal">
                    {item.text?.trim() ? item.text : getFallbackText(item.speaker)}
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="body-14 text-label-alternative">
                      {formatTimestampToHms(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center py-8">
            <span className="body-14 text-label-alternative">{tSummary('bookmarkedEmpty')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
