'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { closeClient } from '@/features/clients';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/toast';
import ClientInfoField from './ClientInfoField';
import SessionCloseDialog from './SessionCloseDialog';
import NextCounselingDatePicker from './NextCounselingDatePicker';
import RiskReasonChip from './RiskReasonChip';
import type { ClientDetailData } from '@/features/clients/client-detail/types/client-detail';
import { formatDateByLocale } from '@/features/clients/client-detail/lib/format';

interface ClientOverviewSectionProps {
  detail: ClientDetailData;
  isEditing: boolean;
  onEditToggle: () => void;
  onClientClosed: (clientId: string) => void;
  onSave: (next: ClientDetailData) => void;
}

const CARD_CLASSNAME =
  'flex w-full max-w-[300px] flex-col items-start gap-[23px] rounded-2xl bg-white p-4';
const SECTION_TITLE_CLASSNAME = 'body-18 font-semibold';

export default function ClientOverviewSection({
  detail,
  isEditing,
  onEditToggle,
  onClientClosed,
  onSave,
}: ClientOverviewSectionProps) {
  const tCommon = useTranslations('common');
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const isKo = locale === 'ko';
  const [draft, setDraft] = useState<ClientDetailData>(detail);
  const [isSessionCloseDialogOpen, setIsSessionCloseDialogOpen] = useState(false);
  const [ageGenderInput, setAgeGenderInput] = useState(`${detail.age} / ${detail.gender}`);
  const [sessionCountInput, setSessionCountInput] = useState(
    `${detail.currentSession}회/${detail.totalSession}회`,
  );

  useEffect(() => {
    setDraft(detail);
    setAgeGenderInput(`${detail.age} / ${detail.gender}`);
    setSessionCountInput(`${detail.currentSession}회/${detail.totalSession}회`);
  }, [detail]);
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
              onClick={() => {
                if (!isEditing) {
                  onEditToggle();
                  return;
                }

                setDraft(detail);
                onEditToggle();
              }}
            >
              {isEditing ? tCommon('cancel') : tCommon('edit')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-primary bg-[rgba(250,84,84,0.10)] rounded-lg"
              onClick={() => {
                if (isEditing) {
                  const parsedAgeGender = parseAgeGenderInput(ageGenderInput, draft.gender);
                  const nextDraft: ClientDetailData = {
                    ...draft,
                    age: parsedAgeGender.age,
                    gender: parsedAgeGender.gender,
                  };
                  setDraft(nextDraft);
                  onSave(nextDraft);
                  return;
                }
                setIsSessionCloseDialogOpen(true);
              }}
            >
              {isEditing ? '저장하기' : tCommon('closeCase')}
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full items-start gap-[18px]">
          {isEditing ? (
            <>
              <div className="flex w-full flex-col gap-2">
                <span className="body-14 text-neutral-60">{tClients('detailAgeGender')}</span>
                <Input
                  type="text"
                  value={ageGenderInput}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setAgeGenderInput(nextValue);

                    const parsed = parseAgeGenderInput(nextValue, draft.gender);
                    setDraft((prev) => ({
                      ...prev,
                      age: parsed.age,
                      gender: parsed.gender,
                    }));
                  }}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <NextCounselingDatePicker
                  label={tClients('detailStartDate')}
                  value={draft.counselingStartDate}
                  onValueChange={(nextDate) =>
                    setDraft((prev) => ({ ...prev, counselingStartDate: nextDate }))
                  }
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <span className="body-14 text-neutral-60">{tClients('detailSessions')}</span>
                <Input
                  type="text"
                  value={sessionCountInput}
                  onChange={(event) => {
                    const next = event.target.value;
                    setSessionCountInput(next);
                    const { currentSession, totalSession } = parseSessionCountInput(
                      next,
                      draft.currentSession,
                      draft.totalSession,
                    );
                    setDraft((prev) => ({
                      ...prev,
                      currentSession,
                      totalSession,
                    }));
                  }}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <span className="body-14 text-neutral-60">{tClients('detailVisitReason')}</span>
                <Input
                  type="text"
                  value={draft.visitPurpose}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, visitPurpose: event.target.value }))
                  }
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <NextCounselingDatePicker
                  label={tClients('detailNextSession')}
                  value={draft.nextCounselingAt}
                  onValueChange={(nextDate) =>
                    setDraft((prev) => ({ ...prev, nextCounselingAt: nextDate }))
                  }
                />
              </div>
            </>
          ) : (
            <>
              <ClientInfoField
                label={tClients('detailAgeGender')}
                value={
                  isKo
                    ? `${detail.age}세 ${detail.gender}`
                    : `${toEnglishGenderLabel(detail.gender)}, ${detail.age}`
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
              <ClientInfoField
                label={tClients('detailVisitReason')}
                value={localizedVisitPurpose}
              />
              <NextCounselingDatePicker initialValue={detail.nextCounselingAt} />
            </>
          )}
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

      <SessionCloseDialog
        open={isSessionCloseDialogOpen}
        onOpenChange={setIsSessionCloseDialogOpen}
        clientName={detail.clientName}
        onConfirm={async ({ reason, detail: closeDetail }) => {
          const result = await closeClient(detail.clientId, { reason, detail: closeDetail });
          if (result.success) {
            toast('성공적으로 종결이 처리되었습니다');
            onClientClosed(detail.clientId);
          }
        }}
      />
    </section>
  );
}

function parseAgeGenderInput(
  input: string,
  fallbackGender: ClientDetailData['gender'],
): { age: number; gender: ClientDetailData['gender'] } {
  const trimmed = input.trim();
  const ageMatch = trimmed.match(/\d+/);
  const parsedAge = ageMatch ? Number(ageMatch[0]) : 0;
  const lower = trimmed.toLowerCase();

  let gender: ClientDetailData['gender'] = fallbackGender;
  if (lower.includes('여') || lower.includes('female')) gender = '여성';
  if (lower.includes('남') || lower.includes('male')) gender = '남성';
  if (lower.includes('논') || lower.includes('non-binary') || lower.includes('nonbinary'))
    gender = '논바이너리';

  return {
    age: Number.isNaN(parsedAge) ? 0 : parsedAge,
    gender,
  };
}

function toEnglishGenderLabel(gender: ClientDetailData['gender']) {
  if (gender === '남성') return 'Male';
  if (gender === '여성') return 'Female';
  return 'Non-binary';
}

function parseSessionCountInput(
  input: string,
  fallbackCurrent: number,
  fallbackTotal: number,
): { currentSession: number; totalSession: number } {
  const normalized = input.replace(/\s/g, '');
  const [currentRaw = '', totalRaw = ''] = normalized.split('/');
  const parsedCurrent = Number(currentRaw.replace(/[^\d]/g, ''));
  const parsedTotal = Number(totalRaw.replace(/[^\d]/g, ''));

  return {
    currentSession: Number.isNaN(parsedCurrent) ? fallbackCurrent : parsedCurrent,
    totalSession: Number.isNaN(parsedTotal) ? fallbackTotal : parsedTotal,
  };
}
