'use client';

import ChiefConcernChip from '@/shared/ui/chips/chief-concern-chip';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import type { ClientLookupItem } from '../types/client';

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
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-[695px]">
        <DrawerHeader>
          <DrawerTitle>{client?.clientName ?? '내담자 상세 정보'}</DrawerTitle>
          <DrawerClose asChild>
            <button type="button" aria-label="닫기" className="body-14 text-label-alternative">
              닫기
            </button>
          </DrawerClose>
        </DrawerHeader>

        {client ? (
          <div className="mt-6 flex flex-col gap-3">
            <div className="rounded-xl border border-neutral-95 bg-neutral-99 p-4">
              <p className="body-14 text-label-alternative">내담자 ID</p>
              <p className="body-16 font-semibold text-label-normal">{client.clientId}</p>
            </div>
            <div className="rounded-xl border border-neutral-95 bg-neutral-99 p-4">
              <p className="body-14 text-label-alternative">위험 유형</p>
              <p className="body-16 font-semibold text-label-normal">{client.riskType}</p>
            </div>
            <div className="rounded-xl border border-neutral-95 bg-neutral-99 p-4">
              <p className="body-14 text-label-alternative">점수 (기분/스트레스/에너지)</p>
              <p className="body-16 font-semibold text-label-normal">
                {client.moodScore}/{client.stressScore}/{client.energyScore}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-95 bg-neutral-99 p-4">
              <p className="body-14 text-label-alternative">주 호소 문제</p>
              <div className="flex flex-wrap items-center gap-2">
                {client.chiefConcern.map((concern) => (
                  <ChiefConcernChip key={`drawer-${client.clientId}-${concern}`} value={concern} />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
