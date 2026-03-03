import type { components } from '@/shared/api/generated-types';
import type { ClientLookupItem } from '@/features/clients/types/common';
import type { RiskType } from '@/features/dashboard';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';

type ClientSummaryResponse = components['schemas']['ClientSummaryResponse'];

export const mapClientSummariesToClients = (
  summaries: ClientSummaryResponse[],
  locale: string,
  fallbackConcerns: string[],
): ClientLookupItem[] =>
  summaries.map((summary) => {
    const clientId = String(summary.id ?? '');
    const chiefConcern = summary.chiefComplaint
      ? summary.chiefComplaint
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      : fallbackConcerns;

    return {
      time: summary.lastCheckInLabel?.trim() ? summary.lastCheckInLabel : '10:00',
      clientId,
      clientName: getClientNameByLocale(clientId, summary.name ?? '-', locale),
      streakDays: Number(summary.streak ?? 0),
      riskType: mapRiskLevel(summary.riskLevel),
      moodScore: Number(summary.recentMoodScore ?? 0),
      stressScore: Number(summary.recentStressScore ?? 0),
      energyScore: Number(summary.recentEnergyScore ?? 0),
      chiefConcern,
    };
  });

const mapRiskLevel = (riskLevel?: ClientSummaryResponse['riskLevel']): RiskType => {
  if (riskLevel === 'RISK') return '위험';
  if (riskLevel === 'CAUTION') return '주의';
  return '안정';
};
