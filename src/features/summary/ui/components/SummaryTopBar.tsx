import Image from 'next/image';
import { LocaleSwitchButton } from '@/shared/ui/locale-switch-button';
import { Button } from '@/shared/ui/button';
import SessionTypeChip from '@/widgets/dashboard/today-schedule/ui/SessionTypeChip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import { isRiskType, isSessionType } from '@/features/summary/types/summary';

interface SummaryTopBarProps {
  locale: string;
  backLabel: string;
  clientName: string;
  profileSuffix: string;
  sessionType?: string;
  riskType?: string;
  hasRecording: boolean;
  onDownloadTxt: () => void;
  onDownloadAudio: () => void;
  onPrintPdf: () => void;
  onBack: () => void;
}

export default function SummaryTopBar({
  locale,
  backLabel,
  clientName,
  profileSuffix,
  sessionType,
  riskType,
  hasRecording,
  onDownloadTxt,
  onDownloadAudio,
  onPrintPdf,
  onBack,
}: SummaryTopBarProps) {
  return (
    <div className="flex w-full justify-between p-5">
      <div className="flex items-center gap-13">
        <div className="flex items-center gap-4">
          <span className="body-18 font-semibold text-label-normal">
            {clientName}
            {profileSuffix}
          </span>
          <div className="flex items-center gap-2">
            {isSessionType(sessionType) ? <SessionTypeChip value={sessionType} /> : null}
            {isRiskType(riskType) ? <RiskTypeChip value={riskType} /> : null}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-[38px] rounded-[10px] border-neutral-95 bg-white px-3"
            onClick={onDownloadTxt}
          >
            TXT
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-[38px] rounded-[10px] border-neutral-95 bg-white px-3"
            onClick={onDownloadAudio}
            disabled={!hasRecording}
          >
            {locale === 'en' ? 'Audio' : '녹음'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-[38px] rounded-[10px] border-neutral-95 bg-white px-3"
            onClick={onPrintPdf}
          >
            PDF
          </Button>
          <Button
            variant="icon"
            onClick={onBack}
            className="p-0 border-none hover:bg-white h-6 w-6"
            aria-label={backLabel}
          >
            <Image src="/icons/backward.svg" alt="" width={24} height={24} />
          </Button>
        </div>
        <LocaleSwitchButton />
      </div>
    </div>
  );
}
