'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getTodaySchedules, type RiskType, type TodayScheduleItem } from '@/features/dashboard';
import { Button } from '@/shared/ui/button';
import ChiefConcernChip from '@/shared/ui/chips/chief-concern-chip';
import MoodScoreChip from '@/shared/ui/chips/mood-score-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import StreakChip from '@/shared/ui/chips/streak-chip';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';

type RiskFilter = 'all' | RiskType;

interface ClientLookupItem {
  time: string;
  clientId: string;
  clientName: string;
  streakDays: number;
  riskType: RiskType;
  moodScore: number;
  stressScore: number;
  energyScore: number;
  chiefConcern: string[];
}

export default function ClientsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [clients, setClients] = useState<ClientLookupItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientLookupItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      const result = await getTodaySchedules();

      if (!result.success || !result.data) {
        setClients([]);
        setErrorMessage(result.message || '내담자 목록을 불러오지 못했습니다.');
        setIsLoading(false);
        return;
      }

      const uniqueClients = mapSchedulesToClients(result.data);
      setClients(uniqueClients);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim();
    return clients.filter((client) => {
      const matchesRisk = riskFilter === 'all' ? true : client.riskType === riskFilter;
      const matchesName = normalizedKeyword ? client.clientName.includes(normalizedKeyword) : true;
      return matchesRisk && matchesName;
    });
  }, [clients, riskFilter, searchKeyword]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, currentPage]);

  return (
    <section className="flex w-full flex-col items-start gap-7">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full min-w-0 flex-1 items-center gap-4">
          <div className="w-full min-w-0 max-w-[416px]">
            <Input
              placeholder="내담자 성함을 검색해 보세요."
              className="min-w-0"
              value={searchKeyword}
              onChange={(event) => {
                setSearchKeyword(event.target.value);
                setPage(1);
              }}
              icon={
                <div
                  className="h-6 w-6 bg-current"
                  style={{
                    maskImage: 'url(/icons/search.svg)',
                    WebkitMaskImage: 'url(/icons/search.svg)',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                  }}
                />
              }
            />
          </div>
          <Select
            placeholder="위험 유형"
            value={riskFilter}
            onValueChange={(value) => {
              setRiskFilter(value as RiskFilter);
              setPage(1);
            }}
            options={[
              { label: '전체', value: 'all' },
              { label: '안정', value: '안정' },
              { label: '주의', value: '주의' },
              { label: '위험', value: '위험' },
            ]}
            className="w-31"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm">내담자 등록</Button>
          <Button size="sm" variant="outline">
            종결 상담 확인
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[23px]">
        <div className="flex w-full items-end justify-between">
          <div className="body-18 text-label-normal font-semibold">
            총 {filteredClients.length}명
          </div>
          <div className="flex items-center gap-[3px]">
            <button
              type="button"
              aria-label="이전 10개"
              className="flex h-8 w-8 items-center justify-center bg-white text-label-normal disabled:text-label-disable hover:cursor-pointer"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Image src="/icons/left.svg" alt="" width={32} height={32} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="다음 10개"
              className="flex h-8 w-8 items-center justify-center bg-white text-label-normal disabled:text-label-disable hover:cursor-pointer"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
            >
              <Image src="/icons/right.svg" alt="" width={32} height={32} aria-hidden />
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="grid w-full grid-cols-[1fr_3fr_2fr_6fr_5fr] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3">
            <span className="body-14 font-semibold text-label-neutral">시간</span>
            <span className="body-14 font-semibold text-label-neutral">내담자명</span>
            <span className="body-14 text-center font-semibold text-label-neutral">위험 유형</span>
            <span className="body-14 font-semibold text-label-neutral">
              기분/스트레스/에너지 점수
            </span>
            <span className="body-14  font-semibold text-label-neutral">주 호소 문제</span>
          </div>

          {isLoading ? (
            <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-label-alternative">
              내담자 목록을 불러오는 중입니다.
            </div>
          ) : errorMessage ? (
            <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-status-negative">
              {errorMessage}
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-label-alternative">
              조건에 맞는 내담자가 없습니다.
            </div>
          ) : (
            <ul className="flex w-full flex-col">
              {pagedClients.map((client, index) => (
                <li
                  key={client.clientId}
                  className={[
                    'grid w-full grid-cols-[1fr_3fr_2fr_6fr_5fr] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3 hover:cursor-pointer hover:bg-neutral-99',
                    index === 0 ? 'pt-4' : '',
                    index === pagedClients.length - 1
                      ? 'rounded-bl-[8px] rounded-br-[8px] pb-4'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsDrawerOpen(true);
                  }}
                >
                  <span className="body-14 text-label-normal">{client.time}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="body-14 truncate text-label-normal">{client.clientName}</span>
                    <StreakChip days={client.streakDays} />
                  </span>
                  <span className="justify-self-center">
                    <RiskTypeChip value={client.riskType} />
                  </span>
                  <span className="flex items-center gap-2">
                    <MoodScoreChip label="기분" score={client.moodScore} />
                    <MoodScoreChip label="스트레스" score={client.stressScore} />
                    <MoodScoreChip label="에너지" score={client.energyScore} />
                  </span>
                  <span className="flex flex-wrap gap-2">
                    {client.chiefConcern.map((concern) => (
                      <ChiefConcernChip key={`${client.clientId}-${concern}`} value={concern} />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-[420px]">
          <DrawerHeader>
            <DrawerTitle>{selectedClient?.clientName ?? '내담자 상세 정보'}</DrawerTitle>
            <DrawerClose asChild>
              <button type="button" aria-label="닫기" className="body-14 text-label-alternative">
                닫기
              </button>
            </DrawerClose>
          </DrawerHeader>

          {selectedClient ? (
            <div className="mt-6 flex flex-col gap-3">
              <div className="rounded-xl border border-neutral-95 bg-neutral-99 p-4">
                <p className="body-14 text-label-alternative">내담자 ID</p>
                <p className="body-16 font-semibold text-label-normal">{selectedClient.clientId}</p>
              </div>
              <div className="rounded-xl border border-neutral-95 bg-neutral-99 p-4">
                <p className="body-14 text-label-alternative">위험 유형</p>
                <p className="body-16 font-semibold text-label-normal">{selectedClient.riskType}</p>
              </div>
              <div className="rounded-xl border border-neutral-95 bg-neutral-99 p-4">
                <p className="body-14 text-label-alternative">점수 (기분/스트레스/에너지)</p>
                <p className="body-16 font-semibold text-label-normal">
                  {selectedClient.moodScore}/{selectedClient.stressScore}/
                  {selectedClient.energyScore}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-95 bg-neutral-99 p-4">
                <p className="body-14 text-label-alternative">주 호소 문제</p>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedClient.chiefConcern.map((concern) => (
                    <ChiefConcernChip
                      key={`drawer-${selectedClient.clientId}-${concern}`}
                      value={concern}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    </section>
  );
}

const mapSchedulesToClients = (schedules: TodayScheduleItem[]): ClientLookupItem[] => {
  const sortedByTime = [...schedules].sort((a, b) => a.time.localeCompare(b.time));
  const concerns = ['우울', '스트레스', '수면'];

  return sortedByTime
    .map((schedule) => ({
      time: schedule.time,
      clientId: schedule.clientId,
      clientName: schedule.clientName,
      streakDays: schedule.streakDays ?? 0,
      riskType: schedule.riskType,
      moodScore: schedule.moodScore ?? 0,
      stressScore: schedule.stressScore ?? 0,
      energyScore:
        schedule.moodScore === null && schedule.stressScore === null
          ? 0
          : Math.max(
              0,
              Math.min(
                5,
                (schedule.moodScore ?? 0) + 1 - Math.floor((schedule.stressScore ?? 0) / 2),
              ),
            ),
      chiefConcern: concerns,
    }))
    .sort((a, b) => a.time.localeCompare(b.time));
};
