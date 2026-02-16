import type { AbstractIntlMessages } from 'next-intl';

const CLIENT_NAME_MAP: Record<string, { ko: string; en: string }> = {
  client_1001: { ko: '김하늘', en: 'Ellie Wynn' },
  client_1007: { ko: '박준서', en: 'June Kim' },
  client_1012: { ko: '이유진', en: 'Yujin Lee' },
  client_1013: { ko: '최민수', en: 'Steve Jackson' },
  client_1014: { ko: '이수빈', en: 'Soo Teh' },
  client_1015: { ko: '정도윤', en: 'Emma Williams' },
  client_1016: { ko: '한지우', en: 'Olivia Johnson' },
  client_1017: { ko: '서민호', en: 'Minsoo Kim' },
  client_1018: { ko: '김지안', en: 'Jin Hops' },
  client_1019: { ko: '박유진', en: 'Sophia Brown' },
  client_1020: { ko: '정시온', en: 'Ava Miller' },
  client_1021: { ko: '오하린', en: 'Mia Davis' },
  client_1022: { ko: '윤태현', en: 'Noah Wilson' },
  client_1023: { ko: '문가은', en: 'Liam Anderson' },
  client_1024: { ko: '최도현', en: 'Ethan Taylor' },
  client_1025: { ko: '김주원', en: 'James Thomas' },
  client_1026: { ko: '이하늘', en: 'Lucas Martinez' },
  client_1027: { ko: '최지민', en: 'Chloe Kim' },
  client_1028: { ko: '오세훈', en: 'Sehun Oh' },
  client_1029: { ko: '류수아', en: 'Sua Ryu' },
  client_1030: { ko: '배지후', en: 'Jihoo Bae' },
};

export function getClientNameByLocale(
  clientId: string,
  fallbackName: string,
  locale: string,
): string {
  const mapped = CLIENT_NAME_MAP[clientId];
  if (!mapped) return fallbackName;
  return locale === 'en' ? mapped.en : mapped.ko;
}
