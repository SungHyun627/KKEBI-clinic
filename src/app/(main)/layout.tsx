'use client';

import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar';
import { logout } from '@/features/auth/login/api/logout';
import { clearAuthSession, getAuthSession } from '@/features/auth/login/lib/authSession';
import { toast } from '@/shared/ui/toast';
import { NotificationDrawer } from '@/features/notification';

const navItems = [
  { key: 'dashboard', href: '/', icon: '/icons/dashboard.svg' },
  { key: 'clients', href: '/clients', icon: '/icons/people.svg' },
  { key: 'sessions', href: '/sessions', icon: '/icons/video.svg' },
  { key: 'settings', href: '/settings', icon: '/icons/setting.svg' },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const userName = useSyncExternalStore(
    () => () => {},
    () => getAuthSession()?.userName || '홍길동',
    () => '홍길동',
  );
  const isSessionDetailPage = pathname.startsWith('/sessions/');

  useEffect(() => {
    const session = getAuthSession();
    if (!session?.authenticated) {
      router.replace('/login');
    }
  }, [router]);

  const currentTitle =
    navItems.find(
      (item) =>
        (item.href === '/' && pathname === '/') ||
        (item.href !== '/' && pathname.startsWith(item.href)),
    )?.key ?? 'dashboard';

  if (isSessionDetailPage) {
    return <main className="min-h-screen w-full bg-white p-5">{children}</main>;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <div className="flex w-full flex-col gap-5 pl-5 pr-[21px] pt-[18px] max-[800px]:items-center max-[800px]:px-2">
            <SidebarHeader>
              <Link
                href="/"
                aria-label={`${tNav('dashboard')}로 이동`}
                className="inline-flex hover:cursor-pointer"
              >
                <Image
                  src="/images/kkebi-logo.png"
                  alt="Kkebi Clinic"
                  width={104}
                  height={37}
                  className="block max-[800px]:hidden"
                />
                <Image
                  src="/images/logo.png"
                  alt="Kkebi Clinic logo"
                  width={32}
                  height={32}
                  className="hidden max-[800px]:block"
                />
              </Link>
            </SidebarHeader>
            <SidebarContent className="gap-5">
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive =
                    (item.href === '/' && pathname === '/') ||
                    (item.href !== '/' && pathname.startsWith(item.href));

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        active={isActive}
                        className="max-[800px]:justify-center max-[800px]:px-0"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 max-[800px]:justify-center"
                        >
                          <span
                            className="h-6 w-6 shrink-0 bg-current"
                            style={{
                              maskImage: `url(${item.icon})`,
                              WebkitMaskImage: `url(${item.icon})`,
                              maskSize: 'contain',
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                            }}
                            aria-hidden
                          />
                          <span className="max-[800px]:hidden">{tNav(item.key)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarContent>
          </div>

          <SidebarFooter className="p-0">
            <div className="flex h-[59px] w-full items-center justify-between border-t-[0.5px] border-neutral-95 px-4 max-[800px]:justify-center max-[800px]:gap-3 max-[800px]:px-2">
              <div className="flex items-center gap-2">
                <Image src="/icons/profile.svg" alt="profile" width={24} height={24} />
                <div className="body-14 flex items-center gap-[3px] font-medium max-[800px]:hidden">
                  <span>{userName}</span>
                  <span>{tCommon('profileSuffix')}</span>
                </div>
              </div>
              <button
                type="button"
                aria-label={tCommon('logout')}
                className="flex items-center justify-center hover:cursor-pointer"
                onClick={async () => {
                  const result = await logout();
                  clearAuthSession();
                  localStorage.removeItem('kkebi-login-info');
                  if (!result.success) {
                    toast(result.message || '로그아웃 처리 중 오류가 발생했습니다.');
                  }
                  router.push('/login');
                }}
              >
                <Image src="/icons/logout.svg" alt={tCommon('logout')} width={20} height={20} />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="flex w-full items-center justify-between bg-white p-5">
            <p className="font-pretendard text-[24px] leading-[30px] font-semibold text-label-normal">
              {tNav(currentTitle)}
            </p>
            <button
              className="hover:cursor-pointer"
              type="button"
              onClick={() => setIsNotificationOpen(true)}
            >
              <Image src="/icons/bell.svg" alt={tNav('notifications')} width={24} height={24} />
            </button>
          </div>
          <main className="flex flex-col pl-5">{children}</main>
        </SidebarInset>
      </div>

      <NotificationDrawer open={isNotificationOpen} onOpenChange={setIsNotificationOpen} />
    </div>
  );
}
