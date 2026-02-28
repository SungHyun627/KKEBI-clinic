'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/i18n/navigation';
import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import ClientRegistrationAssessmentResultsForm from '@/features/clients/ui/ClientRegistrationAssessmentResultsForm';
import ClientRegistrationIntakeInterviewForm from '@/features/clients/ui/ClientRegistrationIntakeInterviewForm';
import {
  type AssessmentResultsFormValues,
  type ClientRegistrationDraft,
  type IntakeInterviewFormValues,
} from '@/features/clients/types/client-registration';
import { CLIENT_REGISTRATION_DRAFT_STORAGE_KEY } from '@/features/clients/lib/client-registration-storage';
import { Button } from '@/shared/ui/button';

const getDefaultAssessmentResults = (): AssessmentResultsFormValues => ({
  phq9Score: null,
  pss10Score: null,
  mbiScore: null,
  additionalResults: [],
  draftTestName: '',
});

const getDefaultIntakeInterview = (): IntakeInterviewFormValues => ({
  reasonForVisit: '',
  mostImportantChange: '',
  similarPastExperience: '',
  attemptedSolution: '',
  attemptedSolutionEffectiveness: '',
  currentBiggestConcern: '',
  averageSleepPattern: '',
  sleepQuality: '',
  exerciseTypeAndFrequency: '',
  mealsPerDay: '',
  mostReliablePerson: '',
  reasonForReliance: '',
  familyBond: '',
  reasonForFamilyBond: '',
  selfDescriptionSentence: '',
});

const ClientRegistrationIntakePage = () => {
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
    const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    if (!storedDraft) {
      router.replace('/clients/new');
      return;
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
      if (!parsedDraft.basicInfo || !parsedDraft.counselingInfo || !parsedDraft.paymentInfo) {
        router.replace('/clients/new');
        return;
      }

      if (parsedDraft.assessmentResults) {
        assessmentResultsForm.reset({
          ...getDefaultAssessmentResults(),
          ...parsedDraft.assessmentResults,
        });
      }
      if (parsedDraft.intakeInterview) {
        intakeInterviewForm.reset(parsedDraft.intakeInterview);
      }
    } catch {
      window.sessionStorage.removeItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
      router.replace('/clients/new');
    }
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

    const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    if (!storedDraft) {
      router.replace('/clients/new');
      return;
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
      const nextDraft: ClientRegistrationDraft = {
        ...parsedDraft,
        step: 'registration-complete',
        assessmentResults: assessmentResultsForm.getValues(),
        intakeInterview: intakeInterviewForm.getValues(),
      };
      window.sessionStorage.setItem(
        CLIENT_REGISTRATION_DRAFT_STORAGE_KEY,
        JSON.stringify(nextDraft),
      );
      router.push('/clients/new/complete');
    } catch {
      window.sessionStorage.removeItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
      router.replace('/clients/new');
    }
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
              다음으로
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientRegistrationIntakePage;
