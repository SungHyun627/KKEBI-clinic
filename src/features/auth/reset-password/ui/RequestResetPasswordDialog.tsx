'use client';

import { Form, FormField, FormItem, FormLabel, FormControl } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from '@/shared/ui/toast';
import { requestResetPassword } from '../api/resetPassword';
import { useTranslations } from 'next-intl';

interface RequestResetPasswordDialogProps {
  isOpen: boolean;
  handleDialogOpen: (open: boolean) => void;
  setSentEmail: (email: string) => void;
  setIsEmailSentOpen: (open: boolean) => void;
}

const RequestResetPasswordDialog = ({
  isOpen,
  handleDialogOpen,
  setSentEmail,
  setIsEmailSentOpen,
}: RequestResetPasswordDialogProps) => {
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const emailForm = useForm<{ email: string }>({ defaultValues: { email: '' } });
  const watchedEmail = useWatch({ control: emailForm.control, name: 'email' });

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogContent className="flex max-w-[480px] p-7 md:p-6 flex-col justify-center items-center gap-[26px] rounded-[24px] bg-white">
        <DialogTitle className="absolute w-0 h-0 p-0 m-0 overflow-hidden">
          <VisuallyHidden>{tAuth('resetTitle')}</VisuallyHidden>
        </DialogTitle>
        <div className="flex flex-col w-full flex-shrink-0 flex-grow-0 items-start gap-[26px]">
          <div className="flex flex-col w-full items-start gap-[23px]">
            <div className="flex flex-col w-full justify-center items-start gap-[6px] self-stretch">
              <div className="flex w-full justify-between items-center">
                <span className="text-lg font-semibold">{tAuth('resetTitle')}</span>
                <button
                  type="button"
                  aria-label={tCommon('close')}
                  className="p-1 ml-2 hover:opacity-80 cursor-pointer"
                  onClick={() => handleDialogOpen(false)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Image src="/icons/close.svg" alt={tCommon('close')} width={28} height={28} />
                </button>
              </div>
              <span
                className="font-pretendard text-[14px] font-normal leading-[21px]"
                style={{
                  color: 'var(--Semantic-Neutral-30, var(--Neutral-30, #474747))',
                  fontStyle: 'normal',
                }}
              >
                {tAuth('resetDescription1')}
                <br />
                {tAuth('resetDescription2')}
              </span>
            </div>
            <div className="w-full">
              <Form {...emailForm}>
                <FormField
                  control={emailForm.control}
                  name="email"
                  rules={{
                    required: tAuth('errorInvalidEmail'),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: tAuth('errorInvalidEmail'),
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
                        {tAuth('loginEmailLabel')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={tAuth('loginEmailPlaceholder')}
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
              {tCommon('cancel')}
            </Button>
            <Button
              type="button"
              variant="default"
              size="lg"
              className="min-w-0 flex-1 basis-[64.7%]"
              disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail)}
              onClick={async () => {
                const email = emailForm.getValues('email');
                try {
                  const res = await requestResetPassword(email);
                  if (res.success) {
                    setSentEmail(email);
                    handleDialogOpen(false);
                    setIsEmailSentOpen(true);
                    emailForm.reset({ email: '' });
                  } else {
                    toast(tAuth('errorResetLinkSendFailed'));
                  }
                } catch {
                  toast(tAuth('errorNetwork'));
                }
              }}
            >
              {tAuth('resetSendLink')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestResetPasswordDialog;
