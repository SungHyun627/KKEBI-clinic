export function renderHighlightedText(text: string, locale: string) {
  const riskKeywords =
    locale === 'en'
      ? ['self-harm', 'suicide', 'give up', 'hard']
      : ['자해', '자살', '죽고 싶다', '힘들어', '포기'];

  const escaped = riskKeywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const matched = riskKeywords.some((keyword) => keyword.toLowerCase() === part.toLowerCase());
    if (!matched) return <span key={`${part}-${index}`}>{part}</span>;

    return (
      <span key={`${part}-${index}`} className="rounded-[4px] bg-[#FFE2E2] px-1 text-[#DB2C2C]">
        {part}
      </span>
    );
  });
}
