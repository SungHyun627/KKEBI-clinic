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

export interface ClientRegistrationDraft {
  step: ClientRegistrationStepKey;
  basicInfo: BasicInfoFormValues;
  counselingInfo: CounselingInfoFormValues;
  paymentInfo: PaymentInfoFormValues;
  kkebiNickname: KkebiNicknameFormValues;
}
