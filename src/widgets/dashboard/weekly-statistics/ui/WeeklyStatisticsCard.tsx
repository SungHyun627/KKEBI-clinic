import Image from 'next/image';

interface WeeklyStatisticsCardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: string;
}

const WeeklyStatisticsCard = ({ label, value, unit, icon }: WeeklyStatisticsCardProps) => {
  return (
    <div className="flex h-32 w-full min-w-[195px] flex-col items-start rounded-[20px] border border-neutral-95 px-[26px] py-[23px]">
      <div className="flex w-full items-center gap-2 body-14 text-label-alternative">
        <div className="flex h-[28px] w-[28px] bg-fill-pressed rounded-[8px] shrink-0 items-center justify-center">
          <Image src={icon} alt="" width={20} height={20} aria-hidden />
        </div>
        <span className="body-18 min-w-0 truncate font-medium text-neutral-40">{label}</span>
      </div>
      <div className="mt-2 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
        <span className="font-pretendard text-[clamp(22px,2.6vw,30px)] leading-[clamp(30px,3.2vw,39px)] font-semibold text-label-normal">
          {value}
        </span>
        {unit ? (
          <span className="text-[clamp(20px,2.7vw,32px)] leading-[clamp(24px,2.8vw,30px)] font-semibold text-label-normal">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default WeeklyStatisticsCard;
