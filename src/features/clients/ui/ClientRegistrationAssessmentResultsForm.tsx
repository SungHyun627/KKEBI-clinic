'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import type { AssessmentResultsFormValues } from '@/features/clients/types/client-registration';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

interface ClientRegistrationAssessmentResultsFormProps {
  form: UseFormReturn<AssessmentResultsFormValues>;
}

const ClientRegistrationAssessmentResultsForm = ({
  form,
}: ClientRegistrationAssessmentResultsFormProps) => {
  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'additionalResults',
  });

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">검사 결과</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="phq9Score"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">
                  PHQ-9 우울 척도 점수
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="PHQ-9 우울 척도 점수를 입력해 주세요." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pss10Score"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">
                  PSS-10 척도 점수
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="PSS-10 척도 점수를 입력해 주세요." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mbiScore"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">
                  MBI 척도 점수
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="MBI 척도 점수를 입력해 주세요." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((item, index) => (
            <div key={item.id} className="flex w-full flex-col gap-5 rounded-2xl bg-neutral-99 p-4">
              <FormField
                control={form.control}
                name={`additionalResults.${index}.testName`}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <FormLabel className="body-14 font-medium text-label-normal">검사명</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="검사명을 입력해 주세요." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`additionalResults.${index}.testResult`}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <FormLabel className="body-14 font-medium text-label-normal">
                      검사 결과
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="검사 결과를 입력해 주세요." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 rounded-xl px-4"
            onClick={() => append({ testName: '', testResult: '' })}
          >
            <span className="text-base leading-none">+</span>
            검사 결과 추가
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ClientRegistrationAssessmentResultsForm;
