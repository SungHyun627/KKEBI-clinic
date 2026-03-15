'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getClosedClients } from '@/features/clients/client-closure/api/getClosedClients';
import { restoreClient } from '@/features/clients/client-closure/api/restoreClient';
import type { ClosedClientsResponse } from '@/features/clients/client-closure/types/client-closure';
import { closedClientsQueryKey } from '@/features/clients/client-closure/lib/query-keys';
import ClosedClientCard from '@/features/clients/client-closure/ui/ClosedClientCard';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';

type ClientsTranslationConcernKeyMap = {
  concernsDepression: string;
  concernsStress: string;
  concernsSleep: string;
  concernsAnxiety: string;
  concernsInterpersonal: string;
  concernsBurnout: string;
  concernsPanic: string;
  concernsWork: string;
  concernsHealth: string;
  concernsMoney: string;
  concernsFamily: string;
  concernsDatingMarriage: string;
  concernsFriendship: string;
  concernsCareerJob: string;
  concernsPet: string;
  concernsStudy: string;
  concernsOther: string;
};

function formatAgeGenderByLocale(value: string, locale: string) {
  if (locale !== 'en') return value;

  const matched = value.match(/(남성|여성)\s*(\d+)세/);
  if (!matched) return value;

  const gender = matched[1] === '남성' ? 'Male' : 'Female';
  return `${gender}, ${matched[2]}`;
}

export default function ClosedClientsPageClient() {
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [pendingClientIds, setPendingClientIds] = useState<Set<string>>(new Set());
  const periodLabel = tClients('closedColumnPeriod');
  const ageGenderLabel = tClients('closedColumnAgeGender');
  const closeReasonLabel = tClients('closedColumnReason');
  const detailLabel = tClients('closedDetail');
  const restoreLabel = tClients('closedRestore');

  const closedClientsQuery = useQuery({
    queryKey: closedClientsQueryKey,
    queryFn: getClosedClients,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const terminatedClients =
    closedClientsQuery.data?.success && closedClientsQuery.data.data
      ? closedClientsQuery.data.data
      : [];
  const isLoading = closedClientsQuery.isPending;

  const localizeChiefConcern = (value: string) => {
    const concernKeyByValue: Record<string, keyof ClientsTranslationConcernKeyMap> = {
      우울: 'concernsDepression',
      Depression: 'concernsDepression',
      스트레스: 'concernsStress',
      Stress: 'concernsStress',
      수면: 'concernsSleep',
      Sleep: 'concernsSleep',
      직장: 'concernsWork',
      Work: 'concernsWork',
      건강: 'concernsHealth',
      Health: 'concernsHealth',
      돈: 'concernsMoney',
      Money: 'concernsMoney',
      가족: 'concernsFamily',
      Family: 'concernsFamily',
      '연애•결혼': 'concernsDatingMarriage',
      'Dating/Marriage': 'concernsDatingMarriage',
      우정: 'concernsFriendship',
      Friendship: 'concernsFriendship',
      '진로•취업': 'concernsCareerJob',
      'Career/Job': 'concernsCareerJob',
      반려동물: 'concernsPet',
      Pet: 'concernsPet',
      학업: 'concernsStudy',
      Study: 'concernsStudy',
      기타: 'concernsOther',
      Other: 'concernsOther',
      불안: 'concernsAnxiety',
      Anxiety: 'concernsAnxiety',
      대인관계: 'concernsInterpersonal',
      Interpersonal: 'concernsInterpersonal',
      번아웃: 'concernsBurnout',
      Burnout: 'concernsBurnout',
      공황: 'concernsPanic',
      Panic: 'concernsPanic',
    };

    const translationKey = concernKeyByValue[value.trim()];
    if (!translationKey) return value;
    return tClients(translationKey);
  };

  return (
    <section className="flex w-full flex-col items-start gap-[23px]">
      <div className="flex flex-col w-full items-start gap-[6px]">
        <h1 className="body-18 font-semibold text-label-normal">
          {tClients('listClosedSessions')}
        </h1>
        <p className="body-16 text-label-neutral">{tClients('closedDescription')}</p>
      </div>
      <div className="w-full mb-12">
        <div className="grid w-full grid-cols-[4fr_2fr_2fr_4fr_2fr_4fr] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3 max-[1200px]:gap-2 max-[1100px]:grid-cols-[4fr_2fr_4fr_2fr_4fr] max-[1100px]:px-3">
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral">
            {periodLabel}
          </span>
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral">
            {tClients('listClientName')}
          </span>
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral max-[1100px]:hidden">
            {ageGenderLabel}
          </span>
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral">
            {tClients('historyPresentingConcern')}
          </span>
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral">
            {closeReasonLabel}
          </span>
        </div>

        {isLoading ? (
          <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-label-alternative">
            {tClients('closedLoading')}
          </div>
        ) : (
          <ul className="flex w-full flex-col">
            {terminatedClients.length === 0 ? (
              <li className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-label-alternative">
                {tClients('closedEmptyLast30Days')}
              </li>
            ) : (
              terminatedClients.map((item, index) => (
                <ClosedClientCard
                  key={item.id}
                  item={item}
                  isLast={index === terminatedClients.length - 1}
                  localizedClientName={getClientNameByLocale(
                    item.clientId,
                    item.clientName,
                    locale,
                  )}
                  ageGenderText={formatAgeGenderByLocale(item.ageGender, locale)}
                  detailLabel={detailLabel}
                  restoreLabel={restoreLabel}
                  isRestoring={pendingClientIds.has(item.clientId)}
                  localizeChiefConcern={localizeChiefConcern}
                  onRestore={async (clientId) => {
                    if (pendingClientIds.has(clientId)) return;
                    setPendingClientIds((prev) => new Set(prev).add(clientId));
                    const result = await restoreClient(clientId);
                    setPendingClientIds((prev) => {
                      const next = new Set(prev);
                      next.delete(clientId);
                      return next;
                    });
                    if (!result.success) return;
                    queryClient.setQueryData<ClosedClientsResponse>(
                      closedClientsQueryKey,
                      (prev) => {
                        if (!prev?.success || !prev.data) return prev;

                        return {
                          ...prev,
                          data: prev.data.filter(
                            (terminatedItem) => terminatedItem.clientId !== clientId,
                          ),
                        };
                      },
                    );
                  }}
                />
              ))
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
