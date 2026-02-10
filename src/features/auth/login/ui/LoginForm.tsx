'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFailDialog } from './LoginFailDialog';
import { useForm } from 'react-hook-form';
import { login } from '../api/login';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/toast';
import { LoginFormValues } from '../types/loginForm';

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login({ email: values.email, password: values.password });
    if (result.success) {
      // 로그인 상태 유지 체크박스 값은 keepSignedIn에서 관리
      // 필요시 localStorage 등으로 저장 가능
      router.push('/login/verify');
      return;
    }
    setIsLoginFailed(true);
  };

  const onInvalid = () => {
    const { errors } = form.formState;
    if (errors.email) {
      toast('아이디를 다시 한번 확인해주세요.');
      return;
    }
    if (errors.password) {
      toast('비밀번호를 다시 한번 확인해주세요.');
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="w-full flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          noValidate
        >
          <div className="flex flex-col gap-8">
            <h2 className="text-center text-[20px] leading-[30px] font-semibold text-label-normal">
              로그인
            </h2>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: '아이디를 다시 한번 확인해주세요.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '아이디를 다시 한번 확인해주세요.',
                  },
                }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
                      이메일
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@kkebi.com"
                        {...field}
                        onClear={() => form.setValue('email', '')}
                        icon={
                          <div
                            className="h-6 w-6 bg-current"
                            style={{
                              maskImage: 'url(/icons/mail.svg)',
                              WebkitMaskImage: 'url(/icons/mail.svg)',
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
                name="password"
                rules={{
                  required: '비밀번호를 다시 한번 확인해주세요.',
                  maxLength: {
                    value: 14,
                    message: '비밀번호를 다시 한번 확인해주세요.',
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                    message: '비밀번호를 다시 한번 확인해주세요.',
                  },
                }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
                      비밀번호
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder="비밀번호를 입력해주세요"
                        {...field}
                        onClear={() => form.setValue('password', '')}
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
            </div>
          </div>

          {/* 로그인 상태 유지 체크박스: form 상태와 분리 */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="keepSignedIn"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="h-4 w-4 rounded border border-neutral-95 bg-neutral-95 transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            />
            <label
              htmlFor="keepSignedIn"
              className="text-[14px] leading-[21px] font-normal text-label-neutral"
            >
              로그인 상태 유지
            </label>
          </div>

          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </Form>
      <LoginFailDialog open={isLoginFailed} onOpenChange={setIsLoginFailed} />
    </>
  );
}
