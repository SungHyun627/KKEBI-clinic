import { Textarea } from '@/shared/ui/textarea';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface AiSummaryCardProps {
  value: string;
  onChange: (value: string) => void;
  isReadOnly?: boolean;
}

export default function AiSummaryCard({ value, onChange, isReadOnly = false }: AiSummaryCardProps) {
  const tSummary = useTranslations('summary');

  return (
    <div className="flex flex-col w-full items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/clipboard.svg"
            alt={tSummary('aiSummaryIconAlt')}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {tSummary('aiSummaryTitle')}
        </div>
      </div>

      <div className="flex min-h-[124px] w-full px-[26px] py-[23px] rounded-[16px] border border-neutral-95 body-16 text-label-normal">
        {value}
      </div>
      {isReadOnly ? null : (
        <div className="flex flex-col items-start gap-[10px] w-full">
          <span className="body-16 font-medium text-label-neutral">
            {tSummary('aiSummaryEditLabel')}
          </span>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-auto min-h-[120px] px-[26px] py-[23px] [&_textarea]:overflow-hidden"
            placeholder={tSummary('aiSummaryEditPlaceholder')}
          />
        </div>
      )}
    </div>
  );
}
