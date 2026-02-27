export type ClientRegistrationStepKey =
  | 'basic-info'
  | 'intake-interview-info'
  | 'registration-complete';

export interface BasicInfoFormValues {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
}

export interface CounselingInfoFormValues {
  counselingStartDate: string;
  chiefConcern: string;
  referralPath: string;
}

export interface PaymentInfoFormValues {
  paymentType: string;
  insuranceCompany: string;
}

export interface KkebiNicknameFormValues {
  kkebiNickname: string;
}

export interface AssessmentAdditionalResult {
  testName: string;
  testResult: number | null;
}

export interface AssessmentResultsFormValues {
  phq9Score: number | null;
  pss10Score: number | null;
  mbiScore: number | null;
  additionalResults: AssessmentAdditionalResult[];
  draftTestName: string;
}

export interface IntakeInterviewFormValues {
  reasonForVisit: string;
  mostImportantChange: string;
  similarPastExperience: string;
  attemptedSolution: string;
  attemptedSolutionEffectiveness: string;
  currentBiggestConcern: string;
  averageSleepPattern: string;
  sleepQuality: string;
  exerciseTypeAndFrequency: string;
  mealsPerDay: string;
  mostReliablePerson: string;
  reasonForReliance: string;
  familyBond: string;
  reasonForFamilyBond: string;
  selfDescriptionSentence: string;
}

export interface ClientRegistrationDraft {
  step: ClientRegistrationStepKey;
  basicInfo: BasicInfoFormValues;
  counselingInfo: CounselingInfoFormValues;
  paymentInfo: PaymentInfoFormValues;
  kkebiNickname: KkebiNicknameFormValues;
  assessmentResults: AssessmentResultsFormValues;
  intakeInterview: IntakeInterviewFormValues;
}
