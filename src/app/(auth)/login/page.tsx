'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { login } from '@/features/auth/api/login';

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login({ email: values.email, password: values.password });
    if (result.ok) {
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
    <div className="w-full max-w-[480px] shrink-0 flex flex-col items-center gap-[45px] bg-white">
      <div className="w-full flex flex-col items-center gap-[35px]">
        <div className="flex flex-col items-center gap-3">
          <Image src="/images/logo.png" alt="KKEBI" width={88} height={88} />
          <h1 className="text-center text-[24px] leading-[30px] font-semibold text-label-normal">
            KKEBI for Counselor
          </h1>
        </div>

        <div className="w-full rounded-[24px] bg-neutral-99 p-8">
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

              <div className="flex flex-col gap-8">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <label className="flex items-center gap-2 text-[14px] leading-[21px] font-normal text-label-neutral">
                          <span className="relative flex h-4 w-4 items-center justify-center">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(event) => field.onChange(event.target.checked)}
                              className="peer h-4 w-4 appearance-none rounded-[4px] border border-neutral-95 bg-neutral-95 transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
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
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  로그인
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[18px] leading-[28.8px] font-medium text-neutral-60">
        <Link href="#" className="hover:text-label-normal">
          비밀번호 찾기
        </Link>
        <span className="h-5 w-px bg-neutral-80" />
        <Link href="#" className="hover:text-label-normal">
          상담사 등록 문의
        </Link>
      </div>

      <Dialog open={isLoginFailed} onOpenChange={setIsLoginFailed}>
        <DialogContent>
          <DialogTitle>
            <VisuallyHidden>로그인 실패</VisuallyHidden>
          </DialogTitle>
          <div className="flex w-full flex-col items-center gap-6">
            <DialogHeader>
              <p className="text-[14px] leading-[21px] font-normal text-neutral-40">로그인 실패</p>
              <p className="text-[18px] leading-[28.8px] font-semibold text-neutral-0">
                관리자 계정 정보가 없습니다.
              </p>
            </DialogHeader>
            <Button type="button" className="w-full" onClick={() => setIsLoginFailed(false)}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
