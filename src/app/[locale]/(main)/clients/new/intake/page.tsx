'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/i18n/navigation';
import ClientRegistrationStepBar from '@/features/clients/client-registration/ui/ClientRegistrationStepBar';
import ClientRegistrationAssessmentResultsForm from '@/features/clients/client-registration/ui/ClientRegistrationAssessmentResultsForm';
import ClientRegistrationIntakeInterviewForm from '@/features/clients/client-registration/ui/ClientRegistrationIntakeInterviewForm';
import {
  clearRegistrationDraft,
  getAssessmentResultsFromDraft,
  getDefaultAssessmentResults,
  getDefaultIntakeInterview,
  getIntakeInterviewFromDraft,
  getStoredClientRegistrationDraft,
  hasRequiredRegistrationDraft,
  saveIntakeStepDraft,
} from '@/features/clients/client-registration/intake/lib/intake-draft';
import type {
  AssessmentResultsFormValues,
  IntakeInterviewFormValues,
} from '@/features/clients/client-registration/types/client-registration';
import { Button } from '@/shared/ui/button';

const ClientRegistrationIntakePage = () => {
  const t = useTranslations('clientRegistration.common');
  const router = useRouter();

  const assessmentResultsForm = useForm<AssessmentResultsFormValues>({
    mode: 'onSubmit',
    defaultValues: getDefaultAssessmentResults(),
  });
  const intakeInterviewForm = useForm<IntakeInterviewFormValues>({
    mode: 'onSubmit',
    defaultValues: getDefaultIntakeInterview(),
  });

  useEffect(() => {
    const draft = getStoredClientRegistrationDraft();
    if (!draft) {
      router.replace('/clients/new');
      return;
    }

    if (!hasRequiredRegistrationDraft(draft)) {
      clearRegistrationDraft();
      router.replace('/clients/new');
      return;
    }

    assessmentResultsForm.reset(getAssessmentResultsFromDraft(draft));
    intakeInterviewForm.reset(getIntakeInterviewFromDraft(draft));
  }, [assessmentResultsForm, intakeInterviewForm, router]);

  const handleNext = async () => {
    const isAssessmentResultsValid = await assessmentResultsForm.trigger(undefined, {
      shouldFocus: true,
    });
    if (!isAssessmentResultsValid) return;

    const isIntakeInterviewValid = await intakeInterviewForm.trigger(undefined, {
      shouldFocus: true,
    });
    if (!isIntakeInterviewValid) return;

    const draft = getStoredClientRegistrationDraft();
    if (!draft) {
      router.replace('/clients/new');
      return;
    }

    saveIntakeStepDraft(draft, assessmentResultsForm.getValues(), intakeInterviewForm.getValues());
    router.push('/clients/new/review');
  };

  return (
    <section className="flex w-full items-start justify-center gap-4 pb-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="intake-interview-info" />
        <div className="flex w-full flex-col items-start gap-7">
          <ClientRegistrationAssessmentResultsForm form={assessmentResultsForm} />
          <ClientRegistrationIntakeInterviewForm form={intakeInterviewForm} />

          <div className="flex w-full justify-end">
            <Button type="button" size="lg" onClick={handleNext} className="w-full max-w-[244px]">
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientRegistrationIntakePage;
