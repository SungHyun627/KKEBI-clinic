'use client';

import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/shared/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

const PAYMENT_OPTIONS = [
  { label: '자비 부담', value: 'private-pay' },
  { label: '보험 적용', value: 'insurance' },
];

export type PaymentInfoFormValues = {
  paymentType: string;
  insuranceCompany: string;
};

interface ClientRegistrationPaymentInfoFormProps {
  form: UseFormReturn<PaymentInfoFormValues>;
}

const ClientRegistrationPaymentInfoForm = ({ form }: ClientRegistrationPaymentInfoFormProps) => {
  const paymentType = form.watch('paymentType');
  const isInsurance = paymentType === 'insurance';

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">보험/결제 정보 선택</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="paymentType"
            render={() => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">결제 유형</FormLabel>
                <div className="flex w-full gap-2">
                  {PAYMENT_OPTIONS.map((option) => {
                    const isSelected = paymentType === option.value;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => {
                          form.setValue('paymentType', option.value, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                          if (option.value !== 'insurance') {
                            form.setValue('insuranceCompany', '', { shouldValidate: true });
                          }
                        }}
                        className={cn(
                          'flex h-[66px] w-full items-center justify-center gap-2 rounded-[16px] border p-5 hover:cursor-pointer hover:bg-neutral-95',
                          isSelected ? 'border-primary bg-fill-pressed' : 'border-neutral-95',
                        )}
                      >
                        <span
                          className={cn(
                            'body-16 text-center font-medium',
                            isSelected ? 'text-primary' : 'text-label-alternative',
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {isInsurance ? (
            <FormField
              control={form.control}
              name="insuranceCompany"
              rules={{
                validate: (value) => {
                  if (!isInsurance) return true;
                  return Boolean(value.trim()) || '보험사명을 입력해 주세요.';
                },
              }}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2">
                  <FormLabel required className="body-14 font-medium text-label-normal">
                    보험사명
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="보험사명을 입력해 주세요." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
      </div>
    </Form>
  );
};

export default ClientRegistrationPaymentInfoForm;
