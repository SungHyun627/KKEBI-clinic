'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';

interface SummaryQuitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function SummaryQuitConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: SummaryQuitConfirmDialogProps) {
  const locale = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-[480px] w-full flex-col items-start gap-[26px] rounded-[24px] px-8 py-7">
        <DialogTitle className="absolute m-0 h-0 w-0 overflow-hidden p-0">
          <VisuallyHidden>
            {locale === 'en' ? 'Stop writing summary' : '상담 기록 작성 중지'}
          </VisuallyHidden>
        </DialogTitle>

        <div className="flex w-full flex-col items-center gap-[6px]">
          <span className="body-14 text-neutral-40 text-center">
            {locale === 'en' ? 'Stop writing summary' : '상담 기록 작성 중지'}
          </span>
          <span className="body-18 font-semibold text-center">
            {locale === 'en' ? (
              <>
                Stop writing this summary?
                <br />
                Unsaved changes may be lost.
              </>
            ) : (
              <>
                상담 기록 작성을 중지하시겠습니까?
                <br />
                중지할 경우 내담자 목록의 완료된 상담 탭에서
                <br />
                내용을 보완할 수 있습니다.
              </>
            )}
          </span>
        </div>

        <div className="flex w-full items-center gap-2">
          <Button
            type="button"
            className="h-[58px] flex-[6] rounded-[16px]"
            size="lg"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {locale === 'en' ? 'Cancel' : '취소'}
          </Button>
          <Button type="button" className="h-[58px] flex-[11] rounded-[16px]" onClick={onConfirm}>
            {locale === 'en' ? 'Stop and leave' : '중지하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
