import Link from 'next/link';

interface SessionDetailPageProps {
  params: Promise<{ clientId: string }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { clientId } = await params;

  return (
    <section className="flex min-h-[260px] w-full items-center justify-center rounded-2xl border border-neutral-95 bg-neutral-99 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-pretendard text-[22px] leading-[30px] font-semibold text-label-normal">
          상담 세션 시작
        </h2>
        <p className="body-14 text-label-alternative">
          선택한 내담자의 상담 세션 시작 페이지입니다.
        </p>
        <code className="body-12 rounded-md bg-white px-2 py-1 text-neutral-60">
          clientId: {clientId}
        </code>
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
