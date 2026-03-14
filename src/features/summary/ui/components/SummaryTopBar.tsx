import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LocaleSwitchButton } from '@/shared/ui/locale-switch-button';
import { Button } from '@/shared/ui/button';
import SummaryQuitConfirmDialog from './SummaryQuitConfirmDialog';

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
  confirmOnBack?: boolean;
}

const SummaryTopBar = ({
  backLabel,
  clientName,
  profileSuffix,
  hasRecording,
  onDownloadTxt,
  onDownloadAudio,
  onPrintPdf,
  onBack,
  confirmOnBack = true,
}: SummaryTopBarProps) => {
  const tSummary = useTranslations('summary');
  const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false);

  return (
    <>
      <div className="flex w-full justify-between p-5">
        <div className="flex items-center gap-[22px]">
          <Button
            variant="icon"
            onClick={() => {
              if (confirmOnBack) {
                setIsQuitDialogOpen(true);
                return;
              }
              onBack();
            }}
            className="p-0 border-none hover:bg-white h-6 w-6"
          >
            <Image src="/icons/back-ward.svg" alt={backLabel} width={24} height={24} />
          </Button>
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
                <Image
                  src="/icons/download.svg"
                  alt={tSummary('topBarTxtDownloadAlt')}
                  width={30}
                  height={30}
                />
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
                <Image
                  src="/icons/download.svg"
                  alt={tSummary('topBarPdfDownloadAlt')}
                  width={30}
                  height={30}
                />
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
                disabled={!hasRecording}
              >
                <Image
                  src="/icons/download.svg"
                  alt={tSummary('topBarAudioDownloadAlt')}
                  width={30}
                  height={30}
                />
              </Button>
              <span className="body-16 font-medium text-label-normal">
                {tSummary('topBarAudioLabel')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitchButton />
        </div>
      </div>

      {confirmOnBack ? (
        <SummaryQuitConfirmDialog
          open={isQuitDialogOpen}
          onOpenChange={setIsQuitDialogOpen}
          onConfirm={() => {
            setIsQuitDialogOpen(false);
            onBack();
          }}
        />
      ) : null}
    </>
  );
};

export default SummaryTopBar;
