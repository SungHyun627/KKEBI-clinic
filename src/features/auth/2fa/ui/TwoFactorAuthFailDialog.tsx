import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { Button } from '@/shared/ui/button';
import { useTranslations } from 'next-intl';

interface TwoFactorAuthFailDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => void;
}

const TwoFactorAuthFailDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: TwoFactorAuthFailDialogProps) => {
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          <VisuallyHidden>{tAuth('otpFailedTitle')}</VisuallyHidden>
        </DialogTitle>
        <div className="flex w-full flex-col items-center gap-6">
          <DialogHeader>
            <p className="text-[14px] leading-[21px] font-normal text-neutral-40">
              {tAuth('otpFailedTitle')}
            </p>
            <p className="text-[18px] leading-[28.8px] font-semibold text-neutral-0">
              {tAuth('otpFailedBody')}
            </p>
          </DialogHeader>
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              onConfirm();
            }}
          >
            {tCommon('confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthFailDialog;
