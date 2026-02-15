'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { useTranslations } from 'next-intl';

interface LoginFailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginFailDialog({ open, onOpenChange }: LoginFailDialogProps) {
  const tLogin = useTranslations('auth.login');
  const tCommon = useTranslations('common');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          <VisuallyHidden>{tLogin('failTitle')}</VisuallyHidden>
        </DialogTitle>
        <div className="flex w-full flex-col items-center gap-6">
          <DialogHeader>
            <p className="text-[14px] leading-[21px] font-normal text-neutral-40">
              {tLogin('failTitle')}
            </p>
            <p className="text-[18px] leading-[28.8px] font-semibold text-neutral-0">
              {tLogin('failBody')}
            </p>
          </DialogHeader>
          <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
            {tCommon('confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
