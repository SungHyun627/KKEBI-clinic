'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';

interface SessionEndConfirmDialogProps {
  open: boolean;
  totalSessionTime: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
}

export default function SessionEndConfirmDialog({
  open,
  totalSessionTime,
  onOpenChange,
  onConfirm,
}: SessionEndConfirmDialogProps) {
  const locale = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-start max-w-[480px] w-full gap-[26px] rounded-[24px] px-8 py-7">
        <DialogTitle className="absolute h-0 w-0 overflow-hidden p-0 m-0">
          <VisuallyHidden>{locale === 'en' ? 'End session' : '상담 종료'}</VisuallyHidden>
        </DialogTitle>
        <div className="flex flex-col w-full items-center gap-[6px]">
          <span className="body-14 text-neutral-40 text-center">
            {locale === 'en' ? 'Do you want to end this session?' : '상담을 종료하시겠습니까?'}
          </span>
          <span className="body-18 font-semibold">
            {locale === 'en' ? `Total ${totalSessionTime}` : `총 ${totalSessionTime} 상담`}
          </span>
        </div>
        <div className="flex w-full items-center gap-2">
          <Button
            type="button"
            className="h-[58px] flex-[6] rounded-[16px]"
            size="lg"
            variant={'outline'}
            onClick={() => onOpenChange(false)}
          >
            {locale === 'en' ? 'Cancel' : '취소'}
          </Button>
          <Button
            type="button"
            className="h-[58px] flex-[11] rounded-[16px]"
            onClick={() => {
              void onConfirm();
            }}
          >
            {locale === 'en' ? 'End & Save' : '종료 및 저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
