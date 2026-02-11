import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { label: '대시보드', href: '/' },
  { label: '내담자 관리', href: '/patients' },
  { label: '세션 내역', href: '/sessions' },
  { label: '설정', href: '/settings' },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside className="flex w-[260px] flex-col gap-10 border-r border-neutral-95 bg-white px-6 py-8">
          <div className="flex items-center gap-3">
            <Image src="/assets/images/logo.png" alt="Kkebi Clinic" width={120} height={28} />
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-label-alternative transition-colors hover:bg-neutral-99 hover:text-label-normal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-fill-background px-4 py-3 text-sm text-label-alternative">
            오늘 일정이 많아요. 내담자 상태를 한 번 더 확인해보세요.
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
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
        </div>
      </div>
    </div>
  );
}
