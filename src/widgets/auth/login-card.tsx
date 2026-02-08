import Image from 'next/image';
import Link from 'next/link';

import { LoginForm } from '@/features/auth/ui/login-form';

export function LoginCard() {
  return (
    <div className="w-full max-w-[480px] shrink-0 flex flex-col items-center gap-[45px] bg-white">
      <div className="w-full flex flex-col items-center gap-[35px]">
        <div className="flex flex-col items-center gap-3">
          <Image src="/images/logo.png" alt="KKEBI" width={88} height={88} />
          <h1 className="text-center text-[24px] leading-[30px] font-semibold text-label-normal">
            KKEBI for Counselor
          </h1>
        </div>

        <div className="w-full rounded-[24px] bg-neutral-99 p-8">
          <LoginForm />
        </div>
      </div>

      <div className="flex items-center gap-3 text-[18px] leading-[28.8px] font-medium text-neutral-60">
        <Link href="#" className="hover:text-label-normal">
          비밀번호 찾기
        </Link>
        <span className="h-5 w-px bg-neutral-80" />
        <Link href="#" className="hover:text-label-normal">
          상담사 등록 문의
        </Link>
      </div>
    </div>
  );
}
