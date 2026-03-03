'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import type { AssessmentResultsFormValues } from '@/features/clients/client-registration/types/client-registration';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';

interface ClientRegistrationAssessmentResultsFormProps {
  form: UseFormReturn<AssessmentResultsFormValues>;
}

const ClientRegistrationAssessmentResultsForm = ({
  form,
}: ClientRegistrationAssessmentResultsFormProps) => {
  const t = useTranslations('clientRegistration.assessmentResults');
  const [isAddingAdditionalResult, setIsAddingAdditionalResult] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'additionalResults',
  });
  const draftTestName = form.watch('draftTestName');
  const isDraftInputValid = useMemo(() => Boolean(draftTestName?.trim()), [draftTestName]);
  const parseNumericInput = (value: string): number | null => {
    if (!value.trim()) return null;
    if (!/^\d+$/.test(value)) return null;
    return Number(value);
  };

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">{t('title')}</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="phq9Score"
            rules={{ required: t('errors.phq9Required') }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  {t('fields.phq9Score')}
                </FormLabel>
                <FormControl>
                  <Input
                    value={field.value === null ? '' : String(field.value)}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      if (nextValue !== '' && !/^\d+$/.test(nextValue)) return;
                      field.onChange(parseNumericInput(nextValue));
                    }}
                    inputMode="numeric"
                    placeholder={t('placeholders.phq9Score')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pss10Score"
            rules={{ required: t('errors.pss10Required') }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  {t('fields.pss10Score')}
                </FormLabel>
                <FormControl>
                  <Input
                    value={field.value === null ? '' : String(field.value)}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      if (nextValue !== '' && !/^\d+$/.test(nextValue)) return;
                      field.onChange(parseNumericInput(nextValue));
                    }}
                    inputMode="numeric"
                    placeholder={t('placeholders.pss10Score')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mbiScore"
            rules={{ required: t('errors.mbiRequired') }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  {t('fields.mbiScore')}
                </FormLabel>
                <FormControl>
                  <Input
                    value={field.value === null ? '' : String(field.value)}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      if (nextValue !== '' && !/^\d+$/.test(nextValue)) return;
                      field.onChange(parseNumericInput(nextValue));
                    }}
                    inputMode="numeric"
                    placeholder={t('placeholders.mbiScore')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((item, index) => (
            <div key={item.id} className="flex w-full flex-col gap-5">
              <FormField
                control={form.control}
                name={`additionalResults.${index}.testResult`}
                rules={{
                  required: t('errors.additionalResultRequired', { testName: item.testName }),
                }}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <div className="flex w-full items-center justify-between gap-2">
                      <FormLabel required className="body-14 font-medium text-label-normal">
                        {item.testName}
                      </FormLabel>
                      <button
                        type="button"
                        aria-label={t('aria.deleteAdditionalResult', { testName: item.testName })}
                        className="flex h-6 w-6 items-center justify-center text-label-assistive transition-colors hover:cursor-pointer hover:text-label-normal"
                        onClick={() => remove(index)}
                      >
                        <Image
                          src="/icons/trash.svg"
                          alt={t('alt.delete')}
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
                    <FormControl>
                      <Input
                        value={field.value === null ? '' : String(field.value)}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          if (nextValue !== '' && !/^\d+$/.test(nextValue)) return;
                          field.onChange(parseNumericInput(nextValue));
                        }}
                        inputMode="numeric"
                        placeholder={t('placeholders.additionalResult', {
                          testName: item.testName,
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          {isAddingAdditionalResult ? (
            <div className="flex w-full flex-col gap-3">
              <FormField
                control={form.control}
                name="draftTestName"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <FormLabel className="body-14 font-medium text-label-normal">
                      {t('fields.draftTestName')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('placeholders.draftTestName')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-[49px] h-[34px] rounded-[12px] px-4 py-[6px] font-semibold text-label-neutral"
                  onClick={() => {
                    form.setValue('draftTestName', '', { shouldDirty: true });
                    setIsAddingAdditionalResult(false);
                  }}
                >
                  {t('actions.cancel')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="w-[49px] h-[34px] rounded-[12px] px-4 text-primary bg-[rgba(250,84,84,0.10)] py-[6px] hover:bg-neutral-99 disabled:text-neutral-99"
                  disabled={!isDraftInputValid}
                  onClick={() => {
                    append({
                      testName: draftTestName.trim(),
                      testResult: null,
                    });
                    form.setValue('draftTestName', '', { shouldDirty: true });
                    setIsAddingAdditionalResult(false);
                  }}
                >
                  {t('actions.save')}
                </Button>
              </div>
            </div>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex w-full gap-[6px] border-primary active:bg-[rgba(250,84,84,0.10)]"
            onClick={() => setIsAddingAdditionalResult(true)}
          >
            <Image src="/icons/plus.svg" alt={t('alt.add')} width={24} height={24} />
            <span className="text-primary body-16 font-semibold leading-[160%]">
              {t('actions.addTest')}
            </span>
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ClientRegistrationAssessmentResultsForm;
