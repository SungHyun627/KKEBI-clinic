'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/toast';
import { ResetPasswordFields } from '../types/resetPassword';

const ResetPasswordForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const form = useForm<ResetPasswordFields>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFields) => {
    if (values.newPassword !== values.confirmPassword) {
      toast('비밀번호가 일치하지 않습니다.');
      return;
    }
    // TODO: 실제 비밀번호 재설정 API 연동
    router.push('/login');
  };

  const onInvalid = () => {
    const { errors } = form.formState;
    if (errors.newPassword) {
      toast(errors.newPassword.message || '새 비밀번호를 입력해주세요.');
      return;
    }
    if (errors.confirmPassword) {
      toast(errors.confirmPassword.message || '비밀번호 확인을 입력해주세요.');
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
            비밀번호 재설정
          </h2>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="newPassword"
              rules={{
                required: '새 비밀번호를 입력해주세요.',
                minLength: {
                  value: 1,
                  message: '1자 이상 입력해주세요.',
                },
                maxLength: {
                  value: 14,
                  message: '14자 이하로 입력해주세요.',
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,14}$/,
                  message: '영문+숫자가 포함된 14자리 이내여야 합니다.',
                },
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
                    새 비밀번호
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={isPasswordVisible ? 'text' : 'password'}
                      placeholder="새 비밀번호를 입력해주세요"
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
                required: '비밀번호 확인을 입력해주세요.',
                validate: (value) =>
                  value === form.getValues('newPassword') || '비밀번호가 일치하지 않습니다.',
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
                    새 비밀번호 확인
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력해주세요"
                      {...field}
                      onClear={() => form.setValue('confirmPassword', '')}
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
        </div>
        <Button type="submit" className="w-full">
          비밀번호 재설정
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
