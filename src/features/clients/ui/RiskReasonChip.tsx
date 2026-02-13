interface RiskReasonChipProps {
  value: string;
}

export default function RiskReasonChip({ value }: RiskReasonChipProps) {
  return (
    <span className="flex items-center justify-center gap-[3px] font-semibold rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 leading-none text-label-normal">
      {value}
    </span>
  );
}
