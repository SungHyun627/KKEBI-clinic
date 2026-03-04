'use client';

import Image from 'next/image';
import LoginForm from '@/features/auth/login/ui/LoginForm';

const LoginCard = () => {
  return (
    <div className="w-full flex flex-col items-center gap-[35px]">
      <div className="flex flex-col items-center gap-3">
        <Image src="/icons/logo.svg" alt="KKEBI" width={88} height={88} />
        <h1 className="text-center text-[24px] leading-[30px] font-semibold text-label-normal">
          KKEBI for Counselor
        </h1>
      </div>

      <div className="w-full rounded-[24px] bg-neutral-99 p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginCard;
