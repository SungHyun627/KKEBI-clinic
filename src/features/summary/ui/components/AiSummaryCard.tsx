import { Textarea } from '@/shared/ui/textarea';

interface AiSummaryCardProps {
  locale: string;
  value: string;
  onChange: (value: string) => void;
}

export default function AiSummaryCard({ locale, value, onChange }: AiSummaryCardProps) {
  return (
    <div className="rounded-[20px] border border-neutral-95 bg-white p-6">
      <div className="body-18 font-semibold text-label-normal">
        {locale === 'en' ? 'AI generated summary' : 'AI 생성 요약'}
      </div>
      <p className="mt-2 body-14 text-label-alternative">
        {locale === 'en'
          ? 'Editable auto-generated summary based on session data.'
          : '세션 데이터를 기반으로 생성된 요약입니다. 수정할 수 있습니다.'}
      </p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 min-h-[124px]"
      />
    </div>
  );
}
