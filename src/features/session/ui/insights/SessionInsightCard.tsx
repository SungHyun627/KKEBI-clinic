import Image from 'next/image';
import type { ReactNode } from 'react';

interface SessionInsightCardProps {
  title: string;
  iconSrc: string;
  iconAlt?: string;
  mainContent?: ReactNode;
  subContent?: ReactNode;
  children?: ReactNode;
}

export default function SessionInsightCard({
  title,
  iconSrc,
  iconAlt = '',
  mainContent,
  subContent,
  children,
}: SessionInsightCardProps) {
  return (
    <div className="flex w-full flex-col items-start min-h-[200px]">
      <div className="flex w-full self-stretch flex-col items-start gap-[26px] rounded-t-[24px] border-x border-t border-neutral-95 px-[26px] py-[23px]">
        <div className="body-14 flex w-full items-center gap-2 text-label-alternative">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
            <Image src={iconSrc} alt={iconAlt} width={20} height={20} aria-hidden />
          </div>
          <span className="body-18 min-w-0 truncate font-medium text-neutral-40">{title}</span>
        </div>
        {(mainContent || subContent) && (
          <div className="flex flex-col w-full items-start gap-3">
            <div className="min-w-0">{mainContent}</div>
            <div className="flex items-center gap-[6px]">{subContent}</div>
          </div>
        )}
      </div>
      <div className="flex w-full items-start gap-2 rounded-b-[24px] border-x border-b border-neutral-95 bg-neutral-99 px-[26px] py-[23px]">
        {children}
      </div>
    </div>
  );
}
