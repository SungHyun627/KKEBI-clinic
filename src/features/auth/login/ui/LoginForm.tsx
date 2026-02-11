'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFailDialog } from './LoginFailDialog';
import { useForm } from 'react-hook-form';
import { login } from '../api/login';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/toast';
import { LoginForm as LoginFromFields } from '../types/login';
import { getInitialLoginInfo } from '../lib/getInitialLoginInfo';

const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [saveLoginInfo, setSaveLoginInfo] = useState(getInitialLoginInfo().saveLoginInfo || false);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const form = useForm<LoginFromFields>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('kkebi-login-info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.saveLoginInfo) {
          form.setValue('email', parsed.email || '');
          form.setValue('password', parsed.password || '');
        }
      } catch {}
    }
  }, [form]);

  const onSubmit = async (values: LoginFromFields) => {
    const result = await login({ email: values.email, password: values.password });
    if (result.success) {
      if (saveLoginInfo) {
        localStorage.setItem(
          'kkebi-login-info',
          JSON.stringify({
            saveLoginInfo: true,
            email: values.email,
            password: values.password,
          }),
        );
      } else {
        localStorage.removeItem('kkebi-login-info');
      }
      router.push('/login/2fa');
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
                  <FormItem className="flex flex-col gap-2">
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
                  <FormItem className="flex flex-col gap-2">
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
          <label className="flex items-center gap-[6px] body-14 text-label-neutral">
            <span className="relative flex h-4 w-4 items-center justify-center">
              <input
                ref={checkboxRef}
                type="checkbox"
                className="peer h-4 w-4 appearance-none rounded-[4px] border border-neutral-95 bg-neutral-95 transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                checked={saveLoginInfo}
                onChange={(e) => setSaveLoginInfo(e.target.checked)}
              />
              <svg
                className="pointer-events-none absolute text-white opacity-100 transition-opacity"
                width="9.589"
                height="6.393"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1 5L4.5 8.5L11 1.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            로그인 상태 유지
          </label>
          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </Form>
      <LoginFailDialog open={isLoginFailed} onOpenChange={setIsLoginFailed} />
    </>
  );
};

export default LoginForm;
