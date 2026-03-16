import Image from 'next/image';
import type { ClientLookupItem } from '@/entities/client/model/types';
import ChiefConcernChip from '@/shared/ui/chips/chief-concern-chip';
import MoodScoreChip from '@/shared/ui/chips/mood-score-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import StreakChip from '@/shared/ui/chips/streak-chip';

interface ClientListTableSectionProps {
  filteredCount: number;
  pagedClients: ClientLookupItem[];
  isLoading: boolean;
  errorMessage: string | null;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSelectClient: (client: ClientLookupItem) => void;
  labels: {
    totalCount: string;
    previous10: string;
    next10: string;
    time: string;
    clientName: string;
    riskType: string;
    moodStressEnergy: string;
    presentingConcern: string;
    loading: string;
    empty: string;
    checkinMood: string;
    checkinStress: string;
    checkinEnergy: string;
  };
}

const ClientListTableSection = ({
  filteredCount,
  pagedClients,
  isLoading,
  errorMessage,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onSelectClient,
  labels,
}: ClientListTableSectionProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-[23px]">
      <div className="flex w-full items-end justify-between">
        <div className="body-18 text-label-normal font-semibold">{labels.totalCount}</div>
        <div className="flex items-center gap-[3px]">
          <button
            type="button"
            aria-label={labels.previous10}
            className="flex h-8 w-8 items-center justify-center bg-white text-label-normal hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-99 disabled:opacity-40"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
          >
            <Image src="/icons/small-left.svg" alt="" width={32} height={32} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={labels.next10}
            className="flex h-8 w-8 items-center justify-center bg-white text-label-normal hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-99 disabled:opacity-40"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
          >
            <Image src="/icons/small-right.svg" alt="" width={32} height={32} aria-hidden />
          </button>
        </div>
      </div>

      <div className="w-full mb-12">
        <div className="grid w-full grid-cols-[1fr_3fr_2fr_7fr_4fr] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3 max-[1200px]:gap-2 max-[1000px]:grid-cols-[3fr_3fr_6fr_5fr] max-[900px]:gap-1 max-[900px]:px-3">
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral max-[1000px]:hidden">
            {labels.time}
          </span>
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral max-[1000px]:hidden">
            {labels.clientName}
          </span>
          <span className="body-14 hidden min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral max-[1000px]:block">
            {labels.time} · {labels.clientName}
          </span>
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-center font-semibold text-label-neutral">
            {labels.riskType}
          </span>
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral">
            {labels.moodStressEnergy}
          </span>
          <span className="body-14 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-label-neutral">
            {labels.presentingConcern}
          </span>
        </div>

        {isLoading ? (
          <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-label-alternative">
            {labels.loading}
          </div>
        ) : errorMessage ? (
          <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-black">
            {errorMessage}
          </div>
        ) : filteredCount === 0 ? (
          <div className="body-14 flex h-[180px] w-full items-center justify-center border-x border-b border-neutral-95 bg-white text-label-alternative">
            {labels.empty}
          </div>
        ) : (
          <ul className="flex w-full flex-col">
            {pagedClients.map((client, index) => (
              <li
                key={client.clientId}
                className={[
                  'grid w-full grid-cols-[1fr_3fr_2fr_7fr_4fr] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3 hover:cursor-pointer hover:bg-neutral-99 max-[1200px]:gap-2 max-[1000px]:grid-cols-[3fr_3fr_6fr_5fr] max-[900px]:gap-1 max-[900px]:px-3',
                  index === 0 ? 'pt-4' : '',
                  index === pagedClients.length - 1 ? 'rounded-bl-[8px] rounded-br-[8px] pb-4' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSelectClient(client)}
              >
                <span className="body-16 min-w-0 whitespace-nowrap text-label-normal max-[1000px]:hidden">
                  {client.time}
                </span>
                <span className="flex max-w-full items-center gap-3 overflow-hidden">
                  <span className="body-16 min-w-0 flex-1 truncate text-label-normal max-[1000px]:hidden">
                    {client.clientName}
                  </span>
                  <span className="hidden min-w-0 flex-1 flex-col text-label-normal max-[1000px]:flex">
                    <span className="body-14 whitespace-nowrap">{client.time}</span>
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
                    label={labels.checkinMood}
                    score={client.moodScore}
                    responsiveCompact
                  />
                  <MoodScoreChip
                    label={labels.checkinStress}
                    score={client.stressScore}
                    responsiveCompact
                  />
                  <MoodScoreChip
                    label={labels.checkinEnergy}
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
  );
};

export default ClientListTableSection;
