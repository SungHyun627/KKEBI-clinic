'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/i18n/navigation';
import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import ClientRegistrationBasicInfoForm from '@/features/clients/ui/ClientRegistrationBasicInfoForm';
import ClientRegistrationCounselingInfoForm from '@/features/clients/ui/ClientRegistrationCounselingInfoForm';
import ClientRegistrationPaymentInfoForm from '@/features/clients/ui/ClientRegistrationPaymentInfoForm';
import ClientRegistrationKkebiNicknameForm from '@/features/clients/ui/ClientRegistrationKkebiNicknameForm';
import {
  type AssessmentResultsFormValues,
  type BasicInfoFormValues,
  type CounselingInfoFormValues,
  type KkebiNicknameFormValues,
  type PaymentInfoFormValues,
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

const getTodayDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const NewClientPage = () => {
  const t = useTranslations('clientRegistration.common');
  const router = useRouter();
  const basicInfoForm = useForm<BasicInfoFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      birthDate: getTodayDateKey(),
      gender: '',
    },
  });
  const counselingInfoForm = useForm<CounselingInfoFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      counselingStartDate: getTodayDateKey(),
      chiefConcern: '',
      referralPath: '',
    },
  });
  const paymentInfoForm = useForm<PaymentInfoFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      paymentType: '',
      insuranceCompany: '',
    },
  });
  const kkebiNicknameForm = useForm<KkebiNicknameFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      kkebiNickname: '',
    },
  });

  useEffect(() => {
    const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    if (!storedDraft) return;

    try {
      const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
      if (parsedDraft.basicInfo) {
        basicInfoForm.reset(parsedDraft.basicInfo);
      }
      if (parsedDraft.counselingInfo) {
        counselingInfoForm.reset(parsedDraft.counselingInfo);
      }
      if (parsedDraft.paymentInfo) {
        paymentInfoForm.reset(parsedDraft.paymentInfo);
      }
      if (parsedDraft.kkebiNickname) {
        kkebiNicknameForm.reset(parsedDraft.kkebiNickname);
      }
    } catch {
      window.sessionStorage.removeItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    }
  }, [basicInfoForm, counselingInfoForm, kkebiNicknameForm, paymentInfoForm]);

  const basicName = basicInfoForm.watch('name');
  const basicPhone = basicInfoForm.watch('phone');
  const basicEmail = basicInfoForm.watch('email');
  const basicBirthDate = basicInfoForm.watch('birthDate');
  const counselingChiefConcern = counselingInfoForm.watch('chiefConcern');
  const paymentType = paymentInfoForm.watch('paymentType');
  const insuranceCompany = paymentInfoForm.watch('insuranceCompany');
  const isInsurancePayment = paymentType === 'insurance';
  const isAllRequiredFilled =
    Boolean(basicName.trim()) &&
    Boolean(basicPhone.trim()) &&
    Boolean(basicEmail.trim()) &&
    Boolean(basicBirthDate.trim()) &&
    Boolean(counselingChiefConcern.trim()) &&
    Boolean(paymentType.trim()) &&
    (!isInsurancePayment || Boolean(insuranceCompany.trim()));

  const saveDraftToSessionStorage = (nextStep: ClientRegistrationDraft['step']) => {
    const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    let previousDraft: ClientRegistrationDraft | null = null;

    if (storedDraft) {
      try {
        previousDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
      } catch {
        previousDraft = null;
      }
    }

    const draft: ClientRegistrationDraft = {
      step: nextStep,
      basicInfo: basicInfoForm.getValues(),
      counselingInfo: counselingInfoForm.getValues(),
      paymentInfo: paymentInfoForm.getValues(),
      kkebiNickname: kkebiNicknameForm.getValues(),
      assessmentResults: previousDraft?.assessmentResults ?? getDefaultAssessmentResults(),
      intakeInterview: previousDraft?.intakeInterview ?? getDefaultIntakeInterview(),
    };
    window.sessionStorage.setItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  };

  const handleNext = async () => {
    const isBasicInfoValid = await basicInfoForm.trigger(undefined, { shouldFocus: true });
    if (!isBasicInfoValid) return;

    const isCounselingInfoValid = await counselingInfoForm.trigger(undefined, {
      shouldFocus: true,
    });
    if (!isCounselingInfoValid) return;

    const isPaymentInfoValid = await paymentInfoForm.trigger(undefined, { shouldFocus: true });
    if (!isPaymentInfoValid) return;

    await kkebiNicknameForm.trigger();

    saveDraftToSessionStorage('intake-interview-info');
    router.push('/clients/new/intake');
  };

  return (
    <section className="flex w-full items-start justify-center gap-4 pb-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="basic-info" />
        <div className="flex w-full flex-col items-start gap-7">
          <ClientRegistrationBasicInfoForm form={basicInfoForm} />
          <ClientRegistrationCounselingInfoForm form={counselingInfoForm} />
          <ClientRegistrationPaymentInfoForm form={paymentInfoForm} />
          <ClientRegistrationKkebiNicknameForm form={kkebiNicknameForm} />

          <div className="flex w-full justify-end">
            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              disabled={!isAllRequiredFilled}
              className="w-full max-w-[244px]"
            >
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewClientPage;
