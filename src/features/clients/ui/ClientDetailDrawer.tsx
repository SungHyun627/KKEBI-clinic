'use client';

import { useEffect, useState } from 'react';
import { getClientDetail } from '@/features/clients';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import Image from 'next/image';
import StreakChip from '@/shared/ui/chips/streak-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import { Button } from '@/shared/ui/button';
import { useRouter } from 'next/navigation';
import ClientInfoField from './ClientInfoField';
import NextCounselingDatePicker from './NextCounselingDatePicker';
import RiskReasonChip from './RiskReasonChip';
import CheckinHistorySection from './CheckinHistorySection';
import CounselingHistorySection from './CounselingHistorySection';
import AssessmentResultsSection from './AssessmentResultsSection';
import type { ClientDetailData, ClientLookupItem } from '../types/client';
import Divider from '@/shared/ui/divider';
import { toKoreanDate } from '../lib/format';

interface ClientDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientLookupItem | null;
}

export default function ClientDetailDrawer({
  open,
  onOpenChange,
  client,
}: ClientDetailDrawerProps) {
  const router = useRouter();
  const [detail, setDetail] = useState<ClientDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const clientId = client?.clientId;
    if (!open || !clientId) return;

    const loadClientDetail = async () => {
      setIsLoading(true);
      const result = await getClientDetail(clientId);

      if (!result.success || !result.data) {
        setDetail(null);
        setErrorMessage(result.message || '내담자 상세 정보를 불러오지 못했습니다.');
        setIsLoading(false);
        return;
      }

      setDetail(result.data);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadClientDetail();
  }, [open, client?.clientId]);

  const displayClient = detail ?? client;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="flex max-w-[695px] flex-col gap-[26px] overflow-y-auto px-8 py-[23px] bg-neutral-99"
      >
        <DrawerHeader className="sr-only p-0">
          <DrawerTitle>내담자 상세 정보</DrawerTitle>
        </DrawerHeader>
        <DrawerClose asChild>
          <button
            type="button"
            aria-label="접기"
            className="flex h-6 w-6 items-center justify-center hover:cursor-pointer"
          >
            <Image src="/icons/fold.svg" alt="접기" width={20} height={20} />
          </button>
        </DrawerClose>
        <div className="flex w-full flex-col gap-[42px]">
          {isLoading ? (
            <div className="body-14 text-label-alternative">상세 정보를 불러오는 중입니다.</div>
          ) : errorMessage ? (
            <div className="body-14 text-status-negative">{errorMessage}</div>
          ) : displayClient ? (
            <>
              <DrawerHeader className="flex w-full items-center justify-between p-0">
                <div className="flex min-w-0 items-center gap-3">
                  <DrawerTitle className="text-[24px] font-semibold leading-[30px] text-label-strong">
                    {displayClient.clientName}
                  </DrawerTitle>
                  <StreakChip days={displayClient.streakDays} />
                  <RiskTypeChip value={displayClient.riskType} />
                </div>
                <div className="flex w-full max-w-[235px] items-center gap-3">
                  <Button
                    type="button"
                    variant="icon"
                    size="icon"
                    aria-label={`${displayClient.clientName} 알림 전송`}
                    className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
                  >
                    <Image
                      src="/icons/sent.svg"
                      alt="send-notification"
                      width={24}
                      height={24}
                      aria-hidden
                    />
                  </Button>
                  <Button
                    type="button"
                    size="md"
                    className="w-full"
                    onClick={() => router.push(`/sessions/${displayClient.clientId}`)}
                  >
                    시작하기
                  </Button>
                </div>
              </DrawerHeader>

              <section className="flex items-stretch justify-between">
                {detail ? (
                  <>
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
                        <ClientInfoField
                          label="나이 및 성별"
                          value={`${detail.age}세 ${detail.gender}`}
                        />
                        <ClientInfoField
                          label="시작일"
                          value={toKoreanDate(detail.counselingStartDate)}
                        />
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
                                index !== detail.recentRisks.length - 1
                                  ? 'border-b border-neutral-95'
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              <span className="body-14 text-label-neutral">
                                {toKoreanDate(risk.date)}
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
                          <span className="body-14 text-label-alternative">
                            1달 간 감지된 위험 요소가 없습니다.
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </section>

              <Divider />
              <CheckinHistorySection checkins={detail?.recentCheckins ?? []} />
              <CounselingHistorySection records={detail?.counselingHistory ?? []} />
              <AssessmentResultsSection detail={detail} />
            </>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
