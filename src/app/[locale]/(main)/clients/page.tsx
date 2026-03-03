'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useClientList } from '@/features/clients';
import ClientDetailDrawer from '@/features/clients/client-detail/ui/ClientDetailDrawer';
import type { ClientLookupItem } from '@/features/clients/types/client';
import { Button } from '@/shared/ui/button';
import ChiefConcernChip from '@/shared/ui/chips/chief-concern-chip';
import MoodScoreChip from '@/shared/ui/chips/mood-score-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import StreakChip from '@/shared/ui/chips/streak-chip';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import type { RiskFilter } from '@/features/clients/client-list/types/client-list';

export default function ClientsPage() {
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const targetClientId = searchParams.get('clientId');
  const targetOpenAt = searchParams.get('openAt');
  const targetQueryKey = targetClientId ? `${targetClientId}:${targetOpenAt ?? ''}` : null;
  const fallbackConcerns = useMemo(
    () => [tClients('concernsDepression'), tClients('concernsStress'), tClients('concernsSleep')],
    [tClients],
  );
  const {
    clients,
    filteredClients,
    isLoading,
    errorMessage,
    searchKeyword,
    setSearchKeyword,
    riskFilter,
    setRiskFilter,
    isRiskFilterInteracted,
    setIsRiskFilterInteracted,
    removeClient,
  } = useClientList({
    locale,
    listLoadFailedMessage: tClients('listLoadFailed'),
    fallbackConcerns,
  });
  const [selectedClient, setSelectedClient] = useState<ClientLookupItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dismissedQueryKey, setDismissedQueryKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, currentPage]);

  return (
    <section className="flex w-full flex-col items-start gap-7">
      <div className="flex w-full items-center justify-between max-[1100px]:flex-col max-[1100px]:items-start max-[1100px]:gap-3">
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
        <div className="flex items-center gap-3 max-[1100px]:w-full max-[1100px]:justify-start">
          <Button
            size="sm"
            onClick={() => {
              router.push('/clients/new');
            }}
          >
            {tClients('listRegister')}
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push('/clients/closed')}>
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
          <div className="grid w-full grid-cols-[1fr_3fr_2fr_7fr_4fr] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3 max-[1200px]:gap-2 max-[1000px]:grid-cols-[3fr_3fr_6fr_5fr] max-[900px]:gap-1 max-[900px]:px-3">
            <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral max-[1000px]:hidden">
              {tClients('listTime')}
            </span>
            <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral max-[1000px]:hidden">
              {tClients('listClientName')}
            </span>
            <span className="body-14 hidden min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral max-[1000px]:block">
              {tClients('listTime')} · {tClients('listClientName')}
            </span>
            <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-center font-semibold text-label-neutral">
              {tClients('listRiskType')}
            </span>
            <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral">
              {tClients('listMoodStressEnergyScore')}
            </span>
            <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral">
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
                    'grid w-full grid-cols-[1fr_3fr_2fr_7fr_4fr] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3 hover:cursor-pointer hover:bg-neutral-99 max-[1200px]:gap-2 max-[1000px]:grid-cols-[3fr_3fr_6fr_5fr] max-[900px]:gap-1 max-[900px]:px-3',
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
                  <span className="body-16 min-w-0 text-label-normal max-[1000px]:hidden">
                    {client.time}
                  </span>
                  <span className="flex max-w-full items-center gap-3 overflow-hidden">
                    <span className="body-16 min-w-0 flex-1 truncate text-label-normal max-[1000px]:hidden">
                      {client.clientName}
                    </span>
                    <span className="hidden min-w-0 flex-1 flex-col text-label-normal max-[1000px]:flex">
                      <span className="body-14">{client.time}</span>
                      <span className="body-16 truncate">{client.clientName}</span>
                    </span>
                    <span className="shrink-0 max-[1100px]:hidden">
                      <StreakChip days={client.streakDays} responsiveCompact />
                    </span>
                  </span>
                  <span className="min-w-0 justify-self-center overflow-hidden">
                    <RiskTypeChip value={client.riskType} />
                  </span>
                  <span className="flex w-full min-w-0 flex-wrap items-start gap-2">
                    <MoodScoreChip
                      label={tClients('checkinMood')}
                      score={client.moodScore}
                      responsiveCompact
                    />
                    <MoodScoreChip
                      label={tClients('checkinStress')}
                      score={client.stressScore}
                      responsiveCompact
                    />
                    <MoodScoreChip
                      label={tClients('checkinEnergy')}
                      score={client.energyScore}
                      responsiveCompact
                    />
                  </span>
                  <span className="flex min-w-0 flex-wrap gap-2 overflow-hidden">
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
        onClientClosed={(closedClientId) => {
          removeClient(closedClientId);
          setSelectedClient((prev) => (prev?.clientId === closedClientId ? null : prev));
          setIsDrawerOpen(false);

          if (targetQueryKey) {
            setDismissedQueryKey(targetQueryKey);
            router.replace(pathname, { scroll: false });
          }
        }}
      />
    </section>
  );
}
