'use client';

import { UseFormReturn } from 'react-hook-form';
import type { IntakeInterviewFormValues } from '@/features/clients/types/client-registration';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

const MAX_INTAKE_INPUT_LENGTH = 1000;

const INTAKE_QUESTIONS: Array<{ name: keyof IntakeInterviewFormValues; label: string }> = [
  { name: 'reasonForVisit', label: '1. 상담 방문 이유' },
  { name: 'mostImportantChange', label: '2. 상담을 통해 얻고 싶은 가장 중요한 변화' },
  { name: 'similarPastExperience', label: '3. 과거 비슷한 어려움 경험 유무' },
  { name: 'attemptedSolution', label: '3-1. 당시 해결을 위해서 시도한 방법' },
  { name: 'attemptedSolutionEffectiveness', label: '3-2. 방법의 효과성 정도' },
  { name: 'currentBiggestConcern', label: '4. 지금 가장 고민되는 문제' },
  { name: 'averageSleepPattern', label: '5. 평균 수면 패턴' },
  { name: 'sleepQuality', label: '5-1. 수면의 질' },
  { name: 'exerciseTypeAndFrequency', label: '6. 하고 있는 운동의 종류와 빈도' },
  { name: 'mealsPerDay', label: '7. 하루에 섭취하는 끼니 수' },
  { name: 'mostReliablePerson', label: '8. 가장 의지하는 사람' },
  { name: 'reasonForReliance', label: '8-1. 그 사람을 가장 의지하는 이유' },
  { name: 'familyBond', label: '9. 가족과의 유대감' },
  { name: 'reasonForFamilyBond', label: '9-1. 그렇게 생각한 이유' },
  { name: 'selfDescriptionSentence', label: '10. 스스로를 한 문장으로 표현' },
];

interface ClientRegistrationIntakeInterviewFormProps {
  form: UseFormReturn<IntakeInterviewFormValues>;
}

const ClientRegistrationIntakeInterviewForm = ({
  form,
}: ClientRegistrationIntakeInterviewFormProps) => {
  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">접수면접 결과</h2>
        <div className="flex w-full">
          <Button
            disabled
            type="button"
            size="sm"
            className="h-[34px] rounded-[8px] px-3 bg-[rgba(250,84,84,0.10)] text-primary hover:bg-[rgba(178, 60, 60, 0.10)] hover:text-primary-dark disabled:bg-label-disable disabled:text-white"
          >
            사진으로 업로드 하기
          </Button>
        </div>
        <div className="flex w-full flex-col items-start gap-5">
          {INTAKE_QUESTIONS.map((question) => (
            <FormField
              key={question.name}
              control={form.control}
              name={question.name}
              rules={{
                maxLength: {
                  value: MAX_INTAKE_INPUT_LENGTH,
                  message: `최대 ${MAX_INTAKE_INPUT_LENGTH}자까지 입력할 수 있습니다.`,
                },
              }}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2">
                  <FormLabel className="body-14 font-medium text-label-normal">
                    {question.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="내용을 입력해 주세요."
                      maxLength={MAX_INTAKE_INPUT_LENGTH}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </Form>
  );
};

export default ClientRegistrationIntakeInterviewForm;
