'use client';
import { useLocale } from 'next-intl';

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
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
  useLogoutMutation,
} from '@/features/auth';

import { Toast, toast } from '@/shared/ui/toast';
import {
  getUnreadNotificationCount,
  NotificationDrawer,
  type NotificationItem,
  useNotificationSse,
} from '@/features/notification';
import { subscribeAuthRequired } from '@/shared/lib/auth-events';
import { isLighthouseBypassAuthEnabled } from '@/shared/lib/perf-flags';

const navItems = [
  { key: 'dashboard', href: '/', icon: '/icons/dashboard.svg' },
  { key: 'clients', href: '/clients', icon: '/icons/people.svg' },
  { key: 'sessions', href: '/sessions', icon: '/icons/video.svg' },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tClients = useTranslations('clients');
  const logoutMutation = useLogoutMutation();
  const locale = useLocale();
  const switchLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: nextLocale });
    router.refresh();
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const authSession = useSyncExternalStore(subscribeAuthSession, getAuthSession, () => null);
  const authBypassEnabled = isLighthouseBypassAuthEnabled();
  const userName = authSession?.userName || tCommon('defaultUserName');

  useEffect(() => {
    if (authBypassEnabled) return;
    const latestSession = getAuthSession();
    if (!latestSession?.authenticated) {
      router.replace('/login');
    }
  }, [authBypassEnabled, authSession, router]);

  useEffect(() => {
    if (authBypassEnabled) return;
    const latestSession = getAuthSession();
    if (!latestSession?.authenticated) return;

    const loadUnreadCount = async () => {
      const result = await getUnreadNotificationCount();
      if (!result.success || typeof result.data !== 'number') return;
      setUnreadNotificationCount(Math.max(0, result.data));
    };

    void loadUnreadCount();
  }, [authBypassEnabled, authSession]);

  const displayedUnreadNotificationCount = authSession?.authenticated ? unreadNotificationCount : 0;

  useEffect(() => {
    if (authBypassEnabled) return;
    return subscribeAuthRequired(() => {
      clearAuthSession();
      localStorage.removeItem('kkebi-login-info');
      router.replace('/login');
    });
  }, [authBypassEnabled, router]);

  useEffect(() => {
    if (pathname !== '/') return;
    const shouldShowSummaryToast = window.sessionStorage.getItem('kkebi:summarySubmitted') === '1';
    if (!shouldShowSummaryToast) return;

    window.sessionStorage.removeItem('kkebi:summarySubmitted');
    toast(locale === 'en' ? 'Session content has been saved.' : '상담 내용이 저장되었습니다.');
  }, [locale, pathname]);

  const handleNotificationReceived = useCallback(
    (notification: NotificationItem) => {
      if (notification.isRead) return;

      setUnreadNotificationCount((prev) => prev + 1);

      switch (notification.type) {
        case 'HIGH_PHQ9':
          toast(
            notification.message ||
              (locale === 'en' ? 'High PHQ-9 risk detected.' : 'PHQ-9 고위험 알림이 도착했습니다.'),
          );
          break;
        case 'SCHEDULE_CHANGE_REQUEST':
          toast(
            notification.message ||
              (locale === 'en'
                ? 'A schedule change request has arrived.'
                : '일정 변경 요청 알림이 도착했습니다.'),
          );
          break;
        default:
          break;
      }
    },
    [locale],
  );

  useNotificationSse({
    enabled: authBypassEnabled ? false : Boolean(authSession?.authenticated),
    onNotification: handleNotificationReceived,
  });

  const currentTitle =
    navItems.find(
      (item) =>
        (item.href === '/' && pathname === '/') ||
        (item.href !== '/' && pathname.startsWith(item.href)),
    )?.key ?? 'dashboard';
  const isClientsBackHeaderPage =
    pathname === '/clients/closed' || pathname.startsWith('/clients/new');
  const clientsBackHeaderTitle = pathname.startsWith('/clients/new')
    ? tClients('listRegister')
    : tNav('clients');

  return (
    <div className="flex min-h-screen w-full bg-white">
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
          {isClientsBackHeaderPage ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    router.back();
                    return;
                  }
                  router.push('/clients');
                }}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] hover:cursor-pointer hover:bg-neutral-99 hover:bg-white"
                aria-label={tNav('clients')}
              >
                <Image src="/icons/back.svg" alt="" width={30} height={30} aria-hidden />
              </button>
              <p className="font-pretendard text-[24px] leading-[30px] font-semibold text-label-normal">
                {clientsBackHeaderTitle}
              </p>
            </div>
          ) : (
            <p className="font-pretendard text-[24px] leading-[30px] font-semibold text-label-normal">
              {tNav(currentTitle)}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button className="hover:cursor-pointer" type="button" onClick={switchLocale}>
              <Image src="/icons/global.svg" alt={tCommon('localeSwitch')} width={24} height={24} />
            </button>
            <button
              className="relative inline-flex hover:cursor-pointer"
              type="button"
              onClick={() => setIsNotificationOpen(true)}
            >
              {displayedUnreadNotificationCount > 0 ? (
                <span
                  className="absolute right-0 top-0 h-2 w-2 rounded-full bg-status-negative"
                  aria-hidden
                />
              ) : null}
              <Image src="/icons/bell.svg" alt={tNav('notifications')} width={24} height={24} />
            </button>
          </div>
        </div>
        <main className="flex flex-col pl-5">{children}</main>
      </SidebarInset>

      <NotificationDrawer
        open={isNotificationOpen}
        onOpenChange={setIsNotificationOpen}
        onUnreadCountSync={(count) => setUnreadNotificationCount(Math.max(0, count))}
        onReadNotification={() => setUnreadNotificationCount((prev) => Math.max(0, prev - 1))}
      />
      <Toast />
    </div>
  );
}
