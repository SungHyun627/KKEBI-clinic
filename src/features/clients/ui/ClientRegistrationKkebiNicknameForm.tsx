'use client';

import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

export type KkebiNicknameFormValues = {
  kkebiNickname: string;
};

interface ClientRegistrationKkebiNicknameFormProps {
  form: UseFormReturn<KkebiNicknameFormValues>;
}

const ClientRegistrationKkebiNicknameForm = ({
  form,
}: ClientRegistrationKkebiNicknameFormProps) => {
  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
        <h2 className="text-[24px] font-semibold text-label-strong">KKEBI 닉네임</h2>
        <div className="flex w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="kkebiNickname"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-14 font-medium text-label-normal">
                  KKEBI 닉네임 입력
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="닉네임을 입력해 주세요." />
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
