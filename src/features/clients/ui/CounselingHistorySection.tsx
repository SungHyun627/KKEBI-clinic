'use client';

import { useMemo, useState } from 'react';
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

const formatCounselingDateTime = (raw: string) => {
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  }

  const normalized = raw.replace('T', ' ');
  const matched = normalized.match(
    /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?$/,
  );
  if (!matched) return raw;

  const [, year, month, day, hour = '00', minute = '00'] = matched;
  return `${year}년 ${Number(month)}월 ${Number(day)}일 ${hour.padStart(2, '0')}:${minute}`;
};

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
        <ul className="flex flex-col w-full gap-4">
          {filteredRecords.map((history) => (
            <li key={`${history.dateTime}-${history.taskName}`} className="flex w-full">
              <div className="flex flex-col w-full justify-center items-start gap-[18px] p-[26px] rounded-3xl bg-white">
                <div className="flex w-full justify-between items-center">
                  <span className="body-18 font-semibold text-label-strong">
                    {formatCounselingDateTime(history.dateTime)}
                  </span>
                  <Button size="sm">리포트 보기</Button>
                </div>
                <Divider />
                <div className="grid w-full grid-cols-2 items-start gap-x-10">
                  <div className="flex min-w-0 flex-col items-start gap-2">
                    <div className="flex items-center gap-3">
                      <span className="body-16 w-[78px] text-label-alternative">
                        {'주 호소 문제'}
                      </span>
                      <span className="flex items-center justify-center gap-[3px] font-semibold rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 leading-none text-label-normal">
                        {history.chiefConcern}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="body-16 w-[78px] text-label-alternative">{'지불 여부'}</span>
                      <span
                        className={`body-16 font-medium ${
                          history.paymentStatus === '미납' ? 'text-[#FF6363]' : 'text-label-neutral'
                        }`}
                      >
                        {history.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col items-start gap-2">
                    <div className="flex items-center gap-3">
                      <span className="body-16 w-[78px] text-label-alternative">{'과제명'}</span>
                      <span className="body-16 text-label-neutral">{history.taskName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="body-16 w-[78px] text-label-alternative">{'과제 여부'}</span>
                      <span
                        className={`body-16 ${
                          history.taskStatus === '미완수'
                            ? 'text-[#FF6363]'
                            : history.taskStatus === '진행중'
                              ? 'text-[#FF9200]'
                              : 'text-[#009632]'
                        }`}
                      >
                        {history.taskStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-14 mt-2 text-label-alternative">조건에 맞는 상담 내역이 없습니다.</p>
      )}
    </section>
  );
}
