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
  const normalizedScore = score ?? 0;

  return (
    <span className="flex max-w-[120px] items-center gap-[7px] rounded-[100px] border border-neutral-95 bg-white px-3 py-1 body-14">
      <div className="body-18 shrink-0">{'☹️'}</div>
      <div className="flex min-w-0 flex-end gap-[3px]">
        {responsiveCompact ? (
          <span className="truncate text-label-neutral max-[1100px]:hidden">{label}</span>
        ) : (
          <span className="truncate text-label-neutral">{label}</span>
        )}
        <span className="shrink-0 font-semibold text-label-normal">{normalizedScore}/5</span>
      </div>
    </span>
  );
}
