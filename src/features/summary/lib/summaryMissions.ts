import type { MissionItem } from '@/entities/summary/model/types';

export function getSummaryMissions(locale: string): MissionItem[] {
  return [
    {
      id: 'breathing',
      name: locale === 'en' ? 'Breathing log' : '호흡 훈련 일지',
      category: locale === 'en' ? 'Breathing' : '호흡',
      duration: locale === 'en' ? '10 min' : '10분',
    },
    {
      id: 'sleep',
      name: locale === 'en' ? 'Sleep routine check' : '수면 루틴 체크',
      category: locale === 'en' ? 'Sleep' : '수면',
      duration: locale === 'en' ? '15 min' : '15분',
    },
    {
      id: 'walk',
      name: locale === 'en' ? 'Morning walk' : '아침 산책',
      category: locale === 'en' ? 'Activity' : '활동',
      duration: locale === 'en' ? '20 min' : '20분',
    },
    {
      id: 'thought',
      name: locale === 'en' ? 'Thought record' : '사고기록지 작성',
      category: locale === 'en' ? 'CBT' : '인지기록',
      duration: locale === 'en' ? '15 min' : '15분',
    },
    {
      id: 'gratitude',
      name: locale === 'en' ? 'Gratitude note' : '감사일기',
      category: locale === 'en' ? 'Journaling' : '저널링',
      duration: locale === 'en' ? '10 min' : '10분',
    },
    {
      id: 'stretch',
      name: locale === 'en' ? 'Night stretching' : '취침 전 스트레칭',
      category: locale === 'en' ? 'Body care' : '신체관리',
      duration: locale === 'en' ? '8 min' : '8분',
    },
  ];
}
