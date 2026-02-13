'use client';

import { useEffect, useState } from 'react';
import { getClientDetail } from '@/features/clients';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import Image from 'next/image';
import StreakChip from '@/shared/ui/chips/streak-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import { Button } from '@/shared/ui/button';
import MoodScoreChip from '@/shared/ui/chips/mood-score-chip';
import ChiefConcernChip from '@/shared/ui/chips/chief-concern-chip';
import { useRouter } from 'next/navigation';
import ClientInfoField from './ClientInfoField';
import type {
  ClientDetailData,
  ClientLookupItem,
  PaymentStatus,
  TaskStatus,
} from '../types/client';

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

              <section className="flex items-center justify-between">
                {detail ? (
                  <>
                    <div className="flex h-90 w-full max-w-[300px] flex-col items-start gap-[23px] rounded-2xl bg-white p-4">
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
                      <div className="flex flex-col items-start gap-[18px]">
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
                        <ClientInfoField
                          label="다음 상담일"
                          value={toKoreanDateTime(detail.nextCounselingAt)}
                        />
                      </div>
                    </div>
                    <div className="flex w-full max-w-[300px] flex-col items-start gap-[23px] rounded-2xl bg-white p-4"></div>
                  </>
                ) : null}
              </section>

              <section className="rounded-xl border border-neutral-95 bg-white p-4">
                <h3 className="body-16 font-semibold text-label-normal">최근 위험</h3>
                {detail && detail.recentRisks.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2">
                    {detail.recentRisks.map((item) => (
                      <li
                        key={`${detail.clientId}-${item.date}`}
                        className="flex items-center gap-3"
                      >
                        <span className="body-14 min-w-[88px] text-label-alternative">
                          {item.date}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.reasons.map((reason) => (
                            <span
                              key={`${detail.clientId}-${item.date}-${reason}`}
                              className="body-12 rounded-[100px] border border-[rgba(229,34,34,0.35)] bg-[rgba(229,34,34,0.10)] px-2 py-1 text-[#E52222]"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="body-14 mt-2 text-label-alternative">
                    1달 간 감지된 위험 요소가 없습니다.
                  </p>
                )}
              </section>

              <section className="rounded-xl border border-neutral-95 bg-white p-4">
                <h3 className="body-16 font-semibold text-label-normal">체크인 내역</h3>
                {detail && detail.recentCheckins.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2">
                    {detail.recentCheckins.map((checkin) => (
                      <li
                        key={`${detail.clientId}-${checkin.date}-${checkin.time}`}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <span className="body-14 text-label-alternative">
                          {checkin.date} {checkin.time}
                        </span>
                        <MoodScoreChip label="기분" score={checkin.moodScore} />
                        <MoodScoreChip label="스트레스" score={checkin.stressScore} />
                        <MoodScoreChip label="에너지" score={checkin.energyScore} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="body-14 mt-2 text-label-alternative">
                    1달 간 체크인 이력이 없습니다.
                  </p>
                )}
              </section>

              <section className="rounded-xl border border-neutral-95 bg-white p-4">
                <h3 className="body-16 font-semibold text-label-normal">상담 내역</h3>
                {detail && detail.counselingHistory.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2">
                    {detail.counselingHistory.map((history) => (
                      <li
                        key={`${detail.clientId}-${history.dateTime}-${history.taskName}`}
                        className="grid grid-cols-[1.4fr_1fr_1.8fr_auto_auto] items-center gap-2 rounded-lg border border-neutral-95 px-3 py-2"
                      >
                        <span className="body-12 text-label-alternative">{history.dateTime}</span>
                        <span className="body-12 text-label-normal">{history.chiefConcern}</span>
                        <span className="body-12 text-label-normal">{history.taskName}</span>
                        <TaskStatusChip status={history.taskStatus} />
                        <PaymentStatusChip status={history.paymentStatus} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="body-14 mt-2 text-label-alternative">
                    등록된 상담 내역이 없습니다.
                  </p>
                )}
              </section>

              <section className="rounded-xl border border-neutral-95 bg-white p-4">
                <h3 className="body-16 font-semibold text-label-normal">평가 척도 결과</h3>
                {detail ? (
                  <div className="mt-3 flex flex-col gap-2">
                    <p className="body-14 text-label-normal">PHQ-9: {detail.scaleResults.phq9}점</p>
                    <p className="body-14 text-label-normal">
                      PSS-10: {detail.scaleResults.pss10}점
                    </p>
                    <p className="body-14 text-label-normal">MBI: {detail.scaleResults.mbi}점</p>
                    <p className="body-14 text-label-normal">{detail.scaleResults.etc}</p>
                    <div className="mt-2 rounded-lg bg-neutral-99 p-3">
                      <p className="body-14 text-label-normal">
                        1. 상담 방문 이유: {detail.intakeAnswers.reasonForVisit}
                      </p>
                      <p className="body-14 mt-1 text-label-normal">
                        2. 기대 변화: {detail.intakeAnswers.expectedChange}
                      </p>
                      <p className="body-14 mt-1 text-label-normal">
                        3. 현재 가장 고민되는 문제: {detail.intakeAnswers.biggestConcern}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="body-14 mt-2 text-label-alternative">
                    아직 평가 척도 결과가 없습니다.
                  </p>
                )}
              </section>
            </>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function TaskStatusChip({ status }: { status: TaskStatus }) {
  const styleByStatus: Record<TaskStatus, string> = {
    완수: 'border-[rgba(66,158,0,0.50)] bg-[rgba(66,158,0,0.10)] text-[#429E00]',
    진행중: 'border-[rgba(255,146,0,0.50)] bg-[rgba(255,146,0,0.10)] text-[#FF9200]',
    미완수: 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-[#E52222]',
  };

  return (
    <span className={`body-12 rounded-[100px] border px-2 py-1 ${styleByStatus[status]}`}>
      {status}
    </span>
  );
}

function PaymentStatusChip({ status }: { status: PaymentStatus }) {
  const styleByStatus: Record<PaymentStatus, string> = {
    완납: 'border-neutral-90 bg-neutral-95 text-label-neutral',
    미납: 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-[#E52222]',
  };

  return (
    <span className={`body-12 rounded-[100px] border px-2 py-1 ${styleByStatus[status]}`}>
      {status}
    </span>
  );
}

function toKoreanDate(input: string) {
  const parsed = new Date(input.includes(' ') ? input.replace(' ', 'T') : input);
  if (Number.isNaN(parsed.getTime())) return input;
  return `${parsed.getFullYear()}년 ${parsed.getMonth() + 1}월 ${parsed.getDate()}일`;
}

function toKoreanDateTime(input: string) {
  const parsed = new Date(input.includes(' ') ? input.replace(' ', 'T') : input);
  if (Number.isNaN(parsed.getTime())) return input;
  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${parsed.getFullYear()}년 ${parsed.getMonth() + 1}월 ${parsed.getDate()}일 ${hours}:${minutes}`;
}
