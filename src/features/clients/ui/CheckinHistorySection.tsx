import { useTranslations } from 'next-intl';
import type { ClientCheckinRecord } from '../types/client';

interface CheckinHistorySectionProps {
  checkins: ClientCheckinRecord[];
}

const CHECKIN_METRICS = [
  { key: 'moodScore', label: '기분' },
  { key: 'stressScore', label: '스트레스' },
  { key: 'energyScore', label: '에너지' },
  { key: 'sleepScore', label: '수면' },
] as const;

export default function CheckinHistorySection({ checkins }: CheckinHistorySectionProps) {
  const tCheckin = useTranslations('clients.checkin');
  if (checkins.length === 0) {
    return (
      <section className="flex w-full flex-col items-start gap-5">
        <div className="flex w-full items-center justify-between">
          <span className="body-18 font-semibold text-neutral-20">{tCheckin('title')}</span>
        </div>
        <p className="body-14 text-label-alternative">{tCheckin('emptyLastMonth')}</p>
      </section>
    );
  }

  const latest = checkins[0];

  return (
    <section className="flex w-full flex-col items-start gap-5">
      <div className="flex w-full items-center justify-between">
        <span className="body-18 font-semibold text-neutral-20">{tCheckin('title')}</span>
        <div className="flex items-center gap-2">
          <span className="body-14 text-label-alternative">{tCheckin('latest')}</span>
          <span className="body-14 text-[#303030]">
            {latest.date} {latest.time}
          </span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        {CHECKIN_METRICS.map(({ key, label }) => {
          const score = latest[key] ?? 0;
          const metricLabel =
            label === '기분'
              ? tCheckin('mood')
              : label === '스트레스'
                ? tCheckin('stress')
                : label === '에너지'
                  ? tCheckin('energy')
                  : tCheckin('sleep');
          return (
            <div
              key={key}
              className="flex w-full max-w-[140px] flex-col items-start rounded-[20px] bg-white px-[14px] py-3"
            >
              <span className="body-14 flex justify-center rounded-[10px] border border-neutral-95 px-2 py-[2px]">
                {metricLabel}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[32px] font-semibold leading-[160%] text-label-normal">
                  {scoreToEmoji(score)}
                </span>
                <span className="text-[24px] leading-[125%] text-label-normal font-semibold">
                  {score}/5
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function scoreToEmoji(score: number) {
  if (score <= 1) return '☹️';
  if (score === 2) return '🙁';
  if (score === 3) return '😐';
  if (score === 4) return '🙂';
  return '😊';
}
