interface SubmitSessionSummaryPayload {
  summaryText: string;
  riskEvaluation: 'stable' | 'caution' | 'risk' | 'urgent';
  followUpSessionTiming: '1w' | '2w' | '1m' | 'as-needed';
  selectedMissionIds: string[];
  nextSession: {
    date: string;
    startTime: string;
    endTime: string;
  } | null;
}

interface SubmitSessionSummaryResponse {
  success: boolean;
  message?: string;
}

export const submitSessionSummary = async (
  sessionId: string,
  payload: SubmitSessionSummaryPayload,
): Promise<SubmitSessionSummaryResponse> => {
  try {
    const response = await fetch(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/summary/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      },
    );

    const data = (await response.json().catch(() => null)) as SubmitSessionSummaryResponse | null;
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    return {
      success: false,
      message: 'Failed to submit session summary.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};
