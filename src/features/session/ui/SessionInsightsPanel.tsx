import Image from 'next/image';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import SessionInsightCard from './SessionInsightCard';

export default function SessionInsightsPanel() {
  return (
    <section className="flex min-h-full flex-col gap-[25px] pb-20">
      <div className="text-[24px] font-semibold">KKEBI 인사이트</div>
      <div className="flex w-full flex-col items-start gap-4">
        <SessionInsightCard
          title="실시간 감정 분석"
          iconSrc="/icons/analyze.svg"
          mainContent={
            <div className="flex items-center gap-[6px]">
              <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                불안
              </span>
              <Image
                src="/icons/kkebi-character.svg"
                alt="KKEBI Character"
                width={28}
                height={28}
              />
            </div>
          }
          subContent={
            <>
              <span className="body-16 text-label-alternative">신뢰도</span>
              <span className="body-16 font-medium text-label-neutral">86%</span>
            </>
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                최근 감정
              </span>
              <div className="flex w-full body-14">기쁨, 슬픔, 행복함, 불안</div>
            </div>
          </div>
        </SessionInsightCard>

        <SessionInsightCard
          title="KKEBI 데이터 요약"
          iconSrc="/icons/clipboard.svg"
          mainContent={
            <div className="flex items-center gap-2">
              <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                17점
              </span>
            </div>
          }
          subContent={
            <>
              <span className="body-16 text-label-alternative">위험도</span>
              <RiskTypeChip value="주의" />
            </>
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                최근 감정
              </span>
              <div className="flex w-full body-14">기쁨, 슬픔, 행복함, 불안</div>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                주요 고민
              </span>
              <div className="flex w-full body-14">업무 스트레스, 수면 저하</div>
            </div>
          </div>
        </SessionInsightCard>

        <SessionInsightCard
          title="감지된 인지적 왜곡"
          iconSrc="/icons/brain.svg"
          mainContent={
            <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
              파국화
            </span>
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                사례
              </span>
              <div className="flex w-full body-14">사례가 되는 텍스트를 보여주세요</div>
            </div>
          </div>
        </SessionInsightCard>
      </div>
    </section>
  );
}
