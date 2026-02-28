'use client';

import { useState } from 'react';
import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import { CLIENT_REGISTRATION_DRAFT_STORAGE_KEY } from '@/features/clients/lib/client-registration-storage';
import type {
  AssessmentResultsFormValues,
  BasicInfoFormValues,
  CounselingInfoFormValues,
  ClientRegistrationDraft,
  IntakeInterviewFormValues,
  PaymentInfoFormValues,
} from '@/features/clients/types/client-registration';
import LabelCell from '@/features/clients/ui/ClientRegistrationLabelCell';
import ValueCell from '@/features/clients/ui/ClientRegistrationValueCell';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';

const EMPTY_BASIC_INFO: BasicInfoFormValues = {
  name: '',
  phone: '',
  email: '',
  birthDate: '',
  gender: '',
};

const EMPTY_COUNSELING_INFO: CounselingInfoFormValues = {
  counselingStartDate: '',
  chiefConcern: '',
  referralPath: '',
};

const EMPTY_PAYMENT_INFO: PaymentInfoFormValues = {
  paymentType: '',
  insuranceCompany: '',
};

const EMPTY_ASSESSMENT_RESULTS: AssessmentResultsFormValues = {
  phq9Score: null,
  pss10Score: null,
  mbiScore: null,
  additionalResults: [],
  draftTestName: '',
};

