interface TodayScheduleHeaderCellProps {
  label: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function TodayScheduleHeaderCell({
  label,
  align = 'left',
  className = '',
}: TodayScheduleHeaderCellProps) {
  return (
    <span
      className={`${className} body-14 font-semibold text-label-neutral ${
        align === 'center' ? 'justify-self-center text-center' : 'justify-self-start text-left'
      }`}
    >
      {label}
    </span>
  );
}
