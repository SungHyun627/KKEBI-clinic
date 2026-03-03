'use client';

import { useState } from 'react';
import { registerClient } from '@/features/clients/client-registration/api/registerClient';
import { CLIENT_REGISTRATION_DRAFT_STORAGE_KEY } from '@/features/clients/client-registration/lib/client-registration-storage';
import { buildRegisterClientPayload } from '@/features/clients/client-registration/lib/review-mapper';
import type {
  AssessmentResultsFormValues,
  BasicInfoFormValues,
  CounselingInfoFormValues,
  IntakeInterviewFormValues,
  KkebiNicknameFormValues,
  PaymentInfoFormValues,
} from '@/features/clients/client-registration/types/client-registration';
import { toast } from '@/shared/ui/toast';

interface UseSubmitClientRegistrationParams {
  locale: string;
  messages: {
    registerFailed: string;
    registerSuccess: string;
  };
  onSuccess: () => void;
}

interface SubmitValues {
  basicInfo: BasicInfoFormValues;
  counselingInfo: CounselingInfoFormValues;
  paymentInfo: PaymentInfoFormValues;
  kkebiNickname: KkebiNicknameFormValues;
  assessmentResults: AssessmentResultsFormValues;
  intakeInterview: IntakeInterviewFormValues;
}

const useSubmitClientRegistration = ({
  locale,
  messages,
  onSuccess,
}: UseSubmitClientRegistrationParams) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (values: SubmitValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = buildRegisterClientPayload(locale, values);
    const registerResult = await registerClient(payload);
    if (!registerResult.success) {
      toast(registerResult.message || messages.registerFailed);
      setIsSubmitting(false);
      return;
    }

    window.sessionStorage.removeItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    toast(messages.registerSuccess);
    setIsSubmitting(false);
    onSuccess();
  };

  return {
    isSubmitting,
    submit,
  };
};

export default useSubmitClientRegistration;
