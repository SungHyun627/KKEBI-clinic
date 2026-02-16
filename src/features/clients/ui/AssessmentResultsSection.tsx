'use client';

import { useTranslations } from 'next-intl';
import type { ClientDetailData } from '../types/client';
import Divider from '@/shared/ui/divider';

interface AssessmentResultsSectionProps {
  detail: ClientDetailData | null;
}

interface ScoreItemProps {
  label: string;
  score: number;
}

interface QaItemProps {
  question: string;
  answer: string;
}

export default function AssessmentResultsSection({ detail }: AssessmentResultsSectionProps) {
  const tClients = useTranslations('clients');
  const qaItems: QaItemProps[] = detail
    ? [
        {
          question: tClients('scaleReasonForVisit'),
          answer: tClients('scaleAnswerReasonForVisit'),
        },
        { question: tClients('scaleDesiredChange'), answer: tClients('scaleAnswerDesiredChange') },
        {
          question: tClients('scaleSolutionsTried'),
          answer: tClients('scaleAnswerSolutionsTried'),
        },
        { question: tClients('scaleEffectiveness'), answer: tClients('scaleAnswerEffectiveness') },
        {
          question: tClients('scaleBiggestConcern'),
          answer: tClients('scaleAnswerBiggestConcern'),
        },
        {
          question: tClients('scaleAverageSleepPattern'),
          answer: tClients('scaleAnswerAverageSleepPattern'),
        },
        { question: tClients('scaleSleepQuality'), answer: tClients('scaleAnswerSleepQuality') },
        {
          question: tClients('scaleExerciseFrequency'),
          answer: tClients('scaleAnswerExerciseFrequency'),
        },
        { question: tClients('scaleMealsPerDay'), answer: tClients('scaleAnswerMealsPerDay') },
        {
          question: tClients('scaleMainSupportPerson'),
          answer: tClients('scaleAnswerMainSupportPerson'),
        },
        { question: tClients('scaleSupportReason'), answer: tClients('scaleAnswerSupportReason') },
        {
          question: tClients('scaleFamilyCohesion'),
          answer: tClients('scaleAnswerFamilyCohesion'),
        },
        {
          question: tClients('scaleFamilyCohesionReason'),
          answer: tClients('scaleAnswerFamilyCohesionReason'),
        },
        {
          question: tClients('scaleSelfDescription'),
          answer: tClients('scaleAnswerSelfDescription'),
        },
      ]
    : [];

  return (
    <section className="flex w-full flex-col gap-6 items-start">
      <h3 className="body-18 font-semibold text-neutral-20">{tClients('scaleTitle')}</h3>
      {detail ? (
        <>
          <div className="grid w-full grid-cols-3 gap-3">
            <ScoreItem label={tClients('scalePhq9')} score={detail.scaleResults.phq9} />
            <ScoreItem label={tClients('scalePss10')} score={detail.scaleResults.pss10} />
            <ScoreItem label={tClients('scaleMbi')} score={detail.scaleResults.mbi} />
          </div>

          <div className="flex w-full flex-col items-start gap-[18px] px-5 py-6 rounded-2xl bg-white">
            {qaItems.map((item, index) => (
              <div key={`${item.question}-${index}`} className="flex w-full flex-col gap-[18px]">
                <QaItem question={item.question} answer={item.answer} />
                {index < qaItems.length - 1 ? <Divider /> : null}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="body-14 mt-2 text-label-alternative">{tClients('scaleEmpty')}</p>
      )}
    </section>
  );
}

function ScoreItem({ label, score }: ScoreItemProps) {
  return (
    <div className="flex flex-col w-full gap-2 justify-center items-start rounded-[20px] bg-white px-[14px] py-3">
      <span className="flex justify-center items-center body-14 text-neutral-40 font-medium text-center px-2 py-[2px] rounded-[9px] border border-neutral-95">
        {label}
      </span>
      <span className="text-[24px] leading-[30px] font-semibold text-label-normal">{score}</span>
    </div>
  );
}

function QaItem({ question, answer }: QaItemProps) {
  return (
    <div className="flex w-full flex-col items-start gap-[14px]">
      <span className="body-14 text-label-normal font-medium px-3 py-[3px] rounded-[8px] bg-neutral-99">
        {question}
      </span>
      <p className="body-14 text-label-neutral">{answer}</p>
    </div>
  );
}
