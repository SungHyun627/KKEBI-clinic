'use client';

import { useState } from 'react';
import {
  addClientTestResult,
  registerClient,
} from '@/features/clients/client-registration/api/registerClient';
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
    additionalResultFailed: string;
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

  const submitAdditionalResults = async (
    clientId: number,
    assessmentResults: AssessmentResultsFormValues,
  ) => {
    const additionalResults = assessmentResults.additionalResults.filter(
      (result) => result.testName.trim().length > 0 && typeof result.testResult === 'number',
    );

    if (additionalResults.length === 0) {
      return true;
    }

    const responses = await Promise.all(
      additionalResults.map((result) =>
        addClientTestResult(clientId, {
          testName: result.testName.trim(),
          score: result.testResult ?? undefined,
        }),
      ),
    );

    return responses.every((response) => response.success);
  };

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

    if (typeof registerResult.clientId === 'number') {
      const isAdditionalResultSaved = await submitAdditionalResults(
        registerResult.clientId,
        values.assessmentResults,
      );
      if (!isAdditionalResultSaved) {
        toast(messages.additionalResultFailed);
      }
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
