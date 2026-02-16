export function formatDateByLocale(input: string, locale: string) {
  const parsed = new Date(input.includes(' ') ? input.replace(' ', 'T') : input);
  if (Number.isNaN(parsed.getTime())) return input;
  if (locale === 'en') {
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return `${parsed.getFullYear()}년 ${parsed.getMonth() + 1}월 ${parsed.getDate()}일`;
}

export function toKoreanDate(input: string) {
  return formatDateByLocale(input, 'ko');
}
