import { Textarea } from '@/shared/ui/textarea';
import Image from 'next/image';

interface AiSummaryCardProps {
  locale: string;
  value: string;
  onChange: (value: string) => void;
}

export default function AiSummaryCard({ locale, value, onChange }: AiSummaryCardProps) {
  return (
    <div className="flex flex-col w-full items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/clipboard.svg"
            alt={locale === 'en' ? 'AI summary' : 'AI summary'}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {locale === 'en' ? 'AI Session Summary' : 'AI 상담 요약'}
        </div>
      </div>

      <div className="flex min-h-[124px] w-full px-[26px] py-[23px] rounded-[16px] border border-neutral-95 body-16 text-label-normal">
        {value}
      </div>
      <div className="flex flex-col items-start gap-[10px] w-full">
        <span className="body-16 font-medium text-label-neutral">직접 수정</span>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-[26px] py-[23px]  min-h-[74px]"
          placeholder="상담 내용을 직접 수정해 보세요."
        />
      </div>
    </div>
  );
}
