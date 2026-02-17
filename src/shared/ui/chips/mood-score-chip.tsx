import { useLocale } from 'next-intl';

interface MoodScoreChipProps {
  label: string;
  score: number | null;
  responsiveCompact?: boolean;
}

export default function MoodScoreChip({
  label,
  score,
  responsiveCompact = false,
}: MoodScoreChipProps) {
  const locale = useLocale();
  const normalizedScore = score ?? 0;
  const compactEnglishLabel = label.trim().charAt(0).toUpperCase();

  return (
    <span className="flex max-w-[120px] items-center gap-[7px] rounded-[100px] border border-neutral-95 bg-white px-3 py-1 body-14">
      <div className="body-18 shrink-0">{'☹️'}</div>
      <div className="flex min-w-0 flex-end gap-[3px]">
        {responsiveCompact ? (
          <>
            <span className="truncate text-label-neutral max-[1200px]:hidden">{label}</span>
            {locale === 'en' ? (
              <span className="hidden text-label-neutral max-[1200px]:inline">
                {compactEnglishLabel}
              </span>
            ) : null}
          </>
        ) : (
          <span className="truncate text-label-neutral">{label}</span>
        )}
        <span className="shrink-0 font-semibold text-label-normal">{normalizedScore}/5</span>
      </div>
    </span>
  );
}
