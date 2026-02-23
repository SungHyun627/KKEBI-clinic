'use client';

interface SessionCounselorMemoCardProps {
  locale: string;
  defaultValue: string;
}

export default function SessionCounselorMemoCard({
  locale,
  defaultValue,
}: SessionCounselorMemoCardProps) {
  return (
    <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white gap-[18px]">
      <span className="body-18 font-medium text-neutral-40">
        {locale === 'en' ? 'Counselor memo' : '상담사 메모'}
      </span>
      <textarea
        defaultValue={defaultValue}
        className="body-14 min-h-[60px] w-full resize-none rounded-[12px] bg-white p-3 text-label-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary placehoder:text-label-assistive"
        placeholder="상담 중 메모를 작성해 보세요."
      />
    </div>
  );
}
