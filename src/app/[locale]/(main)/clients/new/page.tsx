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
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      birthDate: getTodayDateKey(),
      gender: '',
    },
  });
  const counselingInfoForm = useForm<CounselingInfoFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      counselingStartDate: getTodayDateKey(),
      chiefConcern: '',
      referralPath: '',
    },
  });
  const paymentInfoForm = useForm<PaymentInfoFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      paymentType: '',
      insuranceCompany: '',
    },
  });
  const kkebiNicknameForm = useForm<KkebiNicknameFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      kkebiNickname: '',
    },
  });
  const basicName = basicInfoForm.watch('name');
  const basicPhone = basicInfoForm.watch('phone');
  const basicEmail = basicInfoForm.watch('email');
  const basicBirthDate = basicInfoForm.watch('birthDate');
  const counselingChiefConcern = counselingInfoForm.watch('chiefConcern');
  const paymentType = paymentInfoForm.watch('paymentType');
  const insuranceCompany = paymentInfoForm.watch('insuranceCompany');
  const isInsurancePayment = paymentType === 'insurance';
  const isAllRequiredFilled =
    Boolean(basicName.trim()) &&
    Boolean(basicPhone.trim()) &&
    Boolean(basicEmail.trim()) &&
    Boolean(basicBirthDate.trim()) &&
    Boolean(counselingChiefConcern.trim()) &&
    Boolean(paymentType.trim()) &&
    (!isInsurancePayment || Boolean(insuranceCompany.trim()));

  const handleNext = async () => {
    const isBasicInfoValid = await basicInfoForm.trigger(undefined, { shouldFocus: true });
    if (!isBasicInfoValid) return;

    const isCounselingInfoValid = await counselingInfoForm.trigger(undefined, {
      shouldFocus: true,
    });
    if (!isCounselingInfoValid) return;

    const isPaymentInfoValid = await paymentInfoForm.trigger(undefined, { shouldFocus: true });
    if (!isPaymentInfoValid) return;

    await kkebiNicknameForm.trigger();

    // TODO: 다음 스텝 전환 및 API 저장 로직 연결
  };

  return (
    <section className="flex w-full items-start justify-center gap-4 pb-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="basic-info" />
        <div className="flex w-full flex-col items-start gap-7">
          <ClientRegistrationBasicInfoForm form={basicInfoForm} />
          <ClientRegistrationCounselingInfoForm form={counselingInfoForm} />
          <ClientRegistrationPaymentInfoForm form={paymentInfoForm} />
          <ClientRegistrationKkebiNicknameForm form={kkebiNicknameForm} />

          <div className="flex w-full justify-end">
            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              disabled={!isAllRequiredFilled}
              className="w-full max-w-[244px]"
            >
              다음으로
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewClientPage;
