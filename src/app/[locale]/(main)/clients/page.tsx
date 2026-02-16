'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { getTodaySchedules, type RiskType, type TodayScheduleItem } from '@/features/dashboard';
import ClientDetailDrawer from '@/features/clients/ui/ClientDetailDrawer';
import type { ClientLookupItem } from '@/features/clients/types/client';
import { Button } from '@/shared/ui/button';
import ChiefConcernChip from '@/shared/ui/chips/chief-concern-chip';
import MoodScoreChip from '@/shared/ui/chips/mood-score-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import StreakChip from '@/shared/ui/chips/streak-chip';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';

type RiskFilter = 'all' | RiskType;

export default function ClientsPage() {
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const targetClientId = searchParams.get('clientId');
  const targetOpenAt = searchParams.get('openAt');
  const targetQueryKey = targetClientId ? `${targetClientId}:${targetOpenAt ?? ''}` : null;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [isRiskFilterInteracted, setIsRiskFilterInteracted] = useState(false);
  const [clients, setClients] = useState<ClientLookupItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientLookupItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dismissedQueryKey, setDismissedQueryKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      const result = await getTodaySchedules();

      if (!result.success || !result.data) {
        setClients([]);
        setErrorMessage(tClients('listLoadFailed'));
        setIsLoading(false);
        return;
      }

      const uniqueClients = mapSchedulesToClients(result.data, locale, [
        tClients('concernsDepression'),
        tClients('concernsStress'),
        tClients('concernsSleep'),
      ]);
      setClients(uniqueClients);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadClients();
  }, [locale, tClients]);

  useEffect(() => {
    if (!targetClientId || clients.length === 0) return;
    const hasMatchedClient = clients.some((item) => item.clientId === targetClientId);
    if (!hasMatchedClient) {
      router.replace(pathname, { scroll: false });
    }
  }, [clients, pathname, router, targetClientId]);

  const selectedClientFromQuery = useMemo(() => {
    if (!targetClientId) return null;
    return clients.find((item) => item.clientId === targetClientId) ?? null;
  }, [clients, targetClientId]);

  const activeClient = selectedClientFromQuery ?? selectedClient;
  const isQueryDrawerOpen = Boolean(
    targetClientId && selectedClientFromQuery && targetQueryKey !== dismissedQueryKey,
  );

  const filteredClients = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesRisk = riskFilter === 'all' ? true : client.riskType === riskFilter;
      const matchesName = normalizedKeyword
        ? client.clientName.toLowerCase().includes(normalizedKeyword)
        : true;
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
              placeholder={tClients('listSearchPlaceholder')}
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
            placeholder={tClients('listRiskType')}
            value={riskFilter}
            triggerLabel={!isRiskFilterInteracted ? tClients('listRiskType') : undefined}
            onValueChange={(value) => {
              setRiskFilter(value as RiskFilter);
              setIsRiskFilterInteracted(true);
              setPage(1);
            }}
            options={[
              { label: tClients('listAll'), value: 'all' },
              { label: tClients('filterRiskStable'), value: '안정' },
              { label: tClients('filterRiskCaution'), value: '주의' },
              { label: tClients('filterRiskHigh'), value: '위험' },
            ]}
            className={locale === 'en' ? 'w-40' : 'w-31'}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm">{tClients('listRegister')}</Button>
          <Button size="sm" variant="outline">
            {tClients('listClosedSessions')}
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[23px]">
        <div className="flex w-full items-end justify-between">
          <div className="body-18 text-label-normal font-semibold">
            {tClients('listTotalCount', { count: filteredClients.length })}
          </div>
          <div className="flex items-center gap-[3px]">
            <button
              type="button"
              aria-label={tClients('listPrevious10')}
              className="flex h-8 w-8 items-center justify-center bg-white text-label-normal hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-99 disabled:opacity-40"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Image src="/icons/small-left.svg" alt="" width={32} height={32} aria-hidden />
            </button>
            <button
              type="button"
              aria-label={tClients('listNext10')}
              className="flex h-8 w-8 items-center justify-center bg-white text-label-normal hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-99 disabled:opacity-40"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
            >
              <Image src="/icons/small-right.svg" alt="" width={32} height={32} aria-hidden />
            </button>
          </div>
        </div>

        <div className="w-full mb-12">
          <div className="grid w-full grid-cols-[1fr_3fr_2fr_6fr_5fr] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3">
            <span className="body-14 font-semibold text-label-neutral">{tClients('listTime')}</span>
            <span className="body-14 font-semibold text-label-neutral">
              {tClients('listClientName')}
            </span>
            <span className="body-14 text-center font-semibold text-label-neutral">
              {tClients('listRiskType')}
            </span>
            <span className="body-14 font-semibold text-label-neutral">
              {tClients('listMoodStressEnergyScore')}
            </span>
            <span className="body-14  font-semibold text-label-neutral">
              {tClients('historyPresentingConcern')}
            </span>
          </div>

          {isLoading ? (
            <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-label-alternative">
              {tClients('listLoading')}
            </div>
          ) : errorMessage ? (
            <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-status-negative">
              {errorMessage}
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-label-alternative">
              {tClients('listEmpty')}
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
                  <span className="body-16 text-label-normal">{client.time}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="body-16 truncate text-label-normal">{client.clientName}</span>
                    <StreakChip days={client.streakDays} />
                  </span>
                  <span className="justify-self-center">
                    <RiskTypeChip value={client.riskType} />
                  </span>
                  <span className="flex items-center gap-2">
                    <MoodScoreChip label={tClients('checkinMood')} score={client.moodScore} />
                    <MoodScoreChip label={tClients('checkinStress')} score={client.stressScore} />
                    <MoodScoreChip label={tClients('checkinEnergy')} score={client.energyScore} />
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

      <ClientDetailDrawer
        open={isDrawerOpen || isQueryDrawerOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && targetQueryKey) {
            setDismissedQueryKey(targetQueryKey);
            router.replace(pathname, { scroll: false });
          }
          if (!nextOpen) {
            setSelectedClient(null);
          }
          setIsDrawerOpen(nextOpen);
        }}
        client={activeClient}
      />
    </section>
  );
}

const mapSchedulesToClients = (
  schedules: TodayScheduleItem[],
  locale: string,
  concerns: string[],
): ClientLookupItem[] => {
  const sortedByTime = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

  return sortedByTime
    .map((schedule) => ({
      time: schedule.time,
      clientId: schedule.clientId,
      clientName: getClientNameByLocale(schedule.clientId, schedule.clientName, locale),
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
