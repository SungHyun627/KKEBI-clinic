import Link from 'next/link';

export default function ClientsPage() {
  return (
    <section className="flex min-h-[260px] w-full items-center justify-center rounded-2xl border border-neutral-95 bg-neutral-99 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-pretendard text-[22px] leading-[30px] font-semibold text-label-normal">
          내담자 관리
        </h2>
        <p className="body-14 text-label-alternative">해당 화면은 현재 준비 중입니다.</p>
        <code className="body-12 rounded-md bg-white px-2 py-1 text-neutral-60">/clients</code>
        <Link
          href="/"
          className="mt-2 rounded-[10px] border border-neutral-95 bg-white px-4 py-2 body-14 text-label-normal hover:bg-neutral-99"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    </section>
  );
}
