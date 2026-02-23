import type { MissionItem } from '@/features/summary/types/summary';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface RecommendedMissionsCardProps {
  missions: MissionItem[];
  selectedMissions: string[];
  onToggleMission: (id: string, checked: boolean) => void;
}

export default function RecommendedMissionsCard({
  missions,
  selectedMissions,
  onToggleMission,
}: RecommendedMissionsCardProps) {
  const tSummary = useTranslations('summary');

  return (
    <div className="flex w-full flex-col items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/checkmark-seal.svg"
            alt={tSummary('missionsIconAlt')}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {tSummary('missionsTitle')}
        </div>
      </div>
      <div className="flex w-full gap-10 flex-wrap">
        {missions.map((mission) => {
          const checked = selectedMissions.includes(mission.id);
          return (
            <div
              className="flex flex-col w-full h-110px max-w-[190px] px-[13px] py-5 items-start gap-[18px] border border-neutral-95 rounded-[16px]"
              key={mission.id}
            >
              <div key={mission.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 body-14 text-label-normal">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={mission.name}
                    onClick={() => onToggleMission(mission.id, !checked)}
                    className={`inline-flex h-[25.254px] w-[25.254px] items-center hover:cursor-pointer justify-center rounded-[6px] ${
                      checked ? 'bg-primary' : 'bg-neutral-95'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="12"
                      viewBox="0 0 17 12"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.4308 0.377102C14.9971 -0.151324 15.8847 -0.120623 16.4133 0.445462C16.9417 1.0118 16.9111 1.89933 16.3449 2.42788L7.3908 10.7834C6.79799 11.3362 5.87802 11.3364 5.28533 10.7834L0.445487 6.26675C-0.120641 5.73818 -0.151324 4.84966 0.377128 4.28335C0.90558 3.71745 1.79326 3.68697 2.35955 4.21499L6.33807 7.92691L14.4308 0.377102Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <span className="body-18 font-semibold text-label-neutral whitespace-nowrap">
                    {mission.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-[6px] w-full">
                <div className="flex w-full items-center">
                  <span className="body-16 text-neutral-60 min-w-[74px] w-full">
                    {tSummary('missionsCategoryLabel')}
                  </span>
                  <span className="body-16 font-medium text-neutral-30 w-full">
                    {mission.category}
                  </span>
                </div>
                <div className="flex w-full items-center">
                  <span className="body-16 text-neutral-60 min-w-[74px] w-full">
                    {tSummary('missionsDurationLabel')}
                  </span>
                  <span className="body-16 font-medium text-neutral-30 w-full">
                    {mission.duration}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
