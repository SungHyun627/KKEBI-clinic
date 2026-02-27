'use client';

import { useMemo, useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import type { AssessmentResultsFormValues } from '@/features/clients/types/client-registration';
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
        <h2 className="text-[24px] font-semibold text-label-strong">검사 결과</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="phq9Score"
            rules={{ required: 'PHQ-9 우울 척도 점수를 입력해 주세요.' }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  PHQ-9 우울 척도 점수
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
                    placeholder="PHQ-9 우울 척도 점수를 입력해 주세요."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pss10Score"
            rules={{ required: 'PSS-10 스트레스 척도 점수를 입력해 주세요.' }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  PSS-10 스트레스 척도 점수
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
                    placeholder="PSS-10 척도 점수를 입력해 주세요."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mbiScore"
            rules={{ required: 'MBI 소진 척도 점수를 입력해 주세요.' }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  MBI 소진 척도 점수
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
                    placeholder="MBI 척도 점수를 입력해 주세요."
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
                rules={{ required: `${item.testName} 결과를 입력해 주세요.` }}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <div className="flex w-full items-center justify-between gap-2">
                      <FormLabel required className="body-14 font-medium text-label-normal">
                        {item.testName}
                      </FormLabel>
                      <button
                        type="button"
                        aria-label={`${item.testName} 삭제`}
                        className="flex h-6 w-6 items-center justify-center text-label-assistive transition-colors hover:cursor-pointer hover:text-label-normal"
                        onClick={() => remove(index)}
                      >
                        <Image src="/icons/trash.svg" alt="Delete" width={24} height={24} />
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
                        placeholder={`${item.testName} 결과를 입력해 주세요.`}
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
                      검사명을 입력해 주세요
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="검사명을 입력해 주세요." />
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
                  취소
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
                  저장
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
            <Image src="/icons/plus.svg" alt="Add" width={24} height={24} />
            <span className="text-primary body-16 font-semibold leading-[160%]">검사 추가하기</span>
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ClientRegistrationAssessmentResultsForm;
