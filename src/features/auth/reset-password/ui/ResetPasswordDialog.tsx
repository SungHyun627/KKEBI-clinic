'use client';

import { Form, FormField, FormItem, FormLabel, FormControl } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { mockResetPassword } from '../api/reset-password';
import { useForm, useWatch } from 'react-hook-form';
interface ResetPasswordDialogProps {
  isOpen: boolean;
  handleDialogOpen: (open: boolean) => void;
  setSentEmail: (email: string) => void;
  setIsEmailSentOpen: (open: boolean) => void;
}

const ResetPasswordDialog = ({
  isOpen,
  handleDialogOpen,
  setSentEmail,
  setIsEmailSentOpen,
}: ResetPasswordDialogProps) => {
  const emailForm = useForm<{ email: string }>({ defaultValues: { email: '' } });
  const watchedEmail = useWatch({ control: emailForm.control, name: 'email' });

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
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
                  onClick={() => handleDialogOpen(false)}
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
              onClick={() => handleDialogOpen(false)}
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
                const res = await mockResetPassword(email);
                if (res.success) {
                  setSentEmail(email);
                  handleDialogOpen(false);
                  setIsEmailSentOpen(true);
                  emailForm.reset({ email: '' });
                }
              }}
            >
              재설정 링크 발송
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
