'use client';

import { useTranslations } from 'next-intl';
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
  const tCommon = useTranslations('common');
  const tSummary = useTranslations('summary');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-[480px] w-full flex-col items-start gap-[26px] rounded-[24px] px-8 py-7">
        <DialogTitle className="absolute m-0 h-0 w-0 overflow-hidden p-0">
          <VisuallyHidden>{tSummary('quitDialogA11yTitle')}</VisuallyHidden>
        </DialogTitle>

        <div className="flex w-full flex-col items-center gap-[6px]">
          <span className="body-14 text-neutral-40 text-center">{tSummary('quitDialogTitle')}</span>
          <span className="body-18 font-semibold text-center">
            {tSummary('quitDialogDescription')}
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
            {tCommon('cancel')}
          </Button>
          <Button type="button" className="h-[58px] flex-[11] rounded-[16px]" onClick={onConfirm}>
            {tSummary('quitDialogConfirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
