'use client';

import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import type { KkebiNicknameFormValues } from '@/features/clients/types/client-registration';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

interface ClientRegistrationKkebiNicknameFormProps {
  form: UseFormReturn<KkebiNicknameFormValues>;
}

const ClientRegistrationKkebiNicknameForm = ({
  form,
}: ClientRegistrationKkebiNicknameFormProps) => {
  const t = useTranslations('clientRegistration.kkebiNickname');

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">{t('title')}</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="kkebiNickname"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">
                  {t('field')}
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('placeholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
};

export default ClientRegistrationKkebiNicknameForm;
