'use client';

import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import ChiefConcernChip from '@/shared/ui/chips/chief-concern-chip';
import CloseReasonChip from './CloseReasonChip';
import type { ClosedClientItem } from '@/features/clients';

interface ClosedClientCardProps {
  item: ClosedClientItem;
  isLast: boolean;
  localizedClientName: string;
  ageGenderText: string;
  detailLabel: string;
  restoreLabel: string;
  isRestoring: boolean;
  localizeChiefConcern: (value: string) => string;
  onRestore: (clientId: string) => void;
}

export default function ClosedClientCard({
  item,
  isLast,
  localizedClientName,
  ageGenderText,
  detailLabel,
  restoreLabel,
  isRestoring,
  localizeChiefConcern,
  onRestore,
}: ClosedClientCardProps) {
  return (
    <li
      className={[
        'grid w-full grid-cols-[4fr_2fr_2fr_4fr_2fr_4fr] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3 max-[1200px]:gap-2 max-[1100px]:grid-cols-[4fr_2fr_4fr_2fr_4fr] max-[1100px]:px-3',
        isLast ? 'rounded-b-[8px]' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="body-16 min-w-0 truncate text-label-normal">{item.counselingPeriod}</span>
      <span className="body-16 min-w-0 truncate text-label-normal">{localizedClientName}</span>
      <span className="body-16 min-w-0 truncate text-label-normal max-[1100px]:hidden">
        {ageGenderText}
      </span>
      <span className="flex min-w-0 flex-wrap gap-2 overflow-hidden">
        {item.chiefConcern.map((concern) => (
          <ChiefConcernChip key={`${item.id}-${concern}`} value={localizeChiefConcern(concern)} />
        ))}
      </span>
      <CloseReasonChip value={item.closeReason} />
      <div className="flex min-w-0 w-full items-center justify-end gap-2 pl-2">
        <Button
          disabled
          type="button"
          variant="icon"
          size="icon"
          aria-label={detailLabel}
          className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
        >
          <Image src="/icons/report.svg" alt="" width={24} height={24} aria-hidden />
        </Button>
        <Button
          type="button"
          size="md"
          className="w-full max-w-[181px]"
          disabled={isRestoring}
          onClick={() => onRestore(item.clientId)}
        >
          {restoreLabel}
        </Button>
      </div>
    </li>
  );
}
