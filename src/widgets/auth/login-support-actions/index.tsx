'use client';

import { useState } from 'react';
import Link from 'next/link';
import ResetPasswordDialog from '@/features/auth/reset-password/ui/ResetPasswordDialog';
import EmailSentDialog from '@/features/auth/reset-password/ui/EmailSentDialog';

const LoginSupportActions = () => {
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isEmailSentOpen, setIsEmailSentOpen] = useState(false);
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
        <Link href="#" className="hover:text-label-normal">
          상담사 등록 문의
        </Link>
      </div>
      <ResetPasswordDialog
        isOpen={isPasswordResetOpen}
        handleDialogOpen={setIsPasswordResetOpen}
        setSentEmail={setSentEmail}
        setIsEmailSentOpen={setIsEmailSentOpen}
      />
      <EmailSentDialog
        isOpen={isEmailSentOpen}
        handleDialogOpen={setIsEmailSentOpen}
        sentEmail={sentEmail}
      />
    </>
  );
};

export default LoginSupportActions;
