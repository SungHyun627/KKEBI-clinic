import Image from 'next/image';

interface BookmarkedMoment {
  id?: string;
  text?: string;
  timestamp?: string;
}

interface EmotionPatternsCardProps {
  locale: string;
  emotions: string[];
  distortionLabel: string;
  bookmarkedMoments: BookmarkedMoment[];
}

export default function EmotionPatternsCard({
  locale,
  emotions,
  distortionLabel: _distortionLabel,
  bookmarkedMoments: _bookmarkedMoments,
}: EmotionPatternsCardProps) {
  return (
    <div className="flex flex-col w-full items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/wave.svg"
            alt={locale === 'en' ? 'Emotion Patterns' : '감정패턴'}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {locale === 'en' ? 'Emotion Patterns' : '감정패턴'}
        </div>
      </div>
      <div className="flex min-h-[80px] w-full flex-wrap items-center gap-2 rounded-[16px] border border-neutral-95 px-[26px] py-[23px]">
        {emotions.length > 0 ? (
          emotions.map((emotion, index) => (
            <span
              key={`${emotion}-${index}`}
              className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 font-medium text-label-normal"
            >
              {emotion}
            </span>
          ))
        ) : (
          <span className="body-14 text-label-alternative">
            {locale === 'en' ? 'No emotion data yet.' : '감정 데이터가 없습니다.'}
          </span>
        )}
      </div>
    </div>
  );
}
