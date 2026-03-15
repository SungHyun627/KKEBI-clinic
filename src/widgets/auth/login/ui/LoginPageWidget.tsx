'use client';

import LoginCard from '@/features/auth/login/ui/LoginCard';
import LoginSupportActions from '@/features/auth/login/ui/LoginSupportActions';

export default function LoginPageWidget() {
  return (
    <>
      <LoginCard />
      <LoginSupportActions />
    </>
  );
}