const EMPTY_INTAKE_INTERVIEW: IntakeInterviewFormValues = {
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

const getBasicInfoFromSessionStorage = (): BasicInfoFormValues => {
  if (typeof window === 'undefined') {
    return EMPTY_BASIC_INFO;
  }

  const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
  if (!storedDraft) return EMPTY_BASIC_INFO;

  try {
    const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
    return parsedDraft.basicInfo ?? EMPTY_BASIC_INFO;
  } catch {
    return EMPTY_BASIC_INFO;
  }
};

const getCounselingInfoFromSessionStorage = (): CounselingInfoFormValues => {
  if (typeof window === 'undefined') {
    return EMPTY_COUNSELING_INFO;
  }

  const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
  if (!storedDraft) return EMPTY_COUNSELING_INFO;

  try {
    const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
    return parsedDraft.counselingInfo ?? EMPTY_COUNSELING_INFO;
  } catch {
    return EMPTY_COUNSELING_INFO;
  }
};

const getPaymentInfoFromSessionStorage = (): PaymentInfoFormValues => {
  if (typeof window === 'undefined') {
    return EMPTY_PAYMENT_INFO;
  }

  const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
  if (!storedDraft) return EMPTY_PAYMENT_INFO;

  try {
    const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
    return parsedDraft.paymentInfo ?? EMPTY_PAYMENT_INFO;
  } catch {
    return EMPTY_PAYMENT_INFO;
  }
};

const getAssessmentResultsFromSessionStorage = (): AssessmentResultsFormValues => {
  if (typeof window === 'undefined') {
    return EMPTY_ASSESSMENT_RESULTS;
  }

  const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
  if (!storedDraft) return EMPTY_ASSESSMENT_RESULTS;

  try {
    const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
    return parsedDraft.assessmentResults ?? EMPTY_ASSESSMENT_RESULTS;
  } catch {
    return EMPTY_ASSESSMENT_RESULTS;
  }
};

const getIntakeInterviewFromSessionStorage = (): IntakeInterviewFormValues => {
  if (typeof window === 'undefined') {
    return EMPTY_INTAKE_INTERVIEW;
  }

  const storedDraft = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
  if (!storedDraft) return EMPTY_INTAKE_INTERVIEW;

  try {
    const parsedDraft = JSON.parse(storedDraft) as ClientRegistrationDraft;
    return parsedDraft.intakeInterview ?? EMPTY_INTAKE_INTERVIEW;
  } catch {
    return EMPTY_INTAKE_INTERVIEW;
  }
};

const ClientRegistrationReviewPage = () => {
  const [basicInfo] = useState<BasicInfoFormValues>(getBasicInfoFromSessionStorage);
  const [counselingInfo] = useState<CounselingInfoFormValues>(getCounselingInfoFromSessionStorage);
  const [paymentInfo] = useState<PaymentInfoFormValues>(getPaymentInfoFromSessionStorage);
  const [assessmentResults] = useState<AssessmentResultsFormValues>(
    getAssessmentResultsFromSessionStorage,
  );
  const [intakeInterview] = useState<IntakeInterviewFormValues>(
    getIntakeInterviewFromSessionStorage,
  );

  const paymentValue =
    paymentInfo.paymentType === 'insurance'
      ? `보험 적용${paymentInfo.insuranceCompany ? ` - ${paymentInfo.insuranceCompany}` : ''}`
      : paymentInfo.paymentType === 'private-pay'
        ? '자비 부담'
        : paymentInfo.paymentType;

  const scoreRows: Array<{ field: string; value: string }> = [
    { field: 'PHQ-9 우울 척도 점수', value: assessmentResults.phq9Score?.toString() ?? '' },
    { field: 'PSS-10 스트레스 척도 점수', value: assessmentResults.pss10Score?.toString() ?? '' },
    { field: 'MBI 소진 척도 점수', value: assessmentResults.mbiScore?.toString() ?? '' },
    ...assessmentResults.additionalResults.map((result) => ({
      field: result.testName,
      value: result.testResult?.toString() ?? '',
    })),
  ];

  const intakeRows: Array<{ field: string; value: string }> = [
    { field: '1. 상담 방문 이유', value: intakeInterview.reasonForVisit },
    {
      field: '2. 상담을 통해 얻고 싶은 가장 중요한 변화',
      value: intakeInterview.mostImportantChange,
    },
    { field: '3. 과거 비슷한 어려움 경험 유무', value: intakeInterview.similarPastExperience },
    { field: '3-1. 당시 해결을 위해서 시도한 방법', value: intakeInterview.attemptedSolution },
    { field: '3-2. 방법의 효과성 정도', value: intakeInterview.attemptedSolutionEffectiveness },
    { field: '4. 지금 가장 고민되는 문제', value: intakeInterview.currentBiggestConcern },
    { field: '5. 평균 수면 패턴', value: intakeInterview.averageSleepPattern },
    { field: '5-1. 수면의 질', value: intakeInterview.sleepQuality },
    { field: '6. 하고 있는 운동의 종류와 빈도', value: intakeInterview.exerciseTypeAndFrequency },
    { field: '7. 하루에 섭취하는 끼니 수', value: intakeInterview.mealsPerDay },
    { field: '8. 가장 의지하는 사람', value: intakeInterview.mostReliablePerson },
    { field: '8-1. 그 사람을 가장 의지하는 이유', value: intakeInterview.reasonForReliance },
    { field: '9. 가족과의 유대감', value: intakeInterview.familyBond },
    { field: '9-1. 그렇게 생각한 이유', value: intakeInterview.reasonForFamilyBond },
    { field: '10. 스스로를 한 문장으로 표현', value: intakeInterview.selfDescriptionSentence },
  ];

  return (
    <section className="flex w-full items-start justify-center gap-4 pb-4">
      <div className="flex w-full flex-col items-start max-w-[1200px] gap-[33px]">
        <div className="flex w-full flex-col justify-center items-start gap-[42px]">
          <div className="flex flex-col w-full justify-center items-center gap-[23px]">
            <Image src="/icons/checkmark.svg" alt={'내담자 등록 완료'} width={96} height={96} />
            <div className="flex flex-col justify-center items-center gap-2">
              <span className="text-[24px] font-semibold text-label-normal">
                {'내담자 등록이 완료되었습니다.'}
              </span>
              <span className="body-16 text-label-alternative">
                정보 확인 후 수정 또는 완료해주세요.
              </span>
            </div>
          </div>

          <ClientRegistrationStepBar
            currentStep="registration-complete"
            className="w-full max-w-[626px] self-center"
          />
        </div>

        <div className="flex w-full flex-col items-start gap-[23px]">
          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">기본 정보</h2>
            <div className="flex w-full flex-col gap-4">
              <div className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white">
                <div className="flex flex-col">
                  <LabelCell field="이름" />
                  <ValueCell value={basicInfo.name} />
                </div>
                <div className="flex flex-col">
                  <LabelCell field="연락처" />
                  <ValueCell value={basicInfo.phone} />
                </div>
              </div>

              <div className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white">
                <div className="flex flex-col">
                  <LabelCell field="이메일" />
                  <ValueCell value={basicInfo.email} />
                </div>
                <div className="flex flex-col">
                  <LabelCell field="생년월일" />
                  <ValueCell value={basicInfo.birthDate} />
                </div>
              </div>

              <div className="grid w-full grid-cols-1 bg-white">
                <div className="flex flex-col">
                  <LabelCell field="성별" />
                  <ValueCell value={basicInfo.gender} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">상담 정보</h2>
            <div className="flex w-full flex-col gap-4">
              <div className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white">
                <div className="flex flex-col">
                  <LabelCell field="상담 시작 일자" />
                  <ValueCell value={counselingInfo.counselingStartDate} />
                </div>
                <div className="flex flex-col">
                  <LabelCell field="주 호소 문제" />
                  <ValueCell value={counselingInfo.chiefConcern} />
                </div>
              </div>

              <div className="grid w-full grid-cols-1 bg-white">
                <div className="flex flex-col">
                  <LabelCell field="유입 경로" />
                  <ValueCell value={counselingInfo.referralPath} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">보험/결제 정보</h2>
            <div className="grid w-full grid-cols-1 bg-white">
              <div className="flex flex-col">
                <LabelCell field="결제 정보" />
                <ValueCell value={paymentValue} />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">검사 결과</h2>
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: Math.ceil(scoreRows.length / 2) }).map((_, rowIndex) => {
                const left = scoreRows[rowIndex * 2];
                const right = scoreRows[rowIndex * 2 + 1];

                if (!right) {
                  return (
                    <div key={left.field} className="grid w-full grid-cols-1 bg-white">
                      <div className="flex flex-col">
                        <LabelCell field={left.field} />
                        <ValueCell value={left.value} />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${left.field}-${right.field}`}
                    className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white"
                  >
                    <div className="flex flex-col">
                      <LabelCell field={left.field} />
                      <ValueCell value={left.value} />
                    </div>
                    <div className="flex flex-col">
                      <LabelCell field={right.field} />
                      <ValueCell value={right.value} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">접수면접 결과</h2>
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: Math.ceil(intakeRows.length / 2) }).map((_, rowIndex) => {
                const left = intakeRows[rowIndex * 2];
                const right = intakeRows[rowIndex * 2 + 1];

                if (!right) {
                  return (
                    <div key={left.field} className="grid w-full grid-cols-1 bg-white">
                      <div className="flex flex-col">
                        <LabelCell field={left.field} />
                        <ValueCell value={left.value} />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${left.field}-${right.field}`}
                    className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white"
                  >
                    <div className="flex flex-col">
                      <LabelCell field={left.field} />
                      <ValueCell value={left.value} />
                    </div>
                    <div className="flex flex-col">
                      <LabelCell field={right.field} />
                      <ValueCell value={right.value} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex w-full justify-end">
            <Button type="button" size="lg" className="w-full max-w-[244px]">
              등록 완료
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientRegistrationReviewPage;
