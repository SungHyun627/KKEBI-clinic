interface ChiefConcernChipProps {
  value: string;
}

export default function ChiefConcernChip({ value }: ChiefConcernChipProps) {
  return (
    <span className="flex items-center justify-center gap-[3px] rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 leading-none text-label-normal">
      {value}
    </span>
  );
}
