'use client';

import { useEffect, useRef } from 'react';
import type { SessionTranscriptItem } from '../../types/session';

interface SessionTranscriptCardProps {
  locale: string;
  transcriptItems: SessionTranscriptItem[];
  pendingIds: Set<string>;
  bookmarkIds: Set<string>;
  onToggleBookmark: (transcriptId: string) => void;
  formatTimestampToHms: (value: string) => string;
  renderHighlightedText: (text: string, locale: string) => React.ReactNode;
}

export default function SessionTranscriptCard({
  locale,
  transcriptItems,
  pendingIds,
  bookmarkIds,
  onToggleBookmark,
  formatTimestampToHms,
  renderHighlightedText,
}: SessionTranscriptCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const emptyMessage =
    locale === 'en' ? 'Transcript will appear when recording starts' : '녹음 중인 상담이 없습니다';

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [transcriptItems]);

  return (
    <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white">
      <div
        ref={scrollContainerRef}
        className="session-transcript-scroll flex h-[300px] w-full flex-col divide-y divide-neutral-95 overflow-y-auto pr-2"
      >
        {transcriptItems.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="body-14 text-label-disable">{emptyMessage}</span>
          </div>
        ) : (
          transcriptItems.map((item) => (
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
                  <div
                    className={`body-14 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${
                      item.isPendingTranscription ? 'text-label-assistive' : 'text-label-normal'
                    }`}
                    title={item.text}
                  >
                    {renderHighlightedText(item.text, locale)}
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="body-14 text-label-alternative">
                      {formatTimestampToHms(item.timestamp)}
                    </span>
                    <button
                      type="button"
                      disabled={pendingIds.has(item.id) || item.isPendingTranscription}
                      onClick={() => onToggleBookmark(item.id)}
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
          ))
        )}
      </div>
    </div>
  );
}
