'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { getClosedClients, restoreClient, type ClosedClientItem } from '@/features/clients';
import ChiefConcernChip from '@/shared/ui/chips/chief-concern-chip';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

const closeReasonStyleByValue: Record<ClosedClientItem['closeReason'], string> = {
  '회기 종료': 'border-[rgba(66,158,0,0.50)] bg-[rgba(66,158,0,0.10)] text-[#429E00]',
  '중도 탈락': 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-[#E52222]',
  기타: 'border-[rgba(255,146,0,0.50)] bg-[rgba(255,146,0,0.10)] text-[#FF9200]',
};

export default function ClosedClientsPage() {
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const [closedClients, setClosedClients] = useState<ClosedClientItem[]>([]);
  const [pendingClientIds, setPendingClientIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const periodLabel = locale === 'en' ? 'Counseling period' : '상담기간';
  const ageGenderLabel = locale === 'en' ? 'Gender & age' : '성별 및 나이';
  const closeReasonLabel = locale === 'en' ? 'Close reason' : '종결 사유';
  const detailLabel = locale === 'en' ? 'Details' : '상세';
  const restoreLabel = locale === 'en' ? 'Restore' : '복구하기';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await getClosedClients();
      if (result.success && result.data) {
        setClosedClients(result.data);
      }
      setIsLoading(false);
    };
    void load();
  }, []);

  return (
    <section className="flex w-full flex-col items-start gap-[23px]">
      <div className="flex flex-col w-full items-start gap-[6px]">
        <h1 className="body-18 font-semibold text-label-normal">
          {tClients('listClosedSessions')}
        </h1>
        <p className="body-16 text-label-neutral">
          30일 이내 종결된 내담자를 확인하고 복구할 수 있습니다.
        </p>
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
            {locale === 'en'
              ? 'Loading closed clients...'
              : '종결 상담자 목록을 불러오는 중입니다...'}
          </div>
        ) : (
          <ul className="flex w-full flex-col">
            {closedClients.map((item, index) => (
              <li
                key={item.id}
                className={[
                  'grid w-full grid-cols-[4fr_2fr_2fr_4fr_2fr_4fr] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3 max-[1200px]:gap-2 max-[1100px]:grid-cols-[4fr_2fr_4fr_2fr_4fr] max-[1100px]:px-3',
                  index === closedClients.length - 1 ? 'rounded-b-[8px]' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="body-16 min-w-0 truncate text-label-normal">
                  {item.counselingPeriod}
                </span>
                <span className="body-16 min-w-0 truncate text-label-normal">
                  {item.clientName}
                </span>
                <span className="body-16 min-w-0 truncate text-label-normal max-[1100px]:hidden">
                  {item.ageGender}
                </span>
                <span className="flex min-w-0 flex-wrap gap-2 overflow-hidden">
                  {item.chiefConcern.map((concern) => (
                    <ChiefConcernChip key={`${item.id}-${concern}`} value={concern} />
                  ))}
                </span>
                <span
                  className={cn(
                    'flex min-h-7 w-[75px] items-center justify-center rounded-[100px] border px-3 py-[3px] body-14 font-semibold',
                    closeReasonStyleByValue[item.closeReason],
                  )}
                >
                  <span className="whitespace-nowrap text-center leading-[120%]">
                    {item.closeReason}
                  </span>
                </span>
                <div className="flex min-w-0 w-full items-center justify-end gap-2 pl-2">
                  <Button
                    disabled
                    type="button"
                    variant="icon"
                    size="icon"
                    aria-label={detailLabel}
                    className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
                  >
                    <Image src="/icons/report.svg" alt="" width={24} height={24} aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    size="md"
                    className="w-full max-w-[181px]"
                    disabled={pendingClientIds.has(item.clientId)}
                    onClick={async () => {
                      if (pendingClientIds.has(item.clientId)) return;
                      setPendingClientIds((prev) => new Set(prev).add(item.clientId));
                      const result = await restoreClient(item.clientId);
                      setPendingClientIds((prev) => {
                        const next = new Set(prev);
                        next.delete(item.clientId);
                        return next;
                      });
                      if (!result.success) return;
                      setClosedClients((prev) =>
                        prev.filter((closedItem) => closedItem.clientId !== item.clientId),
                      );
                    }}
                  >
                    {restoreLabel}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
