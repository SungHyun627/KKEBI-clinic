'use client';

import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import type { PaymentInfoFormValues } from '@/features/clients/client-registration/types/client-registration';
import { cn } from '@/shared/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

const PAYMENT_OPTIONS = [
  { labelKey: 'privatePay', value: 'private-pay' },
  { labelKey: 'insurance', value: 'insurance' },
] as const;

interface ClientRegistrationPaymentInfoFormProps {
  form: UseFormReturn<PaymentInfoFormValues>;
}

const ClientRegistrationPaymentInfoForm = ({ form }: ClientRegistrationPaymentInfoFormProps) => {
  const t = useTranslations('clientRegistration.paymentInfo');
  const paymentType = form.watch('paymentType');
  const isInsurance = paymentType === 'insurance';

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">{t('title')}</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="paymentType"
            rules={{ required: t('errors.paymentTypeRequired') }}
            render={() => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel required className="body-14 font-medium text-label-normal">
                  {t('fields.paymentType')}
                </FormLabel>
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
                            shouldValidate: false,
                          });
                          if (option.value !== 'insurance') {
                            form.setValue('insuranceCompany', '', { shouldValidate: false });
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
                          {t(`paymentOptions.${option.labelKey}`)}
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
                  return Boolean(value.trim()) || t('errors.insuranceCompanyRequired');
                },
              }}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2">
                  <FormLabel required className="body-14 font-medium text-label-normal">
                    {t('fields.insuranceCompany')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('placeholders.insuranceCompany')} />
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
