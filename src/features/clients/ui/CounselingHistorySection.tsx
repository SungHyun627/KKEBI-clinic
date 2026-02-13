'use client';

import { useMemo, useState } from 'react';
import { Select } from '@/shared/ui/select';
import type {
  ClientCounselingRecord,
  CounselingChiefConcern,
  PaymentStatus,
  TaskStatus,
} from '../types/client';

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

export default function CounselingHistorySection({ records }: CounselingHistorySectionProps) {
  const [filterValue, setFilterValue] = useState<FilterValue>('전체');
  const [isFilterInteracted, setIsFilterInteracted] = useState(false);

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
        <span className="body-18 font-semibold text-neutral-20">상담 내역</span>
        <Select
          className="w-[138px]"
          triggerClassName="bg-white"
          value={filterValue}
          triggerLabel={!isFilterInteracted ? '주호소 문제' : undefined}
          onValueChange={(value) => {
            setFilterValue(value as FilterValue);
            setIsFilterInteracted(true);
          }}
          options={[
            { label: '전체', value: '전체' },
            ...COUNSELING_FILTERS.map((concern) => ({
              label: `${concern}`,
              value: concern,
            })),
          ]}
        />
      </div>

      {filteredRecords.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {filteredRecords.map((history) => (
            <li
              key={`${history.dateTime}-${history.taskName}`}
              className="grid grid-cols-[1.6fr_1fr_1.8fr_auto_auto] items-center gap-2 rounded-lg border border-neutral-95 px-3 py-2"
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
        <p className="body-14 mt-2 text-label-alternative">조건에 맞는 상담 내역이 없습니다.</p>
      )}
    </section>
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
    납부: 'border-neutral-90 bg-neutral-95 text-label-neutral',
    미납: 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-[#E52222]',
  };

  return (
    <span className={`body-12 rounded-[100px] border px-2 py-1 ${styleByStatus[status]}`}>
      {status}
    </span>
  );
}
