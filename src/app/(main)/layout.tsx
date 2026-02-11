'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const navItems = [
  { label: '대시보드', href: '/', icon: '/icons/dashboard.svg' },
  { label: '내담자 관리', href: '/clients', icon: '/icons/people.svg' },
  { label: '상담 세션', href: '/sessions', icon: '/icons/video.svg' },
  { label: '설정', href: '/settings', icon: '/icons/setting.svg' },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <div className="flex w-full flex-col pl-5 pt-[18px] pr-[21px] gap-5">
            <SidebarHeader>
              <Image src="/images/kkebi-logo.png" alt="Kkebi Clinic" width={104} height={37} />
            </SidebarHeader>
            <SidebarContent className="gap-5">
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive =
                    (item.href === '/' && pathname === '/') ||
                    (item.href !== '/' && pathname.startsWith(item.href));

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild active={isActive}>
                        <Link href={item.href} className="flex items-center gap-2">
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
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarContent>
          </div>

          <SidebarFooter className="p-0">
            <div className="flex h-[59px] w-[255px] items-center justify-between border-t-[0.5px] border-neutral-95 px-4">
              <div className="flex items-center gap-2">
                <Image src="/icons/profile.svg" alt="profile" width={24} height={24} />
                <div className="flex items-center gap-[3px] body-14 font-medium">
                  <span>홍길동</span>
                  <span>님</span>
                </div>
              </div>
              <button
                type="button"
                aria-label="로그아웃"
                className="flex items-center justify-center hover:cursor-pointer"
              >
                <Image src="/icons/logout.svg" alt="로그아웃" width={20} height={20} />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-20 items-center justify-between border-b border-neutral-95 bg-white px-10">
            <div>
              <p className="text-sm text-label-alternative">Kkebi Clinic</p>
              <h1 className="text-lg font-semibold text-label-normal">상담사 대시보드</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-neutral-95 px-4 py-2 text-sm text-label-alternative">
                오늘 일정 보기
              </button>
              <div className="flex items-center gap-3 rounded-full border border-neutral-95 px-4 py-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-status-positive" />
                <span className="text-label-normal">김세라 상담사</span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-10 py-8">{children}</main>
        </SidebarInset>
      </div>
    </div>
  );
}
