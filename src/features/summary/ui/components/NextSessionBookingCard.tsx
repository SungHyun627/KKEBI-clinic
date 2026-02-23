interface NextSessionBookingCardProps {
  locale: string;
  coordinationLater: boolean;
  nextDate: string;
  nextTime: string;
  onCoordinationLaterChange: (checked: boolean) => void;
  onNextDateChange: (value: string) => void;
  onNextTimeChange: (value: string) => void;
}

export default function NextSessionBookingCard({
  locale,
  coordinationLater,
  nextDate,
  nextTime,
  onCoordinationLaterChange,
  onNextDateChange,
  onNextTimeChange,
}: NextSessionBookingCardProps) {
  return (
    <div className="rounded-[20px] border border-neutral-95 bg-white p-6">
      <div className="body-18 font-semibold text-label-normal">
        {locale === 'en' ? 'Next session booking' : '다음 상담 예약'}
      </div>
      <label className="mt-3 flex items-center gap-2 body-14 text-label-normal">
        <input
          type="checkbox"
          checked={coordinationLater}
          onChange={(e) => onCoordinationLaterChange(e.target.checked)}
        />
        {locale === 'en' ? 'Coordinate separately with client' : '내담자와 별도 조율'}
      </label>
      <div className="mt-3 flex gap-2">
        <input
          type="date"
          value={nextDate}
          onChange={(e) => onNextDateChange(e.target.value)}
          disabled={coordinationLater}
          className="h-10 flex-1 rounded-[10px] border border-neutral-95 px-3 body-14"
        />
        <input
          type="time"
          value={nextTime}
          onChange={(e) => onNextTimeChange(e.target.value)}
          disabled={coordinationLater}
          className="h-10 w-[130px] rounded-[10px] border border-neutral-95 px-3 body-14"
        />
      </div>
    </div>
  );
}
