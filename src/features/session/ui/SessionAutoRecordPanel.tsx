import Divider from '@/shared/ui/divider';
import Image from 'next/image';

export default function SessionAutoRecordPanel() {
  return (
    <section className="flex min-h-full flex-col gap-[25px] px-8 py-[26px] bg-neutral-99">
      <div className="text-[24px] font-semibold">상담 기록</div>
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white gap-2">
          <div className="flex w-full py-2 items-center gap-3">
            <span className="flex px-3 py-[3px] justify-center items-center gap-3 border border-neutral-95 rounded-[10px] body-14 font-semibold text-center text-label-neutral">
              상담사
            </span>
            <div className="body-14 text-label-normal">
              상담사가 발화한 내용을 텍스트로 보여주세요.
            </div>
          </div>
          <Divider />
          <div className="flex w-full py-2 items-center gap-3">
            <span className="flex px-3 py-[3px] justify-center items-center gap-3 border border-neutral-95 rounded-[10px] body-14 font-semibold text-center text-label-neutral">
              상담사
            </span>
            <div className="body-14 text-label-normal">
              상담사가 발화한 내용을 텍스트로 보여주세요.
            </div>
          </div>
          <Divider />
          <div className="flex w-full py-2 items-center gap-3">
            <span className="flex px-3 py-[3px] justify-center items-center gap-3 border border-neutral-95 rounded-[10px] body-14 font-semibold text-center text-[#FF6363]">
              내담자
            </span>
            <div className="body-14 text-label-normal">
              내담자가 발화한 내용을 텍스트로 보여주세요.
            </div>
          </div>
          <Divider />
          <div className="flex w-full py-2 items-center gap-3">
            <span className="flex px-3 py-[3px] justify-center items-center gap-3 border border-neutral-95 rounded-[10px] body-14 font-semibold text-center text-[#FF6363]">
              내담자
            </span>
            <div className="body-14 text-label-normal">
              내담자가 발화한 내용을 텍스트로 보여주세요.
            </div>
          </div>
          <Divider />
          <div className="flex w-full py-2 items-center gap-3">
            <span className="flex px-3 py-[3px] justify-center items-center gap-3 border border-neutral-95 rounded-[10px] body-14 font-semibold text-center text-[#FF6363]">
              내담자
            </span>
            <div className="body-14 text-label-normal">
              내담자가 발화한 내용을 텍스트로 보여주세요.
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white gap-[23px]">
          <div className="flex flex-col gap-3">
            <span className="body-18 font-medium text-neutral-40">실시간 요약</span>
            <div className="w-full body-18 font-semibold">발화 내용을 요약한 주제</div>
          </div>
          <Divider />
          <div className="flex items-start gap-3">
            <Image src="/icons/speaker.svg" alt="speaker" width={20} height={20} />
            <div className="body-14 text-label-alternative">
              전체 발화 내용을 텍스트로 보여주세요.
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center p-[26px] rounded-[24px] bg-white gap-[18px]">
          <span className="body-18 font-medium text-neutral-40">상담사 메모</span>
          <div className="body-14 text-label-normal">상담사가 작성한 메모를 보여주세요.</div>
        </div>
      </div>
    </section>
  );
}
