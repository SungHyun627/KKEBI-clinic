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
        { question: tClients('scaleReasonForVisit'), answer: detail.intakeAnswers.reasonForVisit },
        { question: tClients('scaleDesiredChange'), answer: detail.intakeAnswers.expectedChange },
        { question: tClients('scaleSolutionsTried'), answer: detail.intakeAnswers.triedMethod },
        {
          question: tClients('scaleEffectiveness'),
          answer: detail.intakeAnswers.methodEffectiveness,
        },
        { question: tClients('scaleBiggestConcern'), answer: detail.intakeAnswers.biggestConcern },
        {
          question: tClients('scaleAverageSleepPattern'),
          answer: detail.intakeAnswers.sleepPattern,
        },
        { question: tClients('scaleSleepQuality'), answer: detail.intakeAnswers.sleepQuality },
        {
          question: tClients('scaleExerciseFrequency'),
          answer: detail.intakeAnswers.exerciseHabit,
        },
        { question: tClients('scaleMealsPerDay'), answer: detail.intakeAnswers.mealsPerDay },
        {
          question: tClients('scaleMainSupportPerson'),
          answer: detail.intakeAnswers.mostReliablePerson,
        },
        {
          question: tClients('scaleSupportReason'),
          answer: detail.intakeAnswers.reliabilityReason,
        },
        { question: tClients('scaleFamilyCohesion'), answer: detail.intakeAnswers.familyBond },
        {
          question: tClients('scaleFamilyCohesionReason'),
          answer: detail.intakeAnswers.familyBondReason,
        },
        {
          question: tClients('scaleSelfDescription'),
          answer: detail.intakeAnswers.selfDescription,
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
