'use client';

import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import type { IntakeInterviewFormValues } from '@/features/clients/types/client-registration';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

const MAX_INTAKE_INPUT_LENGTH = 1000;

const INTAKE_QUESTIONS: Array<{ name: keyof IntakeInterviewFormValues; key: string }> = [
  { name: 'reasonForVisit', key: 'reasonForVisit' },
  { name: 'mostImportantChange', key: 'mostImportantChange' },
  { name: 'similarPastExperience', key: 'similarPastExperience' },
  { name: 'attemptedSolution', key: 'attemptedSolution' },
  { name: 'attemptedSolutionEffectiveness', key: 'attemptedSolutionEffectiveness' },
  { name: 'currentBiggestConcern', key: 'currentBiggestConcern' },
  { name: 'averageSleepPattern', key: 'averageSleepPattern' },
  { name: 'sleepQuality', key: 'sleepQuality' },
  { name: 'exerciseTypeAndFrequency', key: 'exerciseTypeAndFrequency' },
  { name: 'mealsPerDay', key: 'mealsPerDay' },
  { name: 'mostReliablePerson', key: 'mostReliablePerson' },
  { name: 'reasonForReliance', key: 'reasonForReliance' },
  { name: 'familyBond', key: 'familyBond' },
  { name: 'reasonForFamilyBond', key: 'reasonForFamilyBond' },
  { name: 'selfDescriptionSentence', key: 'selfDescriptionSentence' },
];

interface ClientRegistrationIntakeInterviewFormProps {
  form: UseFormReturn<IntakeInterviewFormValues>;
}

const ClientRegistrationIntakeInterviewForm = ({
  form,
}: ClientRegistrationIntakeInterviewFormProps) => {
  const t = useTranslations('clientRegistration.intakeInterview');

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">{t('title')}</h2>
        <div className="flex w-full">
          <Button
            disabled
            type="button"
            size="sm"
            className="h-[34px] rounded-[8px] px-3 bg-[rgba(250,84,84,0.10)] text-primary hover:bg-[rgba(178, 60, 60, 0.10)] hover:text-primary-dark disabled:bg-label-disable disabled:text-white"
          >
            {t('actions.uploadByPhoto')}
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
                  message: t('errors.maxLength', { count: MAX_INTAKE_INPUT_LENGTH }),
                },
              }}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2">
                  <FormLabel className="body-14 font-medium text-label-normal">
                    {t(`questions.${question.key}`)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder={t('placeholders.content')}
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
