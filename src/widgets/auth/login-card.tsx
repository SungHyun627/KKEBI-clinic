'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { LoginForm } from '@/features/auth/ui/login-form';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { Button } from '@/shared/ui/button';
import { mockRequestPasswordResetEmail } from '@/features/auth/api/password-reset';

export function LoginCard() {
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isEmailSentOpen, setIsEmailSentOpen] = useState(false);

  function handlePasswordResetClose(nextOpen: boolean) {
    setIsPasswordResetOpen(nextOpen);
  }

  // 비밀번호 찾기 이메일 입력용 폼
  const emailForm = useForm<{ email: string }>({ defaultValues: { email: '' } });
  const watchedEmail = emailForm.watch('email');

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
          <LoginForm />
        </div>
      </div>

      <div className="flex items-center gap-3 text-[18px] leading-[28.8px] font-medium text-neutral-60">
        <button
          type="button"
          className="hover:text-label-normal text-inherit bg-transparent border-none p-0 cursor-pointer"
          onClick={() => setIsPasswordResetOpen(true)}
        >
          비밀번호 찾기
        </button>
        <span className="h-5 w-px bg-neutral-80" />
        <Link href="#" className="hover:text-label-normal">
          상담사 등록 문의
        </Link>
      </div>

      <Dialog open={isPasswordResetOpen} onOpenChange={handlePasswordResetClose}>
        <DialogContent className="flex max-w-[480px] p-7 md:p-6 flex-col justify-center items-center gap-[26px] rounded-[24px] bg-white">
          <DialogTitle className="absolute w-0 h-0 p-0 m-0 overflow-hidden">
            <VisuallyHidden>비밀번호 찾기</VisuallyHidden>
          </DialogTitle>
          <div className="flex flex-col w-full flex-shrink-0 flex-grow-0 items-start gap-[26px]">
            <div className="flex flex-col w-full items-start gap-[23px]">
              <div className="flex flex-col w-full justify-center items-start gap-[6px] self-stretch">
                <div className="flex w-full justify-between items-center">
                  <span className="text-lg font-semibold">비밀번호 찾기</span>
                  <button
                    type="button"
                    aria-label="닫기"
                    className="p-1 ml-2 hover:opacity-80 cursor-pointer"
                    onClick={() => setIsPasswordResetOpen(false)}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Image src="/icons/close.svg" alt="닫기" width={28} height={28} />
                  </button>
                </div>
                <span
                  className="font-pretendard text-[14px] font-normal leading-[21px]"
                  style={{
                    color: 'var(--Semantic-Neutral-30, var(--Neutral-30, #474747))',
                    fontStyle: 'normal',
                  }}
                >
                  등록된 이메일 주소를 입력하시면
                  <br />
                  비밀번호 재설정 링크를 보내드립니다.
                </span>
              </div>
              <div className="w-full">
                <Form {...emailForm}>
                  <FormField
                    control={emailForm.control}
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
                            onClear={() => emailForm.setValue('email', '')}
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
                </Form>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-3 min-w-0 shrink-0 basis-[35.3%] md:w-30 sm:w-full"
                onClick={() => setIsPasswordResetOpen(false)}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="default"
                size="lg"
                className="min-w-0 flex-1 basis-[64.7%]"
                disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail)}
                onClick={async () => {
                  const email = emailForm.getValues('email');
                  const res = await mockRequestPasswordResetEmail(email);
                  if (res.success) {
                    setIsPasswordResetOpen(false);
                    setIsEmailSentOpen(true);
                  }
                }}
              >
                재설정 링크 발송
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isEmailSentOpen} onOpenChange={setIsEmailSentOpen}>
        <DialogContent className="flex max-w-[480px] p-7 md:p-6 flex-col justify-center items-center gap-[26px] rounded-[24px] bg-white">
          <DialogTitle className="absolute w-0 h-0 p-0 m-0 overflow-hidden">
            <VisuallyHidden>이메일 발송 완료</VisuallyHidden>
          </DialogTitle>
          <div className="flex flex-col w-full flex-shrink-0 flex-grow-0 items-center gap-[26px]">
            <div className="flex flex-col w-full items-center gap-[28px]">
              <div className="flex w-full justify-between items-center">
                <span className="font-pretendard text-[20px] font-semibold leading-[30px] text-center">
                  이메일 발송 완료
                </span>
                <button
                  type="button"
                  aria-label="닫기"
                  className="p-1 ml-2 hover:opacity-80 cursor-pointer"
                  onClick={() => setIsEmailSentOpen(false)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Image src="/icons/close.svg" alt="닫기" width={28} height={28} />
                </button>
              </div>
              <div className="flex flex-col w-full items-center gap-[23px]">
                <Image src="/images/checkmark.png" alt="발송 완료" width={120} height={120} />
                <div className="flex flex-col w-full items-center gap-[6px]">
                  <span className="font-pretendard text-[18px] font-semibold leading-[28.8px] text-center text-label-strong">
                    kkebi@naver.com
                  </span>
                  <span className="font-pretendard text-[14px] font-normal leading-[21px] text-center text-neutral-30">
                    (으)로 비밀번호 재설정 링크가 발송되었습니다.
                    <br />
                    안내된 메일에 따라 비밀번호 재설정을 완료해 주세요.
                  </span>
                </div>
              </div>
              <div className="flex flex-col w-full items-start justify-center px-3 py-4 gap-[6px] rounded-2xl bg-neutral-99">
                <p className="body-14 text-neutral-50">
                  • 이메일이 도착하지 않았다면 스팸 폴더를 확인해 주세요.
                </p>
                <p className="body-14 text-neutral-50">• 링크는 24시간 동안 유효합니다.</p>
              </div>
            </div>

            <Button
              type="button"
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => setIsEmailSentOpen(false)}
            >
              로그인으로 돌아가기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
