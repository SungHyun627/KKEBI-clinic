import Image from 'next/image';
interface DetectedCognitiveDistortionCardProps {
  locale: string;
  distortions: string[];
}

export default function DetectedCognitiveDistortionCard({
  locale,
  distortions,
}: DetectedCognitiveDistortionCardProps) {
  return (
    <div className="flex flex-col w-full items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/brain.svg"
            alt={locale === 'en' ? 'Detected Cognitive Distortions' : '감지된 인지적 왜곡'}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {locale === 'en' ? 'Detected Cognitive Distortions' : '감지된 인지적 왜곡'}
        </div>
      </div>
      <div className="flex min-h-[80px] w-full flex-wrap items-center gap-2 rounded-[16px] border border-neutral-95 px-[26px] py-[23px]">
        {distortions.length > 0 ? (
          distortions.map((distortion, index) => (
            <span
              key={`${distortion}-${index}`}
              className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 font-medium text-label-normal"
            >
              {distortion}
            </span>
          ))
        ) : (
          <span className="body-14 text-label-alternative">
            {locale === 'en'
              ? 'No cognitive distortions detected.'
              : '인지 왜곡 데이터가 없습니다.'}
          </span>
        )}
      </div>
    </div>
  );
}
