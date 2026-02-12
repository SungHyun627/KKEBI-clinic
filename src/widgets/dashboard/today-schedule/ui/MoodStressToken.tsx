interface MoodStressTokenProps {
  label: '기분' | '스트레스';
  score: number | null;
}

export default function MoodStressToken({ label, score }: MoodStressTokenProps) {
  const normalizedScore = score ?? 0;

  return (
    <span className="flex max-w-full items-center gap-[7px] rounded-[100px] border border-neutral-95 bg-white px-3 py-1 body-14">
      <div className="body-18 shrink-0">{'☹️'}</div>
      <div className="flex min-w-0 flex-end gap-[3px]">
        <span className="truncate text-label-neutral">{label}</span>
        <span className="shrink-0 text-label-normal font-semibold">{normalizedScore}/5</span>
      </div>
    </span>
  );
}
