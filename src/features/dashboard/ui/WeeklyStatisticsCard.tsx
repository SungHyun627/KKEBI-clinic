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
      <div className="flex items-center gap-2 body-14 text-label-alternative">
        <div className="flex h-[28px] w-[28px] bg-fill-pressed rounded-[8px] shrink-0 items-center justify-center">
          <Image src={icon} alt="" width={20} height={20} aria-hidden />
        </div>
        <span className="body-18 font-medium text-neutral-40">{label}</span>
      </div>
      <p className="mt-2 font-pretendard text-[30px] leading-[39px] font-semibold text-label-normal">
        {value}
        {unit ? <span className="text-[32px] leading-[30px] font-semibold">{unit}</span> : null}
      </p>
    </div>
  );
};

export default WeeklyStatisticsCard;
