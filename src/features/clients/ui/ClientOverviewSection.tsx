'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import ClientInfoField from './ClientInfoField';
import NextCounselingDatePicker from './NextCounselingDatePicker';
import RiskReasonChip from './RiskReasonChip';
import type { ClientDetailData } from '../types/client';
import { formatDateByLocale } from '../lib/format';

interface ClientOverviewSectionProps {
  detail: ClientDetailData;
}

const CARD_CLASSNAME =
  'flex w-full max-w-[300px] flex-col items-start gap-[23px] rounded-2xl bg-white p-4';
const SECTION_TITLE_CLASSNAME = 'body-18 font-semibold';

export default function ClientOverviewSection({ detail }: ClientOverviewSectionProps) {
  const tCommon = useTranslations('common');
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const isKo = locale === 'ko';
  const localizedVisitPurpose = (() => {
    if (!detail.visitPurpose.endsWith('관련 정서 조절')) return detail.visitPurpose;

    const concernLabel = detail.visitPurpose.startsWith('우울')
      ? tClients('concernsDepression')
      : detail.visitPurpose.startsWith('스트레스')
        ? tClients('concernsStress')
        : detail.visitPurpose.startsWith('수면')
          ? tClients('concernsSleep')
          : detail.visitPurpose.replace(' 관련 정서 조절', '');

    return tClients('visitPurposeEmotionRegulation', { concern: concernLabel });
  })();

  return (
    <section className="flex items-stretch justify-between">
      <div className={CARD_CLASSNAME}>
        <div className="flex w-full items-center justify-between">
          <span className={`${SECTION_TITLE_CLASSNAME} text-neutral-20`}>
            {tClients('detailTitle')}
          </span>
          <div className="flex items-center gap-[6px]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-label-neutral rounded-lg"
            >
              {tCommon('edit')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-primary bg-[rgba(250,84,84,0.10)] rounded-lg"
            >
              {tCommon('closeCase')}
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full items-start gap-[18px]">
          <ClientInfoField
            label={tClients('detailAgeGender')}
            value={
              isKo
                ? `${detail.age}세 ${detail.gender}`
                : `${detail.gender === '남성' ? 'Male' : 'Female'}, ${detail.age}`
            }
          />
          <ClientInfoField
            label={tClients('detailStartDate')}
            value={formatDateByLocale(detail.counselingStartDate, locale)}
          />
          <ClientInfoField
            label={tClients('detailSessions')}
            value={
              isKo
                ? `${detail.currentSession}회/${detail.totalSession}회`
                : `${detail.currentSession}/${detail.totalSession}`
            }
          />
          <ClientInfoField label={tClients('detailVisitReason')} value={localizedVisitPurpose} />
          <NextCounselingDatePicker initialValue={detail.nextCounselingAt} />
        </div>
      </div>

      <div className={CARD_CLASSNAME}>
        <span className={`${SECTION_TITLE_CLASSNAME} text-primary`}>{tClients('riskTitle')}</span>
        <div className="flex w-full flex-col gap-[23px]">
          {detail.recentRisks.length > 0 ? (
            detail.recentRisks.map((risk, index) => (
              <div
                key={`${detail.clientId}-risk-card-${risk.date}`}
                className={[
                  'flex w-full flex-col gap-[14px] pb-[14px]',
                  index !== detail.recentRisks.length - 1 ? 'border-b border-neutral-95' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="body-14 text-label-neutral">
                  {formatDateByLocale(risk.date, locale)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {risk.reasons.map((reason) => (
                    <RiskReasonChip
                      key={`${detail.clientId}-${risk.date}-${reason}`}
                      value={reason}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <span className="body-14 text-label-alternative">{tClients('riskEmptyLastMonth')}</span>
          )}
        </div>
      </div>
    </section>
  );
}
