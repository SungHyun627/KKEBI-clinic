'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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

interface ClientDetailDrawerBodyProps {
  isLoading: boolean;
  errorMessage: string | null;
  displayClient: ClientLookupItem | null;
  detail: ClientDetailData | null;
}

const DRAWER_BODY_CLASSNAME = 'flex w-full flex-col gap-[42px]';

export default function ClientDetailDrawer({
  open,
  onOpenChange,
  client,
}: ClientDetailDrawerProps) {
  const tClients = useTranslations('clients');
  const tNotification = useTranslations('notification');
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
        setErrorMessage(result.message || tClients('detailLoadFailed'));
        setIsLoading(false);
        return;
      }

      setDetail(result.data);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadClientDetail();
  }, [open, client?.clientId, tClients]);

  const displayClient = detail ?? client;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="flex max-w-[695px] flex-col gap-[26px] overflow-y-auto px-8 py-[23px] bg-neutral-99"
      >
        <DrawerHeader className="sr-only p-0">
          <DrawerTitle>{tClients('detailDrawerTitle')}</DrawerTitle>
        </DrawerHeader>
        <DrawerClose asChild>
          <button
            type="button"
            aria-label={tNotification('commonFold')}
            className="flex h-6 w-6 items-center justify-center hover:cursor-pointer"
          >
            <Image src="/icons/fold.svg" alt={tNotification('commonFold')} width={20} height={20} />
          </button>
        </DrawerClose>
        <ClientDetailDrawerBody
          isLoading={isLoading}
          errorMessage={errorMessage}
          displayClient={displayClient}
          detail={detail}
        />
      </DrawerContent>
    </Drawer>
  );
}

function ClientDetailDrawerBody({
  isLoading,
  errorMessage,
  displayClient,
  detail,
}: ClientDetailDrawerBodyProps) {
  const tClients = useTranslations('clients');

  if (isLoading) {
    return (
      <div className={DRAWER_BODY_CLASSNAME}>
        <div className="body-14 text-label-alternative">{tClients('detailLoading')}</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={DRAWER_BODY_CLASSNAME}>
        <div className="body-14 text-status-negative">{errorMessage}</div>
      </div>
    );
  }

  if (!displayClient) {
    return <div className={DRAWER_BODY_CLASSNAME} />;
  }

  return (
    <div className={DRAWER_BODY_CLASSNAME}>
      <ClientDetailHeader client={displayClient} />
      {detail ? <ClientOverviewSection detail={detail} /> : null}

      <Divider />
      <CheckinHistorySection checkins={detail?.recentCheckins ?? []} />
      <CounselingHistorySection records={detail?.counselingHistory ?? []} />
      <AssessmentResultsSection detail={detail} />
    </div>
  );
}
