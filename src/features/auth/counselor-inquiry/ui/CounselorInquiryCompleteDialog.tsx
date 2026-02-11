'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';

interface CounselorInquiryCompleteDialogProps {
  isOpen: boolean;
  handleDialogOpen: (open: boolean) => void;
  submittedEmail: string;
  submittedOrganization: string;
  submittedPhone: string;
  submittedLicenseNumber: string;
  submittedAdditionalInquiry: string;
}

const CounselorInquiryCompleteDialog = ({
  isOpen,
  handleDialogOpen,
  submittedEmail,
  submittedOrganization,
  submittedPhone,
  submittedLicenseNumber,
  submittedAdditionalInquiry,
}: CounselorInquiryCompleteDialogProps) => {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogContent className="flex max-w-[480px] p-7 md:p-6 flex-col justify-center items-center gap-[26px] rounded-[24px] bg-white">
        <DialogTitle className="absolute w-0 h-0 p-0 m-0 overflow-hidden">
          <VisuallyHidden>문의 접수 완료</VisuallyHidden>
        </DialogTitle>
        <div className="flex flex-col w-full flex-shrink-0 flex-grow-0 items-center gap-[26px]">
          <div className="flex flex-col w-full items-center gap-[28px]">
            <div className="relative flex w-full items-center justify-center">
              <span className="font-pretendard text-[20px] font-semibold leading-[30px] text-center w-full">
                문의 접수 완료
              </span>
              <button
                type="button"
                aria-label="닫기"
                className="absolute right-0 p-1 ml-2 hover:opacity-80 cursor-pointer"
                onClick={() => handleDialogOpen(false)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Image src="/icons/close.svg" alt="닫기" width={28} height={28} />
              </button>
            </div>
            <div className="flex flex-col w-full items-center gap-[23px]">
              <Image src="/images/checkmark.png" alt="접수 완료" width={120} height={120} />
              <div className="flex flex-col w-full items-center gap-[6px] px-3 py-4 rounded-2xl bg-neutral-99">
                <span className="font-pretendard body-18 font-semibold leading-[28.8px] text-center text-label-strong">
                  문의가 접수되었습니다.
                </span>
                <span className="font-pretendard text-[14px] font-normal leading-[21px] text-center text-neutral-30">
                  자격 검증 후 영업일 기준 2-3일 내
                  <br />
                  <span className="font-semibold">{submittedEmail}(으)로</span> 연락드리겠습니다.
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full items-start p-4 border borer-1 border-neutral-95 gap-3 rounded-2xl">
              <p className="body-16 text-neutral-20">접수된 정보</p>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">소속</span>
                  <span className="text-neutral-30">{submittedOrganization}</span>
                </div>
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">연락처</span>
                  <span className="text-neutral-30">{submittedPhone}</span>
                </div>
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">자격증</span>
                  <span className="text-neutral-30">{submittedLicenseNumber}</span>
                </div>
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">추가 문의사항</span>
                  <span className="text-neutral-30">
                    {submittedAdditionalInquiry.trim().length > 0
                      ? submittedAdditionalInquiry
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => {
              handleDialogOpen(false);
              router.push('/login');
            }}
          >
            로그인으로 돌아가기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CounselorInquiryCompleteDialog;
