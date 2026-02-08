'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="w-[480px] shrink-0 flex flex-col items-center gap-8 rounded-[24px] bg-neutral-99 p-8">
      <div className="flex flex-col items-center gap-4">
        <Image src="/images/logo.png" alt="KKEBI" width={88} height={88} />
        <h1 className="text-center text-[24px] leading-[30px] font-semibold text-label-normal">
          KKEBI for Counselor
        </h1>
      </div>

      <form className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
            이메일
          </Label>
          <Input
            type="email"
            placeholder="example@kkebi.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onClear={() => setEmail('')}
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
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-label-neutral text-[14px] leading-[22.4px] font-semibold">
            비밀번호
          </Label>
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onClear={() => setPassword('')}
            rightIcon={
              <div
                className="h-6 w-6 bg-neutral-20"
                style={{
                  maskImage: `url(${isPasswordVisible ? '/icons/eye.svg' : '/icons/eyeoff.svg'})`,
                  WebkitMaskImage: `url(${isPasswordVisible ? '/icons/eye.svg' : '/icons/eyeoff.svg'})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            }
            onRightIconClick={() => setIsPasswordVisible((prev) => !prev)}
            icon={
              <div
                className="h-6 w-6 bg-current"
                style={{
                  maskImage: 'url(/icons/lock.svg)',
                  WebkitMaskImage: 'url(/icons/lock.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            }
          />
        </div>

        <label className="flex items-center gap-2 text-[14px] leading-[21px] font-normal text-label-neutral">
          <span className="relative flex h-4 w-4 items-center justify-center">
            <input
              type="checkbox"
              className="peer h-4 w-4 appearance-none rounded-[4px] border border-neutral-95 bg-neutral-95 transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <svg
              className="pointer-events-none absolute text-white opacity-100 transition-opacity"
              width="9.589"
              height="6.393"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1 5L4.5 8.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          로그인 상태 유지
        </label>

        <Button type="submit" className="mt-2 w-full">
          로그인
        </Button>
      </form>

      <div className="flex items-center gap-4 text-sm text-label-alternative">
        <Link href="#" className="hover:text-label-normal">
          비밀번호 찾기
        </Link>
        <span className="text-label-assistive">·</span>
        <Link href="#" className="hover:text-label-normal">
          상담사 등록 문의
        </Link>
      </div>
    </div>
  );
}
