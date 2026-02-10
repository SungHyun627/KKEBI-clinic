'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';

interface EmailSentDialogProps {
  isOpen: boolean;
  handleDialogOpen: (open: boolean) => void;
  sentEmail: string;
}

const EmailSentDialog = ({ isOpen, handleDialogOpen, sentEmail }: EmailSentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogContent className="flex max-w-[480px] p-7 md:p-6 flex-col justify-center items-center gap-[26px] rounded-[24px] bg-white">
        <DialogTitle className="absolute w-0 h-0 p-0 m-0 overflow-hidden">
          <VisuallyHidden>이메일 발송 완료</VisuallyHidden>
        </DialogTitle>
        <div className="flex flex-col w-full flex-shrink-0 flex-grow-0 items-center gap-[26px]">
          <div className="flex flex-col w-full items-center gap-[28px]">
            <div className="flex w-full justify-between items-center">
              <span className="font-pretendard text-[20px] font-semibold leading-[30px] text-center">
                이메일 발송 완료
              </span>
              <button
                type="button"
                aria-label="닫기"
                className="p-1 ml-2 hover:opacity-80 cursor-pointer"
                onClick={() => handleDialogOpen(false)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Image src="/icons/close.svg" alt="닫기" width={28} height={28} />
              </button>
            </div>
            <div className="flex flex-col w-full items-center gap-[23px]">
              <Image src="/images/checkmark.png" alt="발송 완료" width={120} height={120} />
              <div className="flex flex-col w-full items-center gap-[6px]">
                <span className="font-pretendard text-[18px] font-semibold leading-[28.8px] text-center text-label-strong">
                  {sentEmail}
                </span>
                <span className="font-pretendard text-[14px] font-normal leading-[21px] text-center text-neutral-30">
                  (으)로 비밀번호 재설정 링크가 발송되었습니다.
                  <br />
                  안내된 메일에 따라 비밀번호 재설정을 완료해 주세요.
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full items-start justify-center px-3 py-4 gap-[6px] rounded-2xl bg-neutral-99">
              <p className="body-14 text-neutral-50">
                • 이메일이 도착하지 않았다면 스팸 폴더를 확인해 주세요.
              </p>
              <p className="body-14 text-neutral-50">• 링크는 24시간 동안 유효합니다.</p>
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => handleDialogOpen(false)}
          >
            로그인으로 돌아가기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSentDialog;
