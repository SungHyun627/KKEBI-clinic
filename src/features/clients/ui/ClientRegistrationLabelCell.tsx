'use client';

interface LabelCellProps {
  field: string;
}

const LabelCell = ({ field }: LabelCellProps) => {
  return (
    <span className="body-16 border-b border-gray-10 bg-neutral-99 px-6 py-[11px] font-medium text-label-neutral truncate">
      {field}
    </span>
  );
};

export default LabelCell;
