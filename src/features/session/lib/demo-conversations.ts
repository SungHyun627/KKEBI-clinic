import type { SessionAutoRecordData } from '../types/session-page';

type DemoLine = Pick<SessionAutoRecordData['transcripts'][number], 'speaker' | 'text'>;

const demoConversationKo: DemoLine[] = [
  {
    speaker: 'counselor',
    text: '오늘은 지난주보다 표정이 조금 무거워 보이는데, 어떤 일이 있었나요?',
  },
  { speaker: 'client', text: '회사에서 매번 실수하는 것 같아서 자신감이 많이 떨어졌어요.' },
  {
    speaker: 'counselor',
    text: '매번이라는 표현이 나왔네요. 최근에 특히 기억나는 순간이 있을까요?',
  },
  { speaker: 'client', text: '어제 보고서가 늦었는데, 상사가 이러면 망했다고 했어요.' },
  { speaker: 'counselor', text: '그 말을 들었을 때 몸이나 감정은 어떻게 반응했나요?' },
  {
    speaker: 'client',
    text: '심장이 빨리 뛰고, 저는 완전히 실패한 사람이라는 생각이 들었어요.',
  },
  { speaker: 'counselor', text: '그 생각이 들 때 스스로에게 어떤 말을 하게 되나요?' },
  { speaker: 'client', text: '절대 나아질 수 없고, 그냥 포기하고 싶다는 생각이 들어요.' },
  {
    speaker: 'counselor',
    text: '포기하고 싶은 마음이 커질 때, 자해나 자살 같은 생각도 함께 떠오르나요?',
  },
  {
    speaker: 'client',
    text: '가끔 자해 생각이 스쳐 지나가고, 죽고 싶다는 생각도 잠깐 들어요.',
  },
];

const demoConversationEn: DemoLine[] = [
  {
    speaker: 'counselor',
    text: 'You look a bit heavier than last week. What happened recently?',
  },
  {
    speaker: 'client',
    text: 'I feel like I fail at work every single time, and my confidence has dropped a lot.',
  },
  {
    speaker: 'counselor',
    text: 'I heard “every single time.” Can you share one recent moment?',
  },
  {
    speaker: 'client',
    text: 'My report was late yesterday, and I thought everything was ruined.',
  },
  {
    speaker: 'counselor',
    text: 'When you heard that, what happened in your body and emotions?',
  },
  {
    speaker: 'client',
    text: 'My heart raced and I felt like I was a complete failure.',
  },
  {
    speaker: 'counselor',
    text: 'When that thought appears, what do you say to yourself?',
  },
  {
    speaker: 'client',
    text: 'I feel I can never get better, and I just want to give up.',
  },
  {
    speaker: 'counselor',
    text: 'When that feeling grows, do self-harm or suicide thoughts come up too?',
  },
  {
    speaker: 'client',
    text: 'Sometimes self-harm thoughts pass by, and I briefly think about suicide.',
  },
];

export function getDemoConversation(locale: string): DemoLine[] {
  return locale === 'en' ? demoConversationEn : demoConversationKo;
}
