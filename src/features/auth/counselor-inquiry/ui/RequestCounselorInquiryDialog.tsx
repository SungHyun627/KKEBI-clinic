'use client';

import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { VisuallyHidden } from '@/shared/ui/visually-hidden';
import { toast } from '@/shared/ui/toast';
import { requestCounselorInquiry } from '../api/request';

interface RequestCounselorInquiryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: (values: CounselorInquiryFormValues) => void;
}

interface CounselorInquiryFormValues {
  name: string;
  email: string;
  phone: string;
  organization: string;
  licenseNumber: string;
  additionalInquiry: string;
}

const PHONE_PATTERN = /^\d{2,3}-?\d{3,4}-?\d{4}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RequestCounselorInquiryDialog = ({
  isOpen,
  onOpenChange,
  onSubmitSuccess,
}: RequestCounselorInquiryDialogProps) => {
  const createIcon = (iconPath: string) => (
    <div
      className="h-6 w-6 bg-current"
      style={{
        maskImage: `url(${iconPath})`,
        WebkitMaskImage: `url(${iconPath})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  );

  const form = useForm<CounselorInquiryFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      organization: '',
      licenseNumber: '',
      additionalInquiry: '',
    },
  });

  const name = useWatch({ control: form.control, name: 'name' }) ?? '';
  const email = useWatch({ control: form.control, name: 'email' }) ?? '';
  const phone = useWatch({ control: form.control, name: 'phone' }) ?? '';
  const organization = useWatch({ control: form.control, name: 'organization' }) ?? '';
  const licenseNumber = useWatch({ control: form.control, name: 'licenseNumber' }) ?? '';

  const canSubmit =
    name.trim().length > 0 &&
    EMAIL_PATTERN.test(email) &&
    PHONE_PATTERN.test(phone) &&
    organization.trim().length > 0 &&
    licenseNumber.trim().length > 0;

  const handleDialogOpen = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogContent className="flex h-[min(600px,calc(100vh-2rem))] max-h-[600px] max-w-[480px] flex-col overflow-hidden rounded-[24px] bg-white p-7 md:p-6">
        <DialogTitle className="absolute w-0 h-0 p-0 m-0 overflow-hidden">
          <VisuallyHidden>상담사 등록 문의</VisuallyHidden>
        </DialogTitle>
        <div className="flex h-full min-h-0 w-full flex-col">
          <Form {...form}>
            <form
              className="flex h-full min-h-0 flex-col"
              onSubmit={form.handleSubmit(async (values) => {
                const result = await requestCounselorInquiry(values);
                if (result.success) {
                  const submittedValues = values;
                  form.reset();
                  onOpenChange(false);
                  onSubmitSuccess(submittedValues);
                } else {
                  toast(result.message || '문의 제출에 실패했습니다.');
                }
              })}
            >
              <div className="flex w-full items-start justify-between gap-3 pb-[23px]">
                <div className="flex w-full flex-col gap-[6px]">
                  <div className="flex w-full justify-between items-center">
                    <span className="text-[20px] leading-[30px] font-semibold text-label-normal">
                      상담사 등록 문의
                    </span>
                    <button
                      type="button"
                      aria-label="닫기"
                      className="p-1 ml-2 hover:opacity-80 cursor-pointer shrink-0"
                      onClick={() => handleDialogOpen(false)}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Image src="/icons/close.svg" alt="닫기" width={28} height={28} />
                    </button>
                  </div>

                  <span className="text-[14px] leading-[21px] font-normal text-neutral-30">
                    상담사 계정 등록을 위해 아래 정보를 입력해 주세요.
                    <br />
                    검토 후 연락드리겠습니다.
                  </span>
                </div>
              </div>

              <div className="counselor-inquiry-scroll min-h-0 flex-1 overflow-y-auto pr-2">
                <div className="flex flex-col gap-[18px]">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: '이름을 입력해주세요.' }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel
                          required
                          className="text-label-neutral text-[14px] leading-[22.4px] font-semibold"
                        >
                          이름
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="홍길동"
                            icon={createIcon('/icons/user.svg')}
                            {...field}
                            onClear={() => form.setValue('name', '')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: '이메일을 입력해주세요.',
                      pattern: {
                        value: EMAIL_PATTERN,
                        message: '이메일 형식을 확인해주세요.',
                      },
                    }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel
                          required
                          className="text-label-neutral text-[14px] leading-[22.4px] font-semibold"
                        >
                          이메일
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="id@example.com"
                            icon={createIcon('/icons/mail.svg')}
                            {...field}
                            onClear={() => form.setValue('email', '')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{
                      required: '연락처를 입력해주세요.',
                      pattern: {
                        value: PHONE_PATTERN,
                        message: '연락처 형식을 확인해주세요.',
                      },
                    }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel
                          required
                          className="text-label-neutral text-[14px] leading-[22.4px] font-semibold"
                        >
                          연락처
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="010-1234-5678"
                            icon={createIcon('/icons/call.svg')}
                            {...field}
                            onClear={() => form.setValue('phone', '')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid w-full grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="organization"
                      rules={{ required: '소속기관을 입력해주세요.' }}
                      render={({ field }) => (
                        <FormItem className="flex min-w-0 w-full flex-col gap-2">
                          <FormLabel
                            required
                            className="text-label-neutral text-[14px] leading-[22.4px] font-semibold"
                          >
                            소속 기관
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="OO 상담센터"
                              icon={createIcon('/icons/building.svg')}
                              {...field}
                              onClear={() => form.setValue('organization', '')}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      rules={{ required: '자격증 번호를 입력해주세요.' }}
                      render={({ field }) => (
                        <FormItem className="flex min-w-0 w-full flex-col gap-2">
                          <FormLabel
                            required
                            className="text-label-neutral text-[14px] leading-[22.4px] font-semibold"
                          >
                            자격증 번호
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="0000000"
                              icon={createIcon('/icons/document.svg')}
                              {...field}
                              onClear={() => form.setValue('licenseNumber', '')}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInquiry"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
                          추가 문의사항
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="추가 문의사항"
                            maxLength={300}
                            className="min-h-[87px] h-[87px]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-6 flex w-full flex-col rounded-2xl bg-neutral-99 px-3 py-4 justify-center items-start gap-[3px]">
                  <div className="flex items-center text-neutral-50 body-14">
                    <span className="flex items-center justify-center w-[21px]">•</span>
                    <span>
                      <span className="text-primary font-semibold text-[14px]">*</span> 표시 항목은
                      필수입력입니다.
                    </span>
                  </div>
                  <div className="flex items-center text-neutral-50 body-14">
                    <span className="flex items-center justify-center w-[21px]">•</span>
                    <span>자격 검증 후 영업일 기준 2-3일 내 연락드립니다.</span>
                  </div>
                </div>
              </div>

              <div className="-mx-7 md:-mx-6 mt-4 border-t border-neutral-90 px-7 pt-4 md:px-6">
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
                    type="submit"
                    variant="default"
                    size="lg"
                    className="min-w-0 flex-1 basis-[64.7%]"
                    disabled={!canSubmit}
                  >
                    문의 제출
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestCounselorInquiryDialog;
