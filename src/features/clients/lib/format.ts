export function toKoreanDate(input: string) {
  const parsed = new Date(input.includes(' ') ? input.replace(' ', 'T') : input);
  if (Number.isNaN(parsed.getTime())) return input;
  return `${parsed.getFullYear()}년 ${parsed.getMonth() + 1}월 ${parsed.getDate()}일`;
}
