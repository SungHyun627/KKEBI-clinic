'use client';

import { Button } from '@/shared/ui/button';
import ClientInfoField from './ClientInfoField';
import NextCounselingDatePicker from './NextCounselingDatePicker';
import RiskReasonChip from './RiskReasonChip';
import type { ClientDetailData } from '../types/client';
import { toKoreanDate } from '../lib/format';

interface ClientOverviewSectionProps {
  detail: ClientDetailData;
}

export default function ClientOverviewSection({ detail }: ClientOverviewSectionProps) {
  return (
    <section className="flex items-stretch justify-between">
      <div className="flex w-full max-w-[300px] flex-col items-start gap-[23px] rounded-2xl bg-white p-4">
        <div className="flex w-full items-center justify-between">
          <span className="body-18 font-semibold text-neutral-20">내담자 정보</span>
          <div className="flex items-center gap-[6px]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-label-neutral rounded-lg"
            >
              수정하기
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-primary bg-[rgba(250,84,84,0.10)] rounded-lg"
            >
              종결하기
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full items-start gap-[18px]">
          <ClientInfoField label="나이 및 성별" value={`${detail.age}세 ${detail.gender}`} />
          <ClientInfoField label="시작일" value={toKoreanDate(detail.counselingStartDate)} />
          <ClientInfoField
            label="상담 횟수"
            value={`${detail.currentSession}회/${detail.totalSession}회`}
          />
          <ClientInfoField label="방문 목적" value={detail.visitPurpose} />
          <NextCounselingDatePicker initialValue={detail.nextCounselingAt} />
        </div>
      </div>

      <div className="flex w-full max-w-[300px] flex-col items-start gap-[23px] rounded-2xl bg-white p-4">
        <span className="body-18 font-semibold text-primary">최근 위험</span>
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
                <span className="body-14 text-label-neutral">{toKoreanDate(risk.date)}</span>
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
            <span className="body-14 text-label-alternative">
              1달 간 감지된 위험 요소가 없습니다.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
