export default function TodayScheduleHeader() {
  return (
    <div className="grid w-full grid-cols-[72px_minmax(140px,1fr)_96px_96px_180px_160px] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3">
      <span className="body-12 font-semibold text-label-alternative">시간</span>
      <span className="body-12 font-semibold text-label-alternative">내담자명</span>
      <span className="body-12 font-semibold text-label-alternative">상담 유형</span>
      <span className="body-12 font-semibold text-label-alternative">위험유형</span>
      <span className="body-12 font-semibold text-label-alternative">기분 및 스트레스 점수</span>
      <span className="body-12 text-center font-semibold text-label-alternative">액션</span>
    </div>
  );
}
