import { CLIENT_REGISTRATION_DRAFT_STORAGE_KEY } from '@/features/clients/client-registration/lib/client-registration-storage';
import type {
  AssessmentResultsFormValues,
  BasicInfoFormValues,
  ClientRegistrationDraft,
  CounselingInfoFormValues,
  IntakeInterviewFormValues,
  KkebiNicknameFormValues,
  PaymentInfoFormValues,
} from '@/features/clients/client-registration/types/client-registration';

export const EMPTY_BASIC_INFO: BasicInfoFormValues = {
  name: '',
  phone: '',
  email: '',
  birthDate: '',
  gender: '',
};

export const EMPTY_COUNSELING_INFO: CounselingInfoFormValues = {
  counselingStartDate: '',
  counselingStartTime: '09:00',
  counselingEndTime: '10:00',
  chiefConcern: '',
  referralPath: '',
};

export const EMPTY_PAYMENT_INFO: PaymentInfoFormValues = {
  paymentType: '',
  insuranceCompany: '',
};

export const EMPTY_KKEBI_NICKNAME: KkebiNicknameFormValues = {
  kkebiNickname: '',
};

export const EMPTY_ASSESSMENT_RESULTS: AssessmentResultsFormValues = {
  phq9Score: null,
  pss10Score: null,
  mbiScore: null,
  additionalResults: [],
  draftTestName: '',
};

export const EMPTY_INTAKE_INTERVIEW: IntakeInterviewFormValues = {
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
};

export const getStoredReviewDraft = (): ClientRegistrationDraft | null => {
  if (typeof window === 'undefined') return null;

  const stored = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as ClientRegistrationDraft;
  } catch {
    return null;
  }
};

export const getReviewStateFromStorage = () => {
  const draft = getStoredReviewDraft();

  return {
    basicInfo: draft?.basicInfo ?? EMPTY_BASIC_INFO,
    counselingInfo: draft?.counselingInfo ?? EMPTY_COUNSELING_INFO,
    paymentInfo: draft?.paymentInfo ?? EMPTY_PAYMENT_INFO,
    kkebiNickname: draft?.kkebiNickname ?? EMPTY_KKEBI_NICKNAME,
    assessmentResults: draft?.assessmentResults ?? EMPTY_ASSESSMENT_RESULTS,
    intakeInterview: draft?.intakeInterview ?? EMPTY_INTAKE_INTERVIEW,
  };
};
