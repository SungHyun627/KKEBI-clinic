'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import ClientRegistrationStepBar from '@/features/clients/client-registration/ui/ClientRegistrationStepBar';
import useSubmitClientRegistration from '@/features/clients/client-registration/hooks/use-submit-client-registration';
import {
  getGenderDisplayValue,
  getReferralPathDisplayValue,
} from '@/features/clients/client-registration/lib/review-mapper';
import { getReviewStateFromStorage } from '@/features/clients/client-registration/lib/review-draft';
import LabelCell from '@/features/clients/client-registration/ui/ClientRegistrationLabelCell';
import ValueCell from '@/features/clients/client-registration/ui/ClientRegistrationValueCell';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';

const ClientRegistrationReviewPage = () => {
  const locale = useLocale();
  const t = useTranslations('clientRegistration.review');
  const router = useRouter();
  const [reviewState] = useState(getReviewStateFromStorage);
  const {
    basicInfo,
    counselingInfo,
    paymentInfo,
    kkebiNickname,
    assessmentResults,
    intakeInterview,
  } = reviewState;
  const { isSubmitting, submit } = useSubmitClientRegistration({
    locale,
    messages: {
      registerFailed: t('toast.registerFailed'),
      registerSuccess: t('toast.registerSuccess'),
    },
    onSuccess: () => router.push('/clients'),
  });

  const paymentValue =
    paymentInfo.paymentType === 'insurance'
      ? `${t('payment.insurance')}${paymentInfo.insuranceCompany ? ` - ${paymentInfo.insuranceCompany}` : ''}`
      : paymentInfo.paymentType === 'private-pay'
        ? t('payment.privatePay')
        : paymentInfo.paymentType;

  const scoreRows: Array<{ field: string; value: string }> = [
    { field: t('scoreFields.phq9Score'), value: assessmentResults.phq9Score?.toString() ?? '' },
    { field: t('scoreFields.pss10Score'), value: assessmentResults.pss10Score?.toString() ?? '' },
    { field: t('scoreFields.mbiScore'), value: assessmentResults.mbiScore?.toString() ?? '' },
    ...assessmentResults.additionalResults.map((result) => ({
      field: result.testName,
      value: result.testResult?.toString() ?? '',
    })),
  ];

  const intakeRows: Array<{ field: string; value: string }> = [
    { field: t('intakeFields.reasonForVisit'), value: intakeInterview.reasonForVisit },
    {
      field: t('intakeFields.mostImportantChange'),
      value: intakeInterview.mostImportantChange,
    },
    {
      field: t('intakeFields.similarPastExperience'),
      value: intakeInterview.similarPastExperience,
    },
    { field: t('intakeFields.attemptedSolution'), value: intakeInterview.attemptedSolution },
    {
      field: t('intakeFields.attemptedSolutionEffectiveness'),
      value: intakeInterview.attemptedSolutionEffectiveness,
    },
    {
      field: t('intakeFields.currentBiggestConcern'),
      value: intakeInterview.currentBiggestConcern,
    },
    { field: t('intakeFields.averageSleepPattern'), value: intakeInterview.averageSleepPattern },
    { field: t('intakeFields.sleepQuality'), value: intakeInterview.sleepQuality },
    {
      field: t('intakeFields.exerciseTypeAndFrequency'),
      value: intakeInterview.exerciseTypeAndFrequency,
    },
    { field: t('intakeFields.mealsPerDay'), value: intakeInterview.mealsPerDay },
    { field: t('intakeFields.mostReliablePerson'), value: intakeInterview.mostReliablePerson },
    { field: t('intakeFields.reasonForReliance'), value: intakeInterview.reasonForReliance },
    { field: t('intakeFields.familyBond'), value: intakeInterview.familyBond },
    { field: t('intakeFields.reasonForFamilyBond'), value: intakeInterview.reasonForFamilyBond },
    {
      field: t('intakeFields.selfDescriptionSentence'),
      value: intakeInterview.selfDescriptionSentence,
    },
  ];

  const handleEdit = () => {
    router.push('/clients/new');
  };

  const handleSubmit = async () => {
    await submit({
      basicInfo,
      counselingInfo,
      paymentInfo,
      kkebiNickname,
      assessmentResults,
      intakeInterview,
    });
  };

  return (
    <section className="flex w-full items-start justify-center gap-4 pb-4">
      <div className="flex w-full flex-col items-start max-w-[1200px] gap-[33px]">
        <div className="flex w-full flex-col justify-center items-start gap-[42px]">
          <div className="flex flex-col w-full justify-center items-center gap-[23px]">
            <Image src="/icons/checkmark.svg" alt={t('hero.alt')} width={96} height={96} />
            <div className="flex flex-col justify-center items-center gap-2">
              <span className="text-[24px] font-semibold text-label-normal">{t('hero.title')}</span>
              <span className="body-16 text-label-alternative">{t('hero.description')}</span>
            </div>
          </div>

          <ClientRegistrationStepBar
            currentStep="registration-complete"
            className="w-full max-w-[626px] self-center"
          />
        </div>

        <div className="flex w-full flex-col items-start gap-[23px]">
          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">
              {t('sections.basicInfo')}
            </h2>
            <div className="flex w-full flex-col gap-4">
              <div className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white">
                <div className="flex flex-col">
                  <LabelCell field={t('fields.name')} />
                  <ValueCell value={basicInfo.name} />
                </div>
                <div className="flex flex-col">
                  <LabelCell field={t('fields.phone')} />
                  <ValueCell value={basicInfo.phone} />
                </div>
              </div>

              <div className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white">
                <div className="flex flex-col">
                  <LabelCell field={t('fields.email')} />
                  <ValueCell value={basicInfo.email} />
                </div>
                <div className="flex flex-col">
                  <LabelCell field={t('fields.birthDate')} />
                  <ValueCell value={basicInfo.birthDate} />
                </div>
              </div>

              <div className="grid w-full grid-cols-1 bg-white">
                <div className="flex flex-col">
                  <LabelCell field={t('fields.gender')} />
                  <ValueCell
                    value={getGenderDisplayValue(basicInfo.gender, {
                      female: t('gender.female'),
                      male: t('gender.male'),
                      nonBinary: t('gender.nonBinary'),
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">
              {t('sections.counselingInfo')}
            </h2>
            <div className="flex w-full flex-col gap-4">
              <div className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white">
                <div className="flex flex-col">
                  <LabelCell field={t('fields.counselingStartDate')} />
                  <ValueCell value={counselingInfo.counselingStartDate} />
                </div>
                <div className="flex flex-col">
                  <LabelCell field={t('fields.chiefConcern')} />
                  <ValueCell value={counselingInfo.chiefConcern} />
                </div>
              </div>

              <div className="grid w-full grid-cols-1 bg-white">
                <div className="flex flex-col">
                  <LabelCell field={t('fields.referralPath')} />
                  <ValueCell
                    value={getReferralPathDisplayValue(counselingInfo.referralPath, locale)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">
              {t('sections.paymentInfo')}
            </h2>
            <div className="grid w-full grid-cols-1 bg-white">
              <div className="flex flex-col">
                <LabelCell field={t('fields.paymentInfo')} />
                <ValueCell value={paymentValue} />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">
              {t('sections.assessmentResults')}
            </h2>
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: Math.ceil(scoreRows.length / 2) }).map((_, rowIndex) => {
                const left = scoreRows[rowIndex * 2];
                const right = scoreRows[rowIndex * 2 + 1];

                if (!right) {
                  return (
                    <div key={left.field} className="grid w-full grid-cols-1 bg-white">
                      <div className="flex flex-col">
                        <LabelCell field={left.field} />
                        <ValueCell value={left.value} />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${left.field}-${right.field}`}
                    className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white"
                  >
                    <div className="flex flex-col">
                      <LabelCell field={left.field} />
                      <ValueCell value={left.value} />
                    </div>
                    <div className="flex flex-col">
                      <LabelCell field={right.field} />
                      <ValueCell value={right.value} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[26px] rounded-4xl border border-neutral-95 p-8">
            <h2 className="text-[24px] font-semibold text-label-strong">
              {t('sections.intakeInterview')}
            </h2>
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: Math.ceil(intakeRows.length / 2) }).map((_, rowIndex) => {
                const left = intakeRows[rowIndex * 2];
                const right = intakeRows[rowIndex * 2 + 1];

                if (!right) {
                  return (
                    <div key={left.field} className="grid w-full grid-cols-1 bg-white">
                      <div className="flex flex-col">
                        <LabelCell field={left.field} />
                        <ValueCell value={left.value} />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${left.field}-${right.field}`}
                    className="grid w-full grid-cols-2 divide-x divide-gray-10 bg-white"
                  >
                    <div className="flex flex-col">
                      <LabelCell field={left.field} />
                      <ValueCell value={left.value} />
                    </div>
                    <div className="flex flex-col">
                      <LabelCell field={right.field} />
                      <ValueCell value={right.value} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex w-full justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full max-w-[144px]"
              onClick={handleEdit}
              disabled={isSubmitting}
            >
              {t('actions.edit')}
            </Button>
            <Button
              type="button"
              size="lg"
              className="w-full max-w-[236px]"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('actions.submitting') : t('actions.home')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientRegistrationReviewPage;
