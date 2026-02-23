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

const SummaryTopBar = ({
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
}: SummaryTopBarProps) => {
  return (
    <div className="flex w-full justify-between p-5">
      <div className="flex items-center gap-13">
        <div className="flex items-center gap-4">
          <span className="body-18 font-semibold text-label-normal">
            {clientName}
            {profileSuffix}
          </span>
        </div>
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="icon"
              size="sm"
              className="h-[30px] w-[30px] border-none hover:bg-white p-0"
              onClick={onDownloadTxt}
            >
              <Image src="/icons/download.svg" alt="txt download" width={30} height={30} />
            </Button>
            <span className="body-16 font-medium text-label-normal">TXT</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="icon"
              size="sm"
              className="h-[30px] w-[30px] border-none hover:bg-white p-0"
              onClick={onPrintPdf}
            >
              <Image src="/icons/download.svg" alt="pdf download" width={30} height={30} />
            </Button>
            <span className="body-16 font-medium text-label-normal">PDF</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="icon"
              size="sm"
              className="h-[30px] w-[30px] border-none hover:bg-white p-0 disabled:cursor-not-allowed disabled:bg-white"
              onClick={onDownloadAudio}
              disabled
            >
              <Image src="/icons/download.svg" alt="audio download" width={30} height={30} />
            </Button>
            <span className="body-16 font-medium text-label-normal">
              {locale === 'en' ? 'Audio' : '녹음'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="icon"
          onClick={onBack}
          className="p-0 border-none hover:bg-white h-6 w-6"
          aria-label={backLabel}
        >
          <Image src="/icons/backward.svg" alt="" width={24} height={24} />
        </Button>
        <LocaleSwitchButton />
      </div>
    </div>
  );
};

export default SummaryTopBar;
