'use client';

import ClientRegistrationStepBar from '@/features/clients/ui/ClientRegistrationStepBar';

export default function NewClientPage() {
  return (
    <section className="flex w-full items-start justify-center gap-4">
      <div className="flex w-full max-w-[626px] flex-col items-start gap-[33px]">
        <ClientRegistrationStepBar currentStep="basic-info" />
      </div>
    </section>
  );
}
