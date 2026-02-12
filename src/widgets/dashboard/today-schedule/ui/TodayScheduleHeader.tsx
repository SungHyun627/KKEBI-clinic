import TodayScheduleHeaderCell from './TodayScheduleHeaderCell';

export default function TodayScheduleHeader() {
  return (
    <div className="grid w-full grid-cols-[72px_minmax(160px,220px)_96px_72px_minmax(260px,1fr)_250px] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3">
      <TodayScheduleHeaderCell label="시간" />
      <TodayScheduleHeaderCell label="내담자명" />
      <TodayScheduleHeaderCell label="상담 유형" align="center" />
      <TodayScheduleHeaderCell label="위험유형" align="center" />
      <TodayScheduleHeaderCell label="기분 및 스트레스 점수" align="left" className="pr-6" />
      <span aria-hidden />
    </div>
  );
}
