'use client';

import type { ClientDetailData } from '../types/client';
import Divider from '@/shared/ui/divider';

interface AssessmentResultsSectionProps {
  detail: ClientDetailData | null;
}

interface ScoreItemProps {
  label: 'PHQ-9' | 'PSS-10' | 'MBI';
  score: number;
}

interface QaItemProps {
  question: string;
  answer: string;
}

export default function AssessmentResultsSection({ detail }: AssessmentResultsSectionProps) {
  const qaItems: QaItemProps[] = detail
    ? [
        { question: '1. 상담 방문 이유', answer: detail.intakeAnswers.reasonForVisit },
        { question: '2. 상담을 통해 얻고 싶은 변화', answer: detail.intakeAnswers.expectedChange },
        { question: '3-1. 시도한 해결 방법', answer: detail.intakeAnswers.triedMethod },
        { question: '3-2. 방법 효과성', answer: detail.intakeAnswers.methodEffectiveness },
        { question: '4. 지금 가장 고민되는 문제', answer: detail.intakeAnswers.biggestConcern },
        { question: '5. 평균 수면 패턴', answer: detail.intakeAnswers.sleepPattern },
        { question: '5-1. 수면의 질', answer: detail.intakeAnswers.sleepQuality },
        { question: '6. 운동 정도와 빈도', answer: detail.intakeAnswers.exerciseHabit },
        { question: '7. 하루 끼니 수', answer: detail.intakeAnswers.mealsPerDay },
        { question: '8. 가장 의지하는 사람', answer: detail.intakeAnswers.mostReliablePerson },
        { question: '8-1. 의지하는 이유', answer: detail.intakeAnswers.reliabilityReason },
        { question: '9. 가족 유대감', answer: detail.intakeAnswers.familyBond },
        { question: '9-1. 그렇게 생각하는 이유', answer: detail.intakeAnswers.familyBondReason },
        { question: '10. 스스로를 한 문장으로 표현', answer: detail.intakeAnswers.selfDescription },
      ]
    : [];

  return (
    <section className="flex w-full flex-col gap-6 items-start">
      <h3 className="body-18 font-semibold text-neutral-20">평가 척도 결과</h3>
      {detail ? (
        <>
          <div className="grid w-full grid-cols-3 gap-3">
            <ScoreItem label="PHQ-9" score={detail.scaleResults.phq9} />
            <ScoreItem label="PSS-10" score={detail.scaleResults.pss10} />
            <ScoreItem label="MBI" score={detail.scaleResults.mbi} />
          </div>

          <div className="flex w-full flex-col items-start gap-[18px] px-5 py-6 rounded-2xl bg-white">
            {qaItems.map((item, index) => (
              <div key={item.question} className="flex w-full flex-col gap-[18px]">
                <QaItem question={item.question} answer={item.answer} />
                {index < qaItems.length - 1 ? <Divider /> : null}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="body-14 mt-2 text-label-alternative">아직 평가 척도 결과가 없습니다.</p>
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
