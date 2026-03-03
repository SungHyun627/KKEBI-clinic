'use client';

import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { Textarea } from '@/shared/ui/textarea';
import type { ClientCloseReason } from '@/features/clients/types/client';

type CloseReason = ClientCloseReason;

interface SessionCloseDialogProps {
  open: boolean;
  clientName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (payload: { reason: CloseReason; detail: string }) => Promise<void> | void;
}

const MAX_REASON_LENGTH = 300;

const SessionCloseDialog = ({
  open,
  clientName,
  onOpenChange,
  onConfirm,
}: SessionCloseDialogProps) => {
  const locale = useLocale();
  const [reason, setReason] = useState<CloseReason>('session-complete');
  const [reasonDetail, setReasonDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOther = reason === 'other';
  const charCount = reasonDetail.length;
  const isConfirmDisabled = isOther && charCount === 0;

  const reasonOptions = useMemo(
    () => [
      {
        value: 'session-complete' as const,
        label: locale === 'en' ? 'Session complete' : '회기 종료',
      },
      { value: 'dropout' as const, label: locale === 'en' ? 'Client dropout' : '내담자 중도 탈락' },
      { value: 'other' as const, label: locale === 'en' ? 'Other' : '기타' },
    ],
    [locale],
  );

  const closeDialog = () => {
    onOpenChange(false);
    setReason('session-complete');
    setReasonDetail('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[695px]">
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="relative flex h-full items-center justify-center p-4">
        <div className="flex w-full max-w-[480px] flex-col items-start gap-6 rounded-[24px] bg-white px-8 py-7 shadow-lg outline-none">
          <h2 className="absolute m-0 h-0 w-0 overflow-hidden p-0">
            <VisuallyHidden>{locale === 'en' ? 'Close Session' : '상담 종결하기'}</VisuallyHidden>
          </h2>

          <div className="flex w-full flex-col items-start gap-7">
            <span className="body-20 font-semibold text-black">
              {locale === 'en' ? 'Close Session' : '상담을 종결하시겠습니까?'}
            </span>
            <span className="body-14 text-label-normal">
              {locale === 'en'
                ? `Do you want to close the case with ${clientName}?`
                : `${clientName}님과의 상담을 종결하시겠습니까?`}
            </span>

            <div className="flex w-full flex-col gap-[23px] rounded-[16px] border border-neutral-95 bg-white p-4">
              <span className="body-18 font-semibold text-neutral-20">
                {locale === 'en' ? 'Close reason' : '종결 사유'}
              </span>
              <div className="flex w-full flex-col gap-4">
                {reasonOptions.map((option) => {
                  const selected = reason === option.value;
                  return (
                    <div key={option.value} className="flex w-full flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setReason(option.value)}
                        className="flex items-center gap-[6px] hover:cursor-pointer"
                      >
                        <span
                          className="inline-flex h-4 w-4 aspect-square items-center justify-center"
                          aria-hidden
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M12.5957 0.682617C14.2364 0.682617 15.0488 1.49512 15.0488 3.10449V12.6436C15.0487 14.2528 14.2363 15.0654 12.5957 15.0654H3.12012C1.4874 15.0654 0.666108 14.2606 0.666016 12.6436V3.10449C0.666016 1.48731 1.4873 0.682617 3.12012 0.682617H12.5957Z"
                              fill={selected ? '#FA5454' : '#DCDCDC'}
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.245 5.21469C11.5675 4.91375 12.0729 4.93139 12.3739 5.25376C12.675 5.57634 12.6575 6.08164 12.3349 6.38266L7.21866 11.1571C6.88105 11.4721 6.35706 11.4721 6.01944 11.1571L3.25382 8.57602C2.93131 8.275 2.91378 7.76968 3.21476 7.44712C3.51575 7.12456 4.02108 7.1071 4.34366 7.40805L6.61905 9.5311L11.245 5.21469Z"
                              fill="white"
                            />
                          </svg>
                        </span>
                        <span className="body-14 text-label-neutral">{option.label}</span>
                      </button>
                      {option.value === 'other' && selected ? (
                        <Textarea
                          value={reasonDetail}
                          onChange={(event) =>
                            setReasonDetail(event.target.value.slice(0, MAX_REASON_LENGTH))
                          }
                          placeholder={
                            locale === 'en'
                              ? 'Enter a reason for closure.'
                              : '종결 사유를 입력해주세요.'
                          }
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-[3px] w-full body-14 text-neutral-50 rounded-[16px] bg-neutral-99 px-3 py-4 items-start">
              <span className="body-14 text-neutral-50">
                • 종결된 내담자의 기록은 30일 이후 삭제됩니다.
              </span>
              <span className="body-14 text-neutral-50">
                • 30일 간은 종결 상담 확인 페이지에서 확인 및 수정할 수 있습니다.
              </span>
            </div>
          </div>

          <div className="flex w-full items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-[6] rounded-[16px]"
              onClick={closeDialog}
            >
              {locale === 'en' ? 'Cancel' : '취소하기'}
            </Button>
            <Button
              type="button"
              size="lg"
              className="flex-[11] rounded-[16px]"
              disabled={isConfirmDisabled || isSubmitting}
              onClick={async () => {
                setIsSubmitting(true);
                await onConfirm?.({ reason, detail: reasonDetail.trim() });
                setIsSubmitting(false);
                closeDialog();
              }}
            >
              {locale === 'en' ? 'Close' : '종결하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCloseDialog;
