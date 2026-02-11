'use client';

import { useState } from 'react';
import RequestResetPasswordDialog from '@/features/auth/reset-password/ui/RequestResetPasswordDialog';
import EmailSentConfirmDialog from '@/features/auth/reset-password/ui/EmailSentConfirmDialog';
import { RequestCounselorInquiryDialog } from '@/features/auth/counselor-inquiry';

const LoginSupportActions = () => {
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isEmailSentOpen, setIsEmailSentOpen] = useState(false);
  const [isCounselorInquiryOpen, setIsCounselorInquiryOpen] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  return (
    <>
      <div className="flex items-center gap-3 text-[18px] leading-[28.8px] font-medium text-neutral-60">
        <button
          type="button"
          className="hover:text-label-normal text-inherit bg-transparent border-none p-0 cursor-pointer"
          onClick={() => setIsPasswordResetOpen(true)}
        >
          비밀번호 찾기
        </button>
        <span className="h-5 w-px bg-neutral-80" />
        <button
          type="button"
          className="hover:text-label-normal text-inherit bg-transparent border-none p-0 cursor-pointer"
          onClick={() => setIsCounselorInquiryOpen(true)}
        >
          상담사 등록 문의
        </button>
      </div>
      <RequestResetPasswordDialog
        isOpen={isPasswordResetOpen}
        handleDialogOpen={setIsPasswordResetOpen}
        setSentEmail={setSentEmail}
        setIsEmailSentOpen={setIsEmailSentOpen}
      />
      <EmailSentConfirmDialog
        isOpen={isEmailSentOpen}
        handleDialogOpen={setIsEmailSentOpen}
        sentEmail={sentEmail}
      />
      <RequestCounselorInquiryDialog
        isOpen={isCounselorInquiryOpen}
        onOpenChange={setIsCounselorInquiryOpen}
      />
    </>
  );
};

export default LoginSupportActions;
