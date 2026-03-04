import { CLIENT_REGISTRATION_DRAFT_STORAGE_KEY } from '@/features/clients/client-registration/lib/client-registration-storage';
import type {
  AssessmentResultsFormValues,
  ClientRegistrationDraft,
  IntakeInterviewFormValues,
} from '@/features/clients/client-registration/types/client-registration';

export const getDefaultAssessmentResults = (): AssessmentResultsFormValues => ({
  phq9Score: null,
  pss10Score: null,
  mbiScore: null,
  additionalResults: [],
  draftTestName: '',
});

export const getDefaultIntakeInterview = (): IntakeInterviewFormValues => ({
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

export const getStoredClientRegistrationDraft = (): ClientRegistrationDraft | null => {
  if (typeof window === 'undefined') return null;
  const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
  if (!storedDraft) return null;

  try {
    return JSON.parse(storedDraft) as ClientRegistrationDraft;
  } catch {
    return null;
  }
};

export const hasRequiredRegistrationDraft = (draft: ClientRegistrationDraft | null) =>
  Boolean(draft?.basicInfo && draft?.counselingInfo && draft?.paymentInfo);

export const getAssessmentResultsFromDraft = (draft: ClientRegistrationDraft) => ({
  ...getDefaultAssessmentResults(),
  ...draft.assessmentResults,
});

export const getIntakeInterviewFromDraft = (draft: ClientRegistrationDraft) =>
  draft.intakeInterview ?? getDefaultIntakeInterview();

export const saveIntakeStepDraft = (
  draft: ClientRegistrationDraft,
  assessmentResults: AssessmentResultsFormValues,
  intakeInterview: IntakeInterviewFormValues,
) => {
  if (typeof window === 'undefined') return;

  const nextDraft: ClientRegistrationDraft = {
    ...draft,
    step: 'registration-complete',
    assessmentResults,
    intakeInterview,
  };

  window.sessionStorage.setItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY, JSON.stringify(nextDraft));
};

export const clearRegistrationDraft = () => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
};
