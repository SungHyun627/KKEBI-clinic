'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Select } from '@/shared/ui/select';
import type { ClientCounselingRecord, CounselingChiefConcern } from '../types/client';
import Divider from '@/shared/ui/divider';
import { Button } from '@/shared/ui/button';

interface CounselingHistorySectionProps {
  records: ClientCounselingRecord[];
}

const COUNSELING_FILTERS: CounselingChiefConcern[] = [
  '직장',
  '건강',
  '돈',
  '가족',
  '연애•결혼',
  '우정',
  '진로•취업',
  '반려동물',
  '학업',
  '기타',
];

type FilterValue = '전체' | CounselingChiefConcern;

const formatCounselingDateTime = (raw: string, locale: string) => {
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    if (locale === 'ko') {
      const year = parsed.getFullYear();
      const month = parsed.getMonth() + 1;
      const day = parsed.getDate();
      const hours = String(parsed.getHours()).padStart(2, '0');
      const minutes = String(parsed.getMinutes()).padStart(2, '0');
      return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(parsed);
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');
    return `${formattedDate} ${hours}:${minutes}`;
  }

  const normalized = raw.replace('T', ' ');
  const matched = normalized.match(
    /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?$/,
  );
  if (!matched) return raw;

  const [, year, month, day, hour = '00', minute = '00'] = matched;
  if (locale === 'en') {
    const fallbackDate = new Date(
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}`,
    );
    if (!Number.isNaN(fallbackDate.getTime())) {
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(fallbackDate);
      return `${formattedDate} ${hour.padStart(2, '0')}:${minute}`;
    }
  }
  return `${year}년 ${Number(month)}월 ${Number(day)}일 ${hour.padStart(2, '0')}:${minute}`;
};

const getPaymentStatusClassName = (status: ClientCounselingRecord['paymentStatus']) =>
  status === '미납' ? 'text-[#FF6363]' : 'text-label-neutral';

const getTaskStatusClassName = (status: ClientCounselingRecord['taskStatus']) => {
  if (status === '미완수') return 'text-[#FF6363]';
  if (status === '진행중') return 'text-[#FF9200]';
  return 'text-[#009632]';
};

export default function CounselingHistorySection({ records }: CounselingHistorySectionProps) {
  const tCommon = useTranslations('common');
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const [filterValue, setFilterValue] = useState<FilterValue>('전체');
  const [isFilterInteracted, setIsFilterInteracted] = useState(false);

  const filterOptions = [
    { label: tCommon('all'), value: '전체' as const },
    ...COUNSELING_FILTERS.map((concern) => ({
      label:
        concern === '직장'
          ? tClients('concernsWork')
          : concern === '건강'
            ? tClients('concernsHealth')
            : concern === '돈'
              ? tClients('concernsMoney')
              : concern === '가족'
                ? tClients('concernsFamily')
                : concern === '연애•결혼'
                  ? tClients('concernsDatingMarriage')
                  : concern === '우정'
                    ? tClients('concernsFriendship')
                    : concern === '진로•취업'
                      ? tClients('concernsCareerJob')
                      : concern === '반려동물'
                        ? tClients('concernsPet')
                        : concern === '학업'
                          ? tClients('concernsStudy')
                          : tClients('concernsOther'),
      value: concern,
    })),
  ];

  const filteredRecords = useMemo(
    () =>
      filterValue === '전체'
        ? records
        : records.filter((record) => record.chiefConcern === filterValue),
    [records, filterValue],
  );

  return (
    <section className="flex w-full flex-col gap-5">
      <div className="flex w-full items-center justify-between">
        <span className="body-18 font-semibold text-neutral-20">{tClients('historyTitle')}</span>
        <Select
          className={locale === 'en' ? 'w-[200px]' : 'w-[138px]'}
          triggerClassName="bg-white"
          value={filterValue}
          triggerLabel={
            !isFilterInteracted ? tClients('historyPresentingConcernCompact') : undefined
          }
          onValueChange={(value) => {
            setFilterValue(value as FilterValue);
            setIsFilterInteracted(true);
          }}
          options={filterOptions}
        />
      </div>

      {filteredRecords.length > 0 ? (
        <ul className="flex flex-col w-full gap-4">
          {filteredRecords.map((history) => (
            <CounselingHistoryCard
              key={`${history.dateTime}-${history.taskName}`}
              history={history}
              locale={locale}
            />
          ))}
        </ul>
      ) : (
        <p className="body-14 mt-2 text-label-alternative">{tClients('historyEmptyFiltered')}</p>
      )}
    </section>
  );
}

interface CounselingHistoryCardProps {
  history: ClientCounselingRecord;
  locale: string;
}

function CounselingHistoryCard({ history, locale }: CounselingHistoryCardProps) {
  const tCommon = useTranslations('common');
  const tClients = useTranslations('clients');
  const labelWidthClassName = locale === 'en' ? 'w-[120px]' : 'w-[78px]';

  const concernLabel =
    history.chiefConcern === '직장'
      ? tClients('concernsWork')
      : history.chiefConcern === '건강'
        ? tClients('concernsHealth')
        : history.chiefConcern === '돈'
          ? tClients('concernsMoney')
          : history.chiefConcern === '가족'
            ? tClients('concernsFamily')
            : history.chiefConcern === '연애•결혼'
              ? tClients('concernsDatingMarriage')
              : history.chiefConcern === '우정'
                ? tClients('concernsFriendship')
                : history.chiefConcern === '진로•취업'
                  ? tClients('concernsCareerJob')
                  : history.chiefConcern === '반려동물'
                    ? tClients('concernsPet')
                    : history.chiefConcern === '학업'
                      ? tClients('concernsStudy')
                      : tClients('concernsOther');

  const paymentStatusLabel =
    history.paymentStatus === '미납'
      ? tClients('historyPaymentStatusUnpaid')
      : tClients('historyPaymentStatusPaid');

  const taskStatusLabel =
    history.taskStatus === '미완수'
      ? tClients('historyTaskStatusNotCompleted')
      : history.taskStatus === '진행중'
        ? tClients('historyTaskStatusInProgress')
        : tClients('historyTaskStatusCompleted');
  const taskNameLabel =
    history.taskName === '감정 기록 3회 작성'
      ? tClients('historyTaskEmotionLog3')
      : history.taskName === '수면 루틴 체크'
        ? tClients('historyTaskSleepRoutineCheck')
        : history.taskName === '주간 운동 계획 실천'
          ? tClients('historyTaskWeeklyExercisePlan')
          : history.taskName === '스트레스 기록지 작성'
            ? tClients('historyTaskStressLog')
            : history.taskName;

  return (
    <li className="flex w-full">
      <div className="flex flex-col w-full justify-center items-start gap-[18px] p-[26px] rounded-3xl bg-white">
        <div className="flex w-full justify-between items-center">
          <span className="body-18 font-semibold text-label-strong">
            {formatCounselingDateTime(history.dateTime, locale)}
          </span>
          <Button size="sm">{tCommon('viewReport')}</Button>
        </div>
        <Divider />
        <div className="grid w-full grid-cols-2 items-start gap-x-10">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <CounselingField
              labelWidthClassName={labelWidthClassName}
              label={tClients('historyPresentingConcern')}
              value={
                <span className="flex items-center justify-center gap-[3px] font-semibold rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 leading-none text-label-normal">
                  {concernLabel}
                </span>
              }
            />
            <CounselingField
              labelWidthClassName={labelWidthClassName}
              label={tClients('historyPaymentStatusLabel')}
              value={
                <span
                  className={`body-16 font-medium ${getPaymentStatusClassName(history.paymentStatus)}`}
                >
                  {paymentStatusLabel}
                </span>
              }
            />
          </div>
          <div className="flex min-w-0 flex-col items-start gap-2">
            <CounselingField
              labelWidthClassName={labelWidthClassName}
              label={tClients('historyAssignment')}
              value={<span className="body-16 text-label-neutral">{taskNameLabel}</span>}
            />
            <CounselingField
              labelWidthClassName={labelWidthClassName}
              label={tClients('historyAssignmentStatus')}
              value={
                <span className={`body-16 ${getTaskStatusClassName(history.taskStatus)}`}>
                  {taskStatusLabel}
                </span>
              }
            />
          </div>
        </div>
      </div>
    </li>
  );
}

interface CounselingFieldProps {
  label: string;
  value: ReactNode;
  labelWidthClassName: string;
}

function CounselingField({ label, value, labelWidthClassName }: CounselingFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`body-16 inline-block shrink-0 text-label-alternative ${labelWidthClassName}`}
      >
        {label}
      </span>
      <div className="min-w-0 break-words">{value}</div>
    </div>
  );
}
