import type { components } from '@/shared/api/generated-types';
import type {
  ClientCheckinRecord,
  ClientCounselingRecord,
  ClientDetailData,
  ClientIntakeAnswers,
  ClientRiskRecord,
} from '@/features/clients/client-detail/types/client-detail';

type ApiClientDetail = components['schemas']['ClientDetailResponse'];
type ApiClientTestResult = components['schemas']['ClientTestResultResponse'];
type ApiIntake = components['schemas']['ClientIntakeResponse'];

const EMPTY_RECENT_RISKS: ClientRiskRecord[] = [];
const EMPTY_RECENT_CHECKINS: ClientCheckinRecord[] = [];
const EMPTY_COUNSELING_HISTORY: ClientCounselingRecord[] = [];

const toSafeNumber = (value: number | null | undefined, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const toGender = (gender?: ApiClientDetail['gender']): ClientDetailData['gender'] => {
  if (gender === 'MALE') return '남성';
  if (gender === 'FEMALE') return '여성';
  return '논바이너리';
};

const toFullAge = (birthDate?: string): number => {
  if (!birthDate) return 0;

  const parsed = new Date(birthDate);
  if (Number.isNaN(parsed.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < parsed.getMonth() ||
    (today.getMonth() === parsed.getMonth() && today.getDate() < parsed.getDate());

  if (hasNotHadBirthdayThisYear) age -= 1;
  return Math.max(age, 0);
};

const toRiskType = (phq9Score: number): ClientDetailData['riskType'] => {
  if (phq9Score >= 20) return '위험';
  if (phq9Score >= 5) return '주의';
  return '안정';
};

const parseChiefConcern = (chiefComplaint?: string): string[] => {
  if (!chiefComplaint?.trim()) return ['기타'];
  return chiefComplaint
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
};

const buildEtcScaleText = (testResults?: ApiClientTestResult[]) => {
  if (!testResults?.length) return '';

  const additional = testResults
    .filter((result) => {
      const name = result.testName?.toLowerCase() ?? '';
      return name !== 'phq-9' && name !== 'pss-10' && name !== 'mbi';
    })
    .map((result) => `${result.testName ?? '기타 검사'}: ${toSafeNumber(result.score)}점`);

  return additional.join(', ');
};

const mapIntakeAnswers = (intake?: ApiIntake): ClientIntakeAnswers => ({
  reasonForVisit: intake?.visitReason ?? '',
  expectedChange: intake?.desiredChange ?? '',
  similarPastExperience: intake?.similarDifficultyHistory ?? '',
  triedMethod: intake?.attemptedSolution ?? '',
  methodEffectiveness: intake?.solutionEffectiveness ?? '',
  biggestConcern: intake?.currentWorry ?? '',
  sleepPattern: intake?.sleepPattern ?? '',
  sleepQuality: intake?.sleepQuality ?? '',
  exerciseHabit: intake?.exerciseFrequency ?? '',
  mealsPerDay: intake?.mealsPerDay ?? '',
  mostReliablePerson: intake?.reliablePerson ?? '',
  reliabilityReason: intake?.reliableReason ?? '',
  familyBond: intake?.familyBond ?? '',
  familyBondReason: intake?.familyBondReason ?? '',
  selfDescription: intake?.selfDescription ?? '',
});

export const mapApiClientDetailToUi = (detail?: ApiClientDetail): ClientDetailData | null => {
  if (!detail?.id || !detail.name) return null;

  const chiefConcern = parseChiefConcern(detail.chiefComplaint);
  const phq9 = toSafeNumber(detail.intake?.phq9Score);
  const pss10 = toSafeNumber(detail.intake?.pss10Score);
  const mbi = toSafeNumber(detail.intake?.mbiScore);
  const moodScore = Math.max(1, Math.min(5, Math.round(5 - pss10 / 8) || 3));
  const stressScore = Math.max(1, Math.min(5, Math.round(pss10 / 8) || 3));
  const energyScore = Math.max(1, Math.min(5, Math.round((moodScore + (6 - stressScore)) / 2)));
  const riskType = toRiskType(phq9);

  return {
    time: detail.createdAt ?? '-',
    clientId: String(detail.id),
    clientName: detail.name,
    streakDays: 0,
    riskType,
    moodScore,
    stressScore,
    energyScore,
    chiefConcern,
    age: toFullAge(detail.birthDate),
    gender: toGender(detail.gender),
    counselingStartDate: detail.counselingStartDate ?? '',
    currentSession: 1,
    totalSession: 1,
    visitPurpose: detail.chiefComplaint ?? '',
    nextCounselingAt: detail.counselingStartDate ?? '',
    recentRisks: EMPTY_RECENT_RISKS,
    recentCheckins: EMPTY_RECENT_CHECKINS,
    counselingHistory: EMPTY_COUNSELING_HISTORY,
    scaleResults: {
      phq9,
      pss10,
      mbi,
      etc: buildEtcScaleText(detail.testResults),
    },
    intakeAnswers: mapIntakeAnswers(detail.intake),
  };
};
