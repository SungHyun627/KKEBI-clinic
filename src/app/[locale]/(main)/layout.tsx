'use client';
import { useLocale } from 'next-intl';

import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
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
import {
  clearAuthSession,
  getAuthSession,
  subscribeAuthSession,
} from '@/features/auth/login/lib/authSession';
import { useLogoutMutation } from '@/features/auth/login/hooks/useLogoutMutation';
import { toast } from '@/shared/ui/toast';
import { NotificationDrawer } from '@/features/notification';
import { subscribeAuthRequired } from '@/shared/lib/auth-events';

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
  const logoutMutation = useLogoutMutation();
  const locale = useLocale();
  const switchLocale = () => {
    if (typeof window === 'undefined') return;
    const { pathname, search, hash } = window.location;
    const currentLocaleFromPath = pathname.startsWith('/en')
      ? 'en'
      : pathname.startsWith('/ko')
        ? 'ko'
        : locale;
    const nextLocale = currentLocaleFromPath === 'ko' ? 'en' : 'ko';
    const normalizedPath = pathname.replace(/^\/(ko|en)(?=\/|$)/, '') || '/';
    const nextPath = `/${nextLocale}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;
    window.location.replace(`${nextPath}${search}${hash}`);
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const authSession = useSyncExternalStore(subscribeAuthSession, getAuthSession, () => null);
  const userName = authSession?.userName || tCommon('defaultUserName');
  const isSessionDetailPage = pathname.startsWith('/sessions/');

  useEffect(() => {
    if (!authSession?.authenticated) {
      router.replace('/login');
    }
  }, [authSession, router]);

  useEffect(() => {
    return subscribeAuthRequired(() => {
      clearAuthSession();
      localStorage.removeItem('kkebi-login-info');
      router.replace('/login');
    });
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
          <div className="flex w-full flex-col gap-5 pl-5 pr-[21px] pt-[18px] max-[1200px]:items-center max-[1200px]:px-0">
            <SidebarHeader>
              <Link
                href="/"
                aria-label={tCommon('goToDashboardAria')}
                className="inline-flex hover:cursor-pointer"
              >
                <Image
                  src="/icons/kkebi-logo.svg"
                  alt="Kkebi Clinic"
                  width={104}
                  height={37}
                  className="block max-[1200px]:hidden"
                />
                <Image
                  src="/images/logo.png"
                  alt="Kkebi Clinic logo"
                  width={32}
                  height={32}
                  className="hidden max-[1200px]:block"
                />
              </Link>
            </SidebarHeader>
            <SidebarContent className="w-full gap-5">
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
                        className="max-[1200px]:justify-center max-[1200px]:px-0"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 max-[1200px]:justify-center"
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
                          <span className="max-[1200px]:hidden whitespace-nowrap">
                            {tNav(item.key)}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarContent>
          </div>

          <SidebarFooter className="p-0">
            <div className="flex h-[59px] w-full items-center justify-between border-t-[0.5px] border-neutral-95 px-4 max-[1200px]:justify-center max-[1200px]:gap-3 max-[1200px]:px-2">
              <div className="flex items-center gap-2">
                <Image src="/icons/profile.svg" alt="profile" width={24} height={24} />
                <div className="body-14 flex items-center gap-[3px] font-medium max-[1200px]:hidden">
                  <span>{userName}</span>
                  <span>{tCommon('profileSuffix')}</span>
                </div>
              </div>
              <button
                type="button"
                aria-label={tCommon('logout')}
                className="flex items-center justify-center hover:cursor-pointer"
                onClick={async () => {
                  const result = await logoutMutation.mutateAsync();
                  clearAuthSession();
                  localStorage.removeItem('kkebi-login-info');
                  if (!result.success) {
                    toast(tCommon('logoutFailed'));
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
            <div className="flex items-center gap-2">
              <button className="hover:cursor-pointer" type="button" onClick={switchLocale}>
                <Image
                  src="/icons/global.svg"
                  alt={tCommon('localeSwitch')}
                  width={24}
                  height={24}
                />
              </button>
              <button
                className="hover:cursor-pointer"
                type="button"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Image src="/icons/bell.svg" alt={tNav('notifications')} width={24} height={24} />
              </button>
            </div>
          </div>
          <main className="flex flex-col pl-5">{children}</main>
        </SidebarInset>
      </div>

      <NotificationDrawer open={isNotificationOpen} onOpenChange={setIsNotificationOpen} />
    </div>
  );
}
