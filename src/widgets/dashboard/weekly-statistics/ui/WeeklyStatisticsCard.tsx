import Image from 'next/image';

interface WeeklyStatisticsCardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: string;
}

const WeeklyStatisticsCard = ({ label, value, unit, icon }: WeeklyStatisticsCardProps) => {
  return (
    <div className="flex h-32 w-full min-w-0 flex-col items-start rounded-[20px] border border-neutral-95 px-[26px] py-[23px]">
      <div className="flex min-h-[40px] w-full items-center gap-2 body-14 text-label-alternative">
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image src={icon} alt="" width={20} height={20} aria-hidden />
        </div>
        <span className="body-18 min-w-0 line-clamp-2 font-medium !leading-[120%] text-neutral-40">
          {label}
        </span>
      </div>
      <div className="mt-auto min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
        <span className="font-pretendard text-[30px] leading-[39px] font-semibold text-label-normal">
          {value}
        </span>
        {unit ? (
          <span className="text-[32px] leading-[30px] font-semibold text-label-normal">{unit}</span>
        ) : null}
      </div>
    </div>
  );
};

export default WeeklyStatisticsCard;
