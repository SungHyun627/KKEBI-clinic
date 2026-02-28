'use client';

interface ValueCellProps {
  value: string;
}

const ValueCell = ({ value }: ValueCellProps) => {
  return (
    <span className="body-14 border-b border-gray-10 px-6 py-4 font-medium text-label-alternative">
      {value || '-'}
    </span>
  );
};

export default ValueCell;
