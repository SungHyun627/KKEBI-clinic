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
  return <div className="min-h-screen w-full bg-white"></div>;
}
