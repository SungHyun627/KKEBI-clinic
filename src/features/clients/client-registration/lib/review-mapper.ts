import type { components } from '@/shared/api/generated-types';
import type {
  AssessmentResultsFormValues,
  BasicInfoFormValues,
  CounselingInfoFormValues,
  IntakeInterviewFormValues,
  KkebiNicknameFormValues,
  PaymentInfoFormValues,
} from '@/features/clients/client-registration/types/client-registration';

type RegisterClientRequest = components['schemas']['ClientRegistrationRequest'];

export const getGenderDisplayValue = (
  value: string,
  labels: { female: string; male: string; nonBinary: string },
) => {
  if (value === 'female') return labels.female;
  if (value === 'male') return labels.male;
  if (value === 'non-binary') return labels.nonBinary;
  return value;
};

export const getReferralPathDisplayValue = (value: string, locale: string) => {
  if (value === 'search') return locale === 'en' ? 'Search' : '검색';
  if (value === 'referral') return locale === 'en' ? 'Referral' : '지인 추천';
  if (value === 'hospital') return locale === 'en' ? 'Hospital referral' : '병원 의뢰';
  if (value === 'kkebi-app') return 'KKEBI앱';
  if (value === 'other') return locale === 'en' ? 'Other' : '기타';
  return value;
};

export const mapGenderToApi = (value: string): RegisterClientRequest['gender'] | undefined => {
  if (value === 'female') return 'FEMALE';
  if (value === 'male') return 'MALE';
  if (value === 'non-binary') return 'NON_BINARY';
  return undefined;
};

export const mapPaymentTypeToApi = (
  value: string,
): RegisterClientRequest['paymentType'] | undefined => {
  if (value === 'insurance') return 'INSURANCE';
  if (value === 'private-pay') return 'SELF';
  return undefined;
};

export const mapReferralSourceToApi = (value: string, locale: string) => {
  if (value === 'search') return locale === 'en' ? 'Search' : '검색';
  if (value === 'referral') return locale === 'en' ? 'Referral' : '지인 추천';
  if (value === 'hospital') return locale === 'en' ? 'Hospital referral' : '병원 의뢰';
  if (value === 'kkebi-app') return 'KKEBI앱';
  if (value === 'other') return locale === 'en' ? 'Other' : '기타';
  return value || undefined;
};

export const buildRegisterClientPayload = (
  locale: string,
  values: {
    basicInfo: BasicInfoFormValues;
    counselingInfo: CounselingInfoFormValues;
    paymentInfo: PaymentInfoFormValues;
    kkebiNickname: KkebiNicknameFormValues;
    assessmentResults: AssessmentResultsFormValues;
    intakeInterview: IntakeInterviewFormValues;
  },
): RegisterClientRequest => {
  const {
    basicInfo,
    counselingInfo,
    paymentInfo,
    kkebiNickname,
    assessmentResults,
    intakeInterview,
  } = values;

  return {
    name: basicInfo.name.trim(),
    nickname: kkebiNickname.kkebiNickname.trim() || undefined,
    phoneNumber: basicInfo.phone.trim() || undefined,
    email: basicInfo.email.trim() || undefined,
    birthDate: basicInfo.birthDate || undefined,
    gender: mapGenderToApi(basicInfo.gender),
    paymentType: mapPaymentTypeToApi(paymentInfo.paymentType),
    counselingStartDate: counselingInfo.counselingStartDate || undefined,
    counselingStartTime: counselingInfo.counselingStartTime || undefined,
    counselingEndTime: counselingInfo.counselingEndTime || undefined,
    chiefComplaint: counselingInfo.chiefConcern.trim() || undefined,
    referralSource: mapReferralSourceToApi(counselingInfo.referralPath, locale),
    insuranceCompany:
      paymentInfo.paymentType === 'insurance'
        ? paymentInfo.insuranceCompany.trim() || undefined
        : undefined,
    initialTestResults: assessmentResults.additionalResults
      .filter(
        (result) => result.testName.trim().length > 0 && typeof result.testResult === 'number',
      )
      .map((result) => ({
        testName: result.testName.trim(),
        score: result.testResult ?? undefined,
      })),
    intake: {
      phq9Score: assessmentResults.phq9Score ?? undefined,
      pss10Score: assessmentResults.pss10Score ?? undefined,
      mbiScore: assessmentResults.mbiScore ?? undefined,
      visitReason: intakeInterview.reasonForVisit || undefined,
      desiredChange: intakeInterview.mostImportantChange || undefined,
      similarDifficultyHistory: intakeInterview.similarPastExperience || undefined,
      attemptedSolution: intakeInterview.attemptedSolution || undefined,
      solutionEffectiveness: intakeInterview.attemptedSolutionEffectiveness || undefined,
      currentWorry: intakeInterview.currentBiggestConcern || undefined,
      sleepPattern: intakeInterview.averageSleepPattern || undefined,
      sleepQuality: intakeInterview.sleepQuality || undefined,
      exerciseFrequency: intakeInterview.exerciseTypeAndFrequency || undefined,
      mealsPerDay: intakeInterview.mealsPerDay || undefined,
      reliablePerson: intakeInterview.mostReliablePerson || undefined,
      reliableReason: intakeInterview.reasonForReliance || undefined,
      familyBond: intakeInterview.familyBond || undefined,
      familyBondReason: intakeInterview.reasonForFamilyBond || undefined,
      selfDescription: intakeInterview.selfDescriptionSentence || undefined,
    },
  };
};
