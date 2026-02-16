'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/toast';
import { ResetPasswordFields } from '../types/resetPassword';

const ResetPasswordForm = () => {
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const router = useRouter();
  const form = useForm<ResetPasswordFields>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFields) => {
    if (values.newPassword !== values.confirmPassword) {
      toast(tAuth('errorPasswordMismatch'));
      return;
    }
    // TODO: 실제 비밀번호 재설정 API 연동
    router.push('/login');
  };

  const onInvalid = () => {
    const { errors } = form.formState;
    if (errors.newPassword) {
      toast(errors.newPassword.message || tAuth('errorNewPasswordRequired'));
      return;
    }
    if (errors.confirmPassword) {
      toast(errors.confirmPassword.message || tAuth('errorConfirmPasswordRequired'));
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        noValidate
      >
        <div className="flex flex-col gap-8">
          <h2 className="text-center text-[20px] leading-[30px] font-semibold text-label-normal">
            {tAuth('resetPasswordResetTitle')}
          </h2>
          <div className="flex flex-col items-start gap-6 w-full">
            <div className="flex flex-col gap-4 w-full">
              <FormField
                control={form.control}
                name="newPassword"
                rules={{
                  required: tAuth('errorNewPasswordRequired'),
                  minLength: {
                    value: 1,
                    message: tAuth('errorNewPasswordMinLength'),
                  },
                  maxLength: {
                    value: 14,
                    message: tAuth('errorNewPasswordMaxLength'),
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,14}$/,
                    message: tAuth('errorNewPasswordPattern'),
                  },
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
                      {tAuth('resetNewPasswordLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder={tAuth('resetNewPasswordPlaceholder')}
                        {...field}
                        onClear={() => form.setValue('newPassword', '')}
                        rightIcon={
                          <div
                            className="h-6 w-6 bg-neutral-20"
                            style={{
                              maskImage: `url(${isPasswordVisible ? '/icons/eye.svg' : '/icons/eyeoff.svg'})`,
                              WebkitMaskImage: `url(${isPasswordVisible ? '/icons/eye.svg' : '/icons/eyeoff.svg'})`,
                              maskSize: 'contain',
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                            }}
                          />
                        }
                        onRightIconClick={() => setIsPasswordVisible((prev) => !prev)}
                        icon={
                          <div
                            className="h-6 w-6 bg-current"
                            style={{
                              maskImage: 'url(/icons/lock.svg)',
                              WebkitMaskImage: 'url(/icons/lock.svg)',
                              maskSize: 'contain',
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                            }}
                          />
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: tAuth('errorConfirmPasswordRequired'),
                  validate: (value) =>
                    value === form.getValues('newPassword') || tAuth('errorPasswordMismatch'),
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
                      {tAuth('resetConfirmPasswordLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                        placeholder={tAuth('resetConfirmPasswordPlaceholder')}
                        {...field}
                        onClear={() => form.setValue('confirmPassword', '')}
                        rightIcon={
                          <div
                            className="h-6 w-6 bg-neutral-20"
                            style={{
                              maskImage: `url(${isConfirmPasswordVisible ? '/icons/eye.svg' : '/icons/eyeoff.svg'})`,
                              WebkitMaskImage: `url(${isConfirmPasswordVisible ? '/icons/eye.svg' : '/icons/eyeoff.svg'})`,
                              maskSize: 'contain',
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                            }}
                          />
                        }
                        onRightIconClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                        icon={
                          <div
                            className="h-6 w-6 bg-current"
                            style={{
                              maskImage: 'url(/icons/lock.svg)',
                              WebkitMaskImage: 'url(/icons/lock.svg)',
                              maskSize: 'contain',
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                            }}
                          />
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <span className="body-14 text-label-alternative">{tAuth('resetPasswordRule')}</span>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!form.watch('newPassword') || !form.watch('confirmPassword')}
        >
          {tCommon('change')}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
