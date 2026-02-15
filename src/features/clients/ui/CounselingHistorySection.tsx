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
  const tHistory = useTranslations('clients.history');
  const tConcerns = useTranslations('clients.concerns');
  const locale = useLocale();
  const [filterValue, setFilterValue] = useState<FilterValue>('전체');
  const [isFilterInteracted, setIsFilterInteracted] = useState(false);

  const filterOptions = [
    { label: tCommon('all'), value: '전체' as const },
    ...COUNSELING_FILTERS.map((concern) => ({
      label:
        concern === '직장'
          ? tConcerns('work')
          : concern === '건강'
            ? tConcerns('health')
            : concern === '돈'
              ? tConcerns('money')
              : concern === '가족'
                ? tConcerns('family')
                : concern === '연애•결혼'
                  ? tConcerns('datingMarriage')
                  : concern === '우정'
                    ? tConcerns('friendship')
                    : concern === '진로•취업'
                      ? tConcerns('careerJob')
                      : concern === '반려동물'
                        ? tConcerns('pet')
                        : concern === '학업'
                          ? tConcerns('study')
                          : tConcerns('other'),
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
        <span className="body-18 font-semibold text-neutral-20">{tHistory('title')}</span>
        <Select
          className="w-[138px]"
          triggerClassName="bg-white"
          value={filterValue}
          triggerLabel={!isFilterInteracted ? tHistory('presentingConcernCompact') : undefined}
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
        <p className="body-14 mt-2 text-label-alternative">{tHistory('emptyFiltered')}</p>
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
  const tHistory = useTranslations('clients.history');
  const tConcerns = useTranslations('clients.concerns');

  const concernLabel =
    history.chiefConcern === '직장'
      ? tConcerns('work')
      : history.chiefConcern === '건강'
        ? tConcerns('health')
        : history.chiefConcern === '돈'
          ? tConcerns('money')
          : history.chiefConcern === '가족'
            ? tConcerns('family')
            : history.chiefConcern === '연애•결혼'
              ? tConcerns('datingMarriage')
              : history.chiefConcern === '우정'
                ? tConcerns('friendship')
                : history.chiefConcern === '진로•취업'
                  ? tConcerns('careerJob')
                  : history.chiefConcern === '반려동물'
                    ? tConcerns('pet')
                    : history.chiefConcern === '학업'
                      ? tConcerns('study')
                      : tConcerns('other');

  const paymentStatusLabel =
    history.paymentStatus === '미납'
      ? tHistory('paymentStatus.unpaid')
      : tHistory('paymentStatus.paid');

  const taskStatusLabel =
    history.taskStatus === '미완수'
      ? tHistory('taskStatus.notCompleted')
      : history.taskStatus === '진행중'
        ? tHistory('taskStatus.inProgress')
        : tHistory('taskStatus.completed');

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
              label={tHistory('presentingConcern')}
              value={
                <span className="flex items-center justify-center gap-[3px] font-semibold rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 leading-none text-label-normal">
                  {concernLabel}
                </span>
              }
            />
            <CounselingField
              label={tHistory('paymentStatusLabel')}
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
              label={tHistory('assignment')}
              value={<span className="body-16 text-label-neutral">{history.taskName}</span>}
            />
            <CounselingField
              label={tHistory('assignmentStatus')}
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
}

function CounselingField({ label, value }: CounselingFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="body-16 w-[78px] text-label-alternative">{label}</span>
      {value}
    </div>
  );
}
