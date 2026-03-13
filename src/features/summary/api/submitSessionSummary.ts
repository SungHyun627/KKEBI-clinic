import { ApiError, httpClient } from '@/shared/api/http-client';
import type {
  FollowUpSessionTiming,
  RiskEvaluation,
  SubmitSessionSummaryPayload,
  SubmitSessionSummaryResponse,
} from '@/features/summary/types/summary';

interface SubmitSessionSummaryRequestDto {
  sessionId: number;
  endedAt: string;
  summaryText: string;
  riskEvaluation: string;
  followUpSessionTiming: string;
  additionalMemo?: string;
  selectedMissionIds: number[];
  nextSession?: {
    date?: string;
    time?: string;
  };
}

interface ApiResponseVoid {
  code?: string;
  message?: string;
  data?: Record<string, never> | null;
}

const mapRiskEvaluation = (value: RiskEvaluation) => {
  const map: Record<RiskEvaluation, string> = {
    stable: '안정',
    caution: '주의',
    risk: '위험',
    urgent: '긴급',
  };
  return map[value];
};

const mapFollowUpSessionTiming = (value: FollowUpSessionTiming) => {
  const map: Record<FollowUpSessionTiming, string> = {
    '1w': '1주 뒤',
    '2w': '2주 뒤',
    '1m': '1달 뒤',
    'as-needed': '필요 시',
  };
  return map[value];
};

const mapMissionId = (value: string) => {
  const missionMap: Record<string, number> = {
    breathing: 1,
    sleep: 2,
    walk: 3,
    thought: 4,
    gratitude: 5,
    stretch: 6,
  };
  const mapped = missionMap[value];
  if (typeof mapped === 'number') return mapped;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toSubmitRequestDto = (
  sessionId: number,
  payload: SubmitSessionSummaryPayload,
): SubmitSessionSummaryRequestDto => {
  const missionIds = payload.selectedMissionIds
    .map(mapMissionId)
    .filter((id): id is number => typeof id === 'number');

  return {
    sessionId,
    endedAt: payload.endedAt,
    summaryText: payload.summaryText,
    riskEvaluation: mapRiskEvaluation(payload.riskEvaluation),
    followUpSessionTiming: mapFollowUpSessionTiming(payload.followUpSessionTiming),
    additionalMemo: payload.additionalMemo.trim() || undefined,
    selectedMissionIds: missionIds,
    nextSession: payload.nextSession
      ? {
          date: payload.nextSession.date,
          time: payload.nextSession.startTime,
        }
      : undefined,
  };
};

export const submitSessionSummary = async (
  sessionId: number,
  payload: SubmitSessionSummaryPayload,
): Promise<SubmitSessionSummaryResponse> => {
  try {
    const requestBody = toSubmitRequestDto(sessionId, payload);
    const response = await httpClient.post<ApiResponseVoid>(
      `/api/v1/sessions/${encodeURIComponent(String(sessionId))}/summary/submit`,
      requestBody,
    );

    return {
      success: response.code === 'SUCCESS',
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || 'Failed to submit session summary.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};
