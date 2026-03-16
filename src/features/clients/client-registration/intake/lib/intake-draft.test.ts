import { afterEach, describe, expect, it } from 'vitest';
import {
  clearRegistrationDraft,
  getAssessmentResultsFromDraft,
  getIntakeInterviewFromDraft,
  getStoredClientRegistrationDraft,
  hasRequiredRegistrationDraft,
  saveIntakeStepDraft,
} from './intake-draft';
import { CLIENT_REGISTRATION_DRAFT_STORAGE_KEY } from '@/features/clients/client-registration/lib/client-registration-storage';
import type { ClientRegistrationDraft } from '@/features/clients/client-registration/types/client-registration';

const createDraft = (): ClientRegistrationDraft => ({
  step: 'intake-interview-info',
  basicInfo: {
    name: '홍길동',
    phone: '010-1111-2222',
    email: 'test@kkebi.com',
    birthDate: '1990-01-01',
    gender: 'male',
  },
  counselingInfo: {
    counselingStartDate: '2026-03-15',
    counselingStartTime: '09:00',
    counselingEndTime: '10:00',
    chiefConcern: '불안',
    referralPath: 'search',
  },
  paymentInfo: {
    paymentType: 'insurance',
    insuranceCompany: '건강보험',
  },
  kkebiNickname: {
    kkebiNickname: '케비',
  },
  assessmentResults: {
    phq9Score: 10,
    pss10Score: 12,
    mbiScore: 20,
    additionalResults: [{ testName: 'GAD-7', testResult: 8 }],
    draftTestName: '',
  },
  intakeInterview: {
    reasonForVisit: '스트레스',
    mostImportantChange: '불안 완화',
    similarPastExperience: '있음',
    attemptedSolution: '운동',
    attemptedSolutionEffectiveness: '보통',
    currentBiggestConcern: '업무',
    averageSleepPattern: '6시간',
    sleepQuality: '보통',
    exerciseTypeAndFrequency: '걷기 주 3회',
    mealsPerDay: '3회',
    mostReliablePerson: '배우자',
    reasonForReliance: '지지',
    familyBond: '양호',
    reasonForFamilyBond: '소통',
    selfDescriptionSentence: '성실함',
  },
});

const mockStorage = () => {
  const store = new Map<string, string>();
  const sessionStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { sessionStorage },
  });

  return { sessionStorage };
};

afterEach(() => {
  // 테스트 간 전역 오염 방지
  Reflect.deleteProperty(globalThis, 'window');
});

describe('intake-draft', () => {
  it('필수 등록 정보 유무를 판별한다', () => {
    const draft = createDraft();
    expect(hasRequiredRegistrationDraft(draft)).toBe(true);
    expect(hasRequiredRegistrationDraft(null)).toBe(false);
    expect(
      hasRequiredRegistrationDraft({
        ...draft,
        paymentInfo: undefined as unknown as ClientRegistrationDraft['paymentInfo'],
      }),
    ).toBe(false);
  });

  it('저장된 draft를 읽고 intake 단계 저장/삭제를 수행한다', () => {
    mockStorage();
    const draft = createDraft();
    window.sessionStorage.setItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY, JSON.stringify(draft));

    const storedDraft = getStoredClientRegistrationDraft();
    expect(storedDraft?.basicInfo.name).toBe('홍길동');

    saveIntakeStepDraft(draft, draft.assessmentResults, draft.intakeInterview);
    const nextDraftRaw = window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY);
    expect(nextDraftRaw).toBeTruthy();
    const nextDraft = JSON.parse(String(nextDraftRaw)) as ClientRegistrationDraft;
    expect(nextDraft.step).toBe('registration-complete');

    clearRegistrationDraft();
    expect(window.sessionStorage.getItem(CLIENT_REGISTRATION_DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('draft에서 assessment/intake 값을 안전하게 복원한다', () => {
    const draft = createDraft();
    expect(getAssessmentResultsFromDraft(draft).phq9Score).toBe(10);
    expect(getIntakeInterviewFromDraft(draft).reasonForVisit).toBe('스트레스');
  });
});
