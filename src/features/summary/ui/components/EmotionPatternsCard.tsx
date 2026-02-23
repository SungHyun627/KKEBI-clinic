import Image from 'next/image';
import { useTranslations } from 'next-intl';
interface EmotionPatternsCardProps {
  emotions: string[];
}

export default function EmotionPatternsCard({ emotions }: EmotionPatternsCardProps) {
  const tSummary = useTranslations('summary');

  return (
    <div className="flex flex-col w-full items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/wave.svg"
            alt={tSummary('emotionsIconAlt')}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {tSummary('emotionsTitle')}
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
          <span className="body-14 text-label-alternative">{tSummary('emotionsEmpty')}</span>
        )}
      </div>
    </div>
  );
}
