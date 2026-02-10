import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';

interface LoginFailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginFailDialog({ open, onOpenChange }: LoginFailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          <VisuallyHidden>로그인 실패</VisuallyHidden>
        </DialogTitle>
        <div className="flex w-full flex-col items-center gap-6">
          <DialogHeader>
            <p className="text-[14px] leading-[21px] font-normal text-neutral-40">로그인 실패</p>
            <p className="text-[18px] leading-[28.8px] font-semibold text-neutral-0">
              관리자 계정 정보가 없습니다.
            </p>
          </DialogHeader>
          <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
