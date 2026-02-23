import { useTranslations } from 'next-intl';

export default function RecordCompleteChip() {
  const tSessions = useTranslations('sessionList');

  return (
    <span className="inline-flex items-center justify-center gap-[3px] rounded-[100px] border border-[rgba(250,84,84,0.60)] bg-[rgba(250,84,84,0.10)] px-3 py-[3px]">
      <span className="body-16 whitespace-nowrap leading-none font-medium text-primary">
        {tSessions('recordCompleteChip')}
      </span>
    </span>
  );
}
