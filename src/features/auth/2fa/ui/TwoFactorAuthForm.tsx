'use client';

import { useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import TwoFactorCode from './TwoFactorCode';
import { resend2FA, verify2FA } from '../api/2fa';
import { toast } from '@/shared/ui/toast';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import TwoFactorAuthFailDialog from './TwoFactorAuthFailDialog';
import { setAuthSessionAuthenticated } from '@/features/auth/login/lib/authSession';
import { useTranslations } from 'next-intl';

interface TwofactorAuthFormValues {
  code: string;
}

const TwoFactorAuthForm = () => {
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const form = useForm<TwofactorAuthFormValues>({
    defaultValues: { code: '' },
  });
  const code = useWatch({ control: form.control, name: 'code' });
  const codeArr = (code ?? '').split('');

  const [isVerifyFailed, setIsVerifyFailed] = useState(false);
  const handleVerify = async () => {
    if (!(code && code.length === 6 && /^[0-9]{6}$/.test(code))) return;
    const result = await verify2FA({ code });
    if (result.ok) {
      setAuthSessionAuthenticated(true);
      router.push('/');
    } else {
      setIsVerifyFailed(true);
    }
  };

  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    if (!val) return;
    let arr = codeArr.slice();
    arr[idx] = val;
    arr = arr.slice(0, 6);
    form.setValue('code', arr.join(''));
    if (idx < 5 && val) {
      const next = document.getElementById(`code-input-${idx + 1}`) as HTMLInputElement;
      if (next) next.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const arr = codeArr.slice();
      if (arr[idx]) {
        arr[idx] = '';
        form.setValue('code', arr.join(''));
      } else if (idx > 0) {
        arr[idx - 1] = '';
        form.setValue('code', arr.join(''));
        const prev = document.getElementById(`code-input-${idx - 1}`) as HTMLInputElement;
        if (prev) prev.focus();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-10.5 w-full">
        <Form {...form}>
          <div
            className="flex flex-col justify-center items-center rounded-full bg-white"
            style={{ width: 83, height: 84, padding: '18px 17px 18px 18px' }}
          >
            <Image src="/icons/phone.svg" alt="phone" width={47} height={48} />
          </div>

          <form
            className="w-full flex flex-col gap-6 items-center"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              void handleVerify();
            }}
          >
            <TwoFactorCode codeArr={codeArr} onChange={handleChange} onKeyDown={handleKeyDown} />

            <div className="flex flex-col items-center gap-4.5 w-full">
              <div className="flex items-center gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-center gap-3 min-w-0 shrink-0 basis-[35.3%] md:w-30 sm:w-full"
                  onClick={() => router.push('/login')}
                >
                  {tCommon('back')}
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="min-w-0 flex-1 basis-[64.7%]"
                  disabled={!(code && code.length === 6 && /^[0-9]{6}$/.test(code))}
                >
                  {tCommon('verify')}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 w-full text-center">
                <span className="text-[16px] leading-[25.6px] font-normal font-pretendard text-label-alternative">
                  {tAuth('otpNotReceived')}
                </span>
                <span
                  className="text-[16px] leading-[25.6px] font-semibold font-pretendard text-primary cursor-pointer"
                  onClick={async () => {
                    const result = await resend2FA();
                    if (result.ok) {
                      toast(result.message || '새 인증 코드가 발송되었습니다.');
                    } else {
                      toast('인증 코드 발송에 실패했습니다.');
                    }
                  }}
                >
                  {tCommon('resendCode')}
                </span>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <TwoFactorAuthFailDialog
        open={isVerifyFailed}
        onOpenChange={setIsVerifyFailed}
        onConfirm={() => {
          setIsVerifyFailed(false);
          form.setValue('code', '');
        }}
      />
    </>
  );
};

export default TwoFactorAuthForm;
