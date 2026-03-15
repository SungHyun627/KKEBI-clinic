import { describe, expect, it } from 'vitest';
import {
  buildRegisterClientPayload,
  getGenderDisplayValue,
  getReferralPathDisplayValue,
  mapGenderToApi,
  mapPaymentTypeToApi,
  mapReferralSourceToApi,
} from './review-mapper';

describe('review-mapper', () => {
  it('성별/결제 타입 매핑을 API 포맷으로 변환한다', () => {
    expect(mapGenderToApi('female')).toBe('FEMALE');
    expect(mapGenderToApi('male')).toBe('MALE');
    expect(mapGenderToApi('non-binary')).toBe('NON_BINARY');
    expect(mapGenderToApi('')).toBeUndefined();

    expect(mapPaymentTypeToApi('insurance')).toBe('INSURANCE');
    expect(mapPaymentTypeToApi('private-pay')).toBe('SELF');
    expect(mapPaymentTypeToApi('')).toBeUndefined();
  });

  it('locale에 맞는 referral 값을 변환한다', () => {
    expect(mapReferralSourceToApi('search', 'ko')).toBe('검색');
    expect(mapReferralSourceToApi('search', 'en')).toBe('Search');
    expect(mapReferralSourceToApi('hospital', 'ko')).toBe('병원 의뢰');
    expect(mapReferralSourceToApi('hospital', 'en')).toBe('Hospital referral');
    expect(mapReferralSourceToApi('', 'ko')).toBeUndefined();
  });

  it('표시 문자열 변환을 제공한다', () => {
    expect(
      getGenderDisplayValue('female', { female: '여성', male: '남성', nonBinary: '논바이너리' }),
    ).toBe('여성');
    expect(getReferralPathDisplayValue('referral', 'en')).toBe('Referral');
  });

  it('등록 payload를 trim/필터링 규칙에 맞춰 구성한다', () => {
    const payload = buildRegisterClientPayload('ko', {
      basicInfo: {
        name: '  홍길동  ',
        phone: ' 010-0000-0000 ',
        email: ' test@kkebi.com ',
        birthDate: '1999-01-01',
        gender: 'male',
      },
      counselingInfo: {
        counselingStartDate: '2026-03-15',
        counselingStartTime: '09:00',
        counselingEndTime: '10:00',
        chiefConcern: '  불안 ',
        referralPath: 'search',
      },
      paymentInfo: {
        paymentType: 'insurance',
        insuranceCompany: '  건강보험 ',
      },
      kkebiNickname: {
        kkebiNickname: '  케비 ',
      },
      assessmentResults: {
        phq9Score: 9,
        pss10Score: null,
        mbiScore: 20,
        draftTestName: '',
        additionalResults: [
          { testName: '  GAD-7 ', testResult: 12 },
          { testName: ' ', testResult: 99 },
        ],
      },
      intakeInterview: {
        reasonForVisit: '긴장',
        mostImportantChange: '불안 감소',
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
      },
    });

    expect(payload.name).toBe('홍길동');
    expect(payload.nickname).toBe('케비');
    expect(payload.phoneNumber).toBe('010-0000-0000');
    expect(payload.gender).toBe('MALE');
    expect(payload.paymentType).toBe('INSURANCE');
    expect(payload.insuranceCompany).toBe('건강보험');
    expect(payload.referralSource).toBe('검색');
    expect(payload.initialTestResults).toEqual([{ testName: 'GAD-7', score: 12 }]);
  });
});
