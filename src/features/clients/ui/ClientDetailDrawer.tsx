'use client';

import { useEffect, useState } from 'react';
import { getClientDetail } from '@/features/clients';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import Image from 'next/image';
import CheckinHistorySection from './CheckinHistorySection';
import CounselingHistorySection from './CounselingHistorySection';
import AssessmentResultsSection from './AssessmentResultsSection';
import ClientDetailHeader from './ClientDetailHeader';
import ClientOverviewSection from './ClientOverviewSection';
import type { ClientDetailData, ClientLookupItem } from '../types/client';
import Divider from '@/shared/ui/divider';

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
              <ClientDetailHeader client={displayClient} />
              {detail ? <ClientOverviewSection detail={detail} /> : null}

              <Divider />
              <CheckinHistorySection checkins={detail?.recentCheckins ?? []} />
              <CounselingHistorySection records={detail?.counselingHistory ?? []} />
              <AssessmentResultsSection detail={detail} />
            </>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
