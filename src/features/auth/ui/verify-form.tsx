'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';

interface VerifyFormValues {
  code: string;
}

export function VerifyForm() {
  const form = useForm<VerifyFormValues>({
    defaultValues: { code: '' },
  });
  const code = form.watch('code');
  const codeArr = (code ?? '').padEnd(6).slice(0, 6).split('');

  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    if (!val) return;
    const newCode = codeArr.map((c, i) => (i === idx ? val : c)).join('');
    form.setValue('code', newCode);
    if (idx < 5 && val) {
      const next = document.getElementById(`code-input-${idx + 1}`) as HTMLInputElement;
      if (next) next.focus();
    }
  };
  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeArr[idx] && idx > 0) {
      const prev = document.getElementById(`code-input-${idx - 1}`) as HTMLInputElement;
      if (prev) prev.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-10.5 w-full">
      {/* Phone icon */}
      <div
        className="flex flex-col justify-center items-center rounded-full bg-white"
        style={{ width: 83, height: 84, padding: '18px 17px 18px 18px' }}
      >
        <Image src="/icons/phone.svg" alt="phone" width={47} height={48} />
      </div>
      {/* Code input + 버튼 */}
      <form className="w-full flex flex-col gap-6 items-center" autoComplete="off">
        <div className="flex justify-between items-center self-stretch w-full mb-2 gap-[2px]">
          {Array.from({ length: 6 }).map((_, idx) => (
            <input
              key={idx}
              id={`code-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={codeArr[idx] && codeArr[idx] !== ' ' ? codeArr[idx] : ''}
              onChange={(e) => handleChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="flex h-[84px] flex-col justify-center items-center flex-auto min-w-0 max-w-[64px] rounded-[12px] border border-neutral-95 bg-white text-[32px] text-center outline-none"
              autoComplete="one-time-code"
            />
          ))}
        </div>
        {/* 버튼 영역 + 안내 텍스트 묶음 */}
        <div className="flex flex-col items-center gap-4.5 w-full">
          <div className="flex items-center gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-3 min-w-0 shrink-0 basis-[35.3%] md:w-30 sm:w-full"
            >
              뒤로가기
            </Button>
            <Button
              type="button"
              variant="default"
              size="lg"
              className="min-w-0 flex-1 basis-[64.7%]"
            >
              인증하기
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 w-full cursor-pointer text-center">
            <span className="text-[16px] leading-[25.6px] font-normal font-pretendard text-label-alternative">
              코드를 받지 못하셨나요?
            </span>
            <span className="text-[16px] leading-[25.6px] font-semibold font-pretendard text-primary">
              새 코드받기
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
