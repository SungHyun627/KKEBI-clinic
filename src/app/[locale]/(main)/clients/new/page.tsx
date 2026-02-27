'use client';

import { useForm } from 'react-hook-form';
import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';
import ClientRegistrationBasicInfoForm, {
  type BasicInfoFormValues,
} from '@/features/clients/ui/ClientRegistrationBasicInfoForm';
import ClientRegistrationCounselingInfoForm, {
  type CounselingInfoFormValues,
} from '@/features/clients/ui/ClientRegistrationCounselingInfoForm';
import ClientRegistrationPaymentInfoForm, {
  type PaymentInfoFormValues,
} from '@/features/clients/ui/ClientRegistrationPaymentInfoForm';
import ClientRegistrationKkebiNicknameForm, {
  type KkebiNicknameFormValues,
} from '@/features/clients/ui/ClientRegistrationKkebiNicknameForm';
import { Button } from '@/shared/ui/button';

const getTodayDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const NewClientPage = () => {
  const basicInfoForm = useForm<BasicInfoFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      birthDate: getTodayDateKey(),
      gender: '',
    },
  });
  const counselingInfoForm = useForm<CounselingInfoFormValues>({
    mode: 'onChange',
    defaultValues: {
      counselingStartDate: getTodayDateKey(),
      chiefConcern: '',
      referralPath: '',
    },
  });
  const paymentInfoForm = useForm<PaymentInfoFormValues>({
    mode: 'onChange',
    defaultValues: {
      paymentType: '',
      insuranceCompany: '',
    },
  });
  const kkebiNicknameForm = useForm<KkebiNicknameFormValues>({
    mode: 'onChange',
    defaultValues: {
      kkebiNickname: '',
    },
  });

  return (
    <section className="flex w-full items-start justify-center gap-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="basic-info" />
        <div className="flex w-full flex-col items-start gap-7">
          <ClientRegistrationBasicInfoForm form={basicInfoForm} />
          <ClientRegistrationCounselingInfoForm form={counselingInfoForm} />
          <ClientRegistrationPaymentInfoForm form={paymentInfoForm} />
          <ClientRegistrationKkebiNicknameForm form={kkebiNicknameForm} />

          <div className="flex w-full justify-end">
            <Button type="button" size="lg" className="w-full max-w-[220px]">
              다음으로
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewClientPage;
