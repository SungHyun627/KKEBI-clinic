interface TwoFactorCodeProps {
  codeArr: string[];
  onChange: (idx: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TwoFactorCode = ({ codeArr, onChange, onKeyDown }: TwoFactorCodeProps) => {
  return (
    <div className="flex justify-between items-center self-stretch w-full mb-2 gap-[2px]">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          id={`code-input-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={codeArr[idx] && codeArr[idx] !== ' ' ? codeArr[idx] : ''}
          onChange={(e) => onChange(idx, e)}
          onKeyDown={(e) => onKeyDown(idx, e)}
          className="flex h-[84px] flex-col justify-center items-center flex-auto min-w-0 max-w-[64px] rounded-[12px] border border-neutral-95 bg-white text-[43px] text-center font-pretendard font-semibold leading-[60.2px] text-neutral-0 outline-none"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default TwoFactorCode;
