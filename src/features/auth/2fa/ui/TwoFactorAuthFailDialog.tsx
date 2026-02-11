import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { Button } from '@/shared/ui/button';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          <VisuallyHidden>인증 실패</VisuallyHidden>
        </DialogTitle>
        <div className="flex w-full flex-col items-center gap-6">
          <DialogHeader>
            <p className="text-[14px] leading-[21px] font-normal text-neutral-40">인증 실패</p>
            <p className="text-[18px] leading-[28.8px] font-semibold text-neutral-0">
              인증 번호를 다시 확인해주세요
            </p>
          </DialogHeader>
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              onConfirm();
            }}
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthFailDialog;
