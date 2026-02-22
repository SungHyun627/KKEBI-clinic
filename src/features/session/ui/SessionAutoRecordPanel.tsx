'use client';

import { useMemo, useState } from 'react';
import Divider from '@/shared/ui/divider';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { SessionAutoRecordData } from '../types/session-page';
import { addTranscriptBookmark, removeTranscriptBookmark } from '../api/bookmarkTranscript';

interface SessionAutoRecordPanelProps {
  sessionId: string;
  autoRecord: SessionAutoRecordData;
}

function formatTimestampToHms(value: string): string {
  const parts = value.split(':');
  if (parts.length === 3) return value;
  if (parts.length === 2) return `${value}:00`;
  return value;
}

export default function SessionAutoRecordPanel({
  sessionId,
  autoRecord,
}: SessionAutoRecordPanelProps) {
  const locale = useLocale();
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(
    () => new Set(autoRecord.transcripts.filter((item) => item.bookmarked).map((item) => item.id)),
  );
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const pendingMap = useMemo(() => pendingIds, [pendingIds]);

  const toggleBookmark = async (transcriptId: string) => {
    if (pendingMap.has(transcriptId)) return;
    const isBookmarked = bookmarkIds.has(transcriptId);

    setPendingIds((prev) => new Set(prev).add(transcriptId));
    setBookmarkIds((prev) => {
      const next = new Set(prev);
      if (isBookmarked) {
        next.delete(transcriptId);
      } else {
        next.add(transcriptId);
      }
      return next;
    });

    const result = isBookmarked
      ? await removeTranscriptBookmark(sessionId, transcriptId)
      : await addTranscriptBookmark(sessionId, transcriptId);

    if (!result.success) {
      setBookmarkIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.add(transcriptId);
        } else {
          next.delete(transcriptId);
        }
        return next;
      });
    }

    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(transcriptId);
      return next;
    });
  };

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
                      <span className="body-14 text-label-alternative">
                        {formatTimestampToHms(item.timestamp)}
                      </span>
                      <button
                        type="button"
                        disabled={pendingIds.has(item.id)}
                        onClick={() => {
                          void toggleBookmark(item.id);
                        }}
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-[6px] hover:cursor-pointer ${
                          bookmarkIds.has(item.id) ? 'text-label-normal' : 'text-label-assistive'
                        }`}
                        aria-label={locale === 'en' ? 'Bookmark' : '북마크'}
                      >
                        <span
                          className="h-6 w-6 bg-current"
                          style={{
                            maskImage: bookmarkIds.has(item.id)
                              ? 'url(/icons/bookmark-filled.svg)'
                              : 'url(/icons/bookmark.svg)',
                            WebkitMaskImage: bookmarkIds.has(item.id)
                              ? 'url(/icons/bookmark-filled.svg)'
                              : 'url(/icons/bookmark.svg)',
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                          }}
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
