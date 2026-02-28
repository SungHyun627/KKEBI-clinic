'use client';

import { useTranslations } from 'next-intl';
import Divider from '@/shared/ui/divider';
import { cn } from '@/shared/lib/utils';
import type { ClientRegistrationStepKey } from '@/features/clients/types/client-registration';

interface ClientRegistrationStepBarProps {
  currentStep: ClientRegistrationStepKey;
  className?: string;
}

const STEPS: Array<{
  key: ClientRegistrationStepKey;
  order: 1 | 2 | 3;
}> = [
  { key: 'basic-info', order: 1 },
  { key: 'intake-interview-info', order: 2 },
  { key: 'registration-complete', order: 3 },
];

const ClientRegistrationStepBar = ({ currentStep, className }: ClientRegistrationStepBarProps) => {
  const t = useTranslations('clientRegistration.stepBar');
  const currentStepOrder = STEPS.find((step) => step.key === currentStep)?.order ?? 1;

  return (
    <div
      className={cn(
        'flex h-13 w-full items-center justify-center gap-[6px] rounded-[12px] bg-neutral-99 px-[13px] py-3',
        className,
      )}
    >
      {STEPS.map((item, index) => {
        const isActive = item.key === currentStep;
        const isCompleted = item.order < currentStepOrder;
        const isHighlighted = isActive || isCompleted;

        return (
          <div key={item.key} className="flex min-w-0 items-center gap-2">
            <div className="flex min-w-0 items-center gap-1">
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full body-16 font-semibold',
                  isHighlighted
                    ? 'bg-[rgba(250,84,84,0.10)] text-primary'
                    : 'bg-[rgba(55,56,60,0.10)] text-label-assistive',
                )}
              >
                {item.order}
              </div>
              <span
                className={cn(
                  'body-16 max-[520px]:hidden min-w-0 truncate whitespace-nowrap font-semibold',
                  isHighlighted ? 'text-primary' : 'text-label-assistive',
                )}
              >
                {t(`${item.key}.label`)}
              </span>
              <span
                className={cn(
                  'body-14 hidden max-[520px]:inline min-w-0 truncate whitespace-nowrap font-semibold',
                  isHighlighted ? 'text-primary' : 'text-label-assistive',
                )}
              >
                {t(`${item.key}.mobileLabel`)}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <>
                <Divider className="h-[1.5px] w-[50px] max-[600px]:w-[32px] max-[550px]:w-[20px] max-[400px]:w-[10px] max-[360px]:hidden" />
                <span className="hidden body-16 text-label-assistive max-[360px]:inline">/</span>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ClientRegistrationStepBar;
