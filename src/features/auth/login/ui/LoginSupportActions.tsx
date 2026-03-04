'use client';

import { useState } from 'react';
import RequestResetPasswordDialog from '@/features/auth/reset-password/ui/RequestResetPasswordDialog';
import EmailSentConfirmDialog from '@/features/auth/reset-password/ui/EmailSentConfirmDialog';
import {
  CounselorInquiryCompleteDialog,
  RequestCounselorInquiryDialog,
} from '@/features/auth/counselor-inquiry';
import { useTranslations } from 'next-intl';

const LoginSupportActions = () => {
  const tAuth = useTranslations('auth');
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isEmailSentOpen, setIsEmailSentOpen] = useState(false);
  const [isCounselorInquiryOpen, setIsCounselorInquiryOpen] = useState(false);
  const [isCounselorInquiryCompleteOpen, setIsCounselorInquiryCompleteOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [submittedOrganization, setSubmittedOrganization] = useState('');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [submittedLicenseNumber, setSubmittedLicenseNumber] = useState('');
  const [submittedAdditionalInquiry, setSubmittedAdditionalInquiry] = useState('');
  const [sentEmail, setSentEmail] = useState('');

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="inline-flex items-center gap-x-4 text-[18px] leading-[28.8px] font-medium text-neutral-60">
          <button
            type="button"
            className="hover:text-label-normal text-inherit bg-transparent border-none p-0 cursor-pointer whitespace-nowrap"
            onClick={() => setIsPasswordResetOpen(true)}
          >
            {tAuth('loginForgotPassword')}
          </button>
          <span className="h-5 w-px bg-neutral-80" />
          <button
            type="button"
            className="hover:text-label-normal text-inherit bg-transparent border-none p-0 cursor-pointer whitespace-nowrap"
            onClick={() => setIsCounselorInquiryOpen(true)}
          >
            {tAuth('loginCounselorInquiry')}
          </button>
        </div>
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
        onSubmitSuccess={(values) => {
          setSubmittedEmail(values.email);
          setSubmittedName(values.name);
          setSubmittedOrganization(values.organization);
          setSubmittedPhone(values.phone);
          setSubmittedLicenseNumber(values.licenseNumber);
          setSubmittedAdditionalInquiry(values.additionalInquiry);
          setIsCounselorInquiryCompleteOpen(true);
        }}
      />
      <CounselorInquiryCompleteDialog
        isOpen={isCounselorInquiryCompleteOpen}
        handleDialogOpen={setIsCounselorInquiryCompleteOpen}
        submittedEmail={submittedEmail}
        submittedName={submittedName}
        submittedOrganization={submittedOrganization}
        submittedPhone={submittedPhone}
        submittedLicenseNumber={submittedLicenseNumber}
        submittedAdditionalInquiry={submittedAdditionalInquiry}
      />
    </>
  );
};

export default LoginSupportActions;
