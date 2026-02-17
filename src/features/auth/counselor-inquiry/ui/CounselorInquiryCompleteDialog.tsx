'use client';

import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { useTranslations } from 'next-intl';

interface CounselorInquiryCompleteDialogProps {
  isOpen: boolean;
  handleDialogOpen: (open: boolean) => void;
  submittedEmail: string;
  submittedName: string;
  submittedOrganization: string;
  submittedPhone: string;
  submittedLicenseNumber: string;
  submittedAdditionalInquiry: string;
}

const CounselorInquiryCompleteDialog = ({
  isOpen,
  handleDialogOpen,
  submittedEmail,
  submittedName,
  submittedOrganization,
  submittedPhone,
  submittedLicenseNumber,
  submittedAdditionalInquiry,
}: CounselorInquiryCompleteDialogProps) => {
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogContent className="flex max-w-[480px] p-7 md:p-6 flex-col justify-center items-center gap-[26px] rounded-[24px] bg-white">
        <DialogTitle className="absolute w-0 h-0 p-0 m-0 overflow-hidden">
          <VisuallyHidden>{tAuth('inquiryReceivedTitle')}</VisuallyHidden>
        </DialogTitle>
        <div className="flex flex-col w-full flex-shrink-0 flex-grow-0 items-center gap-[26px]">
          <div className="flex flex-col w-full items-center gap-[28px]">
            <div className="relative flex w-full items-center justify-center">
              <span className="font-pretendard text-[20px] font-semibold leading-[30px] text-center w-full">
                {tAuth('inquiryReceivedTitle')}
              </span>
              <button
                type="button"
                aria-label={tCommon('close')}
                className="absolute right-0 p-1 ml-2 hover:opacity-80 cursor-pointer"
                onClick={() => handleDialogOpen(false)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Image src="/icons/close.svg" alt={tCommon('close')} width={28} height={28} />
              </button>
            </div>
            <div className="flex flex-col w-full items-center gap-[23px]">
              <Image
                src="/icons/checkmark.svg"
                alt={tAuth('inquiryReceivedStatus')}
                width={120}
                height={120}
              />
              <div className="flex flex-col w-full items-center gap-[6px] px-3 py-4 rounded-2xl bg-neutral-99">
                <span className="font-pretendard body-18 font-semibold leading-[28.8px] text-center text-label-strong">
                  {tAuth('inquiryReceivedBody')}
                </span>
                <span className="font-pretendard text-[14px] font-normal leading-[21px] text-center text-neutral-30">
                  {tAuth('inquiryContactWindow')}
                  <br />
                  <span className="font-semibold">
                    {tAuth('inquiryContactToSuffix', { email: submittedEmail })}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full items-start p-4 border borer-1 border-neutral-95 gap-3 rounded-2xl">
              <p className="body-16 text-neutral-20">{tAuth('inquirySubmittedInfo')}</p>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">{tAuth('inquiryName')}</span>
                  <span className="text-neutral-30">{submittedName}</span>
                </div>
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">{tAuth('inquiryAffiliation')}</span>
                  <span className="text-neutral-30">{submittedOrganization}</span>
                </div>
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">{tAuth('inquiryPhone')}</span>
                  <span className="text-neutral-30">{submittedPhone}</span>
                </div>
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">{tAuth('inquiryLicense')}</span>
                  <span className="text-neutral-30">{submittedLicenseNumber}</span>
                </div>
                <div className="flex items-center gap-2 body-14">
                  <span className="text-neutral-60">{tAuth('inquiryAdditionalNotes')}</span>
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
            {tCommon('backToLogin')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CounselorInquiryCompleteDialog;
