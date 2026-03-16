'use client';

import { useTranslations } from 'next-intl';
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
  const tCommon = useTranslations('common');
  const tSession = useTranslations('sessionList');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-start max-w-[480px] w-full gap-[26px] rounded-[24px] px-8 py-7">
        <DialogTitle className="absolute h-0 w-0 overflow-hidden p-0 m-0">
          <VisuallyHidden>{tSession('endDialogA11yTitle')}</VisuallyHidden>
        </DialogTitle>
        <div className="flex flex-col w-full items-center gap-[6px]">
          <span className="body-14 text-neutral-40 text-center">
            {tSession('endDialogQuestion')}
          </span>
          <span className="body-18 font-semibold">
            {tSession('endDialogTotal', { totalSessionTime })}
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
            {tCommon('cancel')}
          </Button>
          <Button
            type="button"
            className="h-[58px] flex-[11] rounded-[16px]"
            onClick={() => {
              void onConfirm();
            }}
          >
            {tSession('endDialogConfirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
