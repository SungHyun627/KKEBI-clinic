import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import type { MissionItem } from '@/features/summary/types/summary';

interface TasksTabCardProps {
  locale: string;
  assignedTasks: string[];
  missions: MissionItem[];
}

export default function TasksTabCard({ locale, assignedTasks, missions }: TasksTabCardProps) {
  return (
    <div className="rounded-[20px] border border-neutral-95 bg-white p-6">
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">{locale === 'en' ? 'Tasks' : '과제 탭'}</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="body-16 font-semibold text-label-normal">
                {locale === 'en' ? 'Assigned tasks' : '할당된 과제'}
              </p>
              <div className="mt-2 space-y-2">
                {assignedTasks.map((task) => (
                  <div
                    key={task}
                    className="rounded-[12px] border border-neutral-95 bg-neutral-99 px-3 py-2 body-14 text-label-normal"
                  >
                    {task}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="body-16 font-semibold text-label-normal">
                {locale === 'en' ? 'Recommended tasks' : '추천 과제'}
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                {missions.slice(0, 4).map((mission) => (
                  <button
                    key={`rec-${mission.id}`}
                    type="button"
                    className="rounded-[12px] border border-neutral-95 bg-white px-3 py-2 text-left body-14 text-label-normal hover:bg-neutral-99"
                  >
                    <p className="font-medium">{mission.name}</p>
                    <p className="text-label-alternative">{mission.duration}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
