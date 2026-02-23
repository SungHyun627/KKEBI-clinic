import type { MissionItem } from '@/features/summary/types/summary';

interface RecommendedMissionsCardProps {
  locale: string;
  missions: MissionItem[];
  selectedMissions: string[];
  onToggleMission: (id: string, checked: boolean) => void;
}

export default function RecommendedMissionsCard({
  locale,
  missions,
  selectedMissions,
  onToggleMission,
}: RecommendedMissionsCardProps) {
  return (
    <div className="rounded-[20px] border border-neutral-95 bg-white p-6">
      <div className="body-18 font-semibold text-label-normal">
        {locale === 'en' ? 'Recommended missions' : '권장 미션'}
      </div>
      <div className="mt-3 space-y-2">
        {missions.map((mission) => {
          const checked = selectedMissions.includes(mission.id);
          return (
            <label key={mission.id} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 body-14 text-label-normal">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onToggleMission(mission.id, e.target.checked)}
                />
                {mission.name}
              </span>
              <span className="body-14 text-label-alternative">{mission.eta}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
