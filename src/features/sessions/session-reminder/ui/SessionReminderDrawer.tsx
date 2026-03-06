'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';
import Divider from '@/shared/ui/divider';
import { sendSessionReminder } from '@/features/sessions/session-reminder/api/sendSessionReminder';
import { toast } from '@/shared/ui/toast';
import type { ReminderChannel } from '../types/session-reminder';
const MESSAGE_MAX_LENGTH = 1000;

interface SessionReminderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  clientId: string;
  clientName: string;
  scheduledTime?: string;
}

const CHANNELS: Array<{
  value: ReminderChannel;
  icon: string;
  ko: string;
  en: string;
  disabled?: boolean;
}> = [
  { value: 'push', icon: '/icons/alert.svg', ko: '앱 푸시 알림', en: 'App push', disabled: true },
  { value: 'email', icon: '/icons/email.svg', ko: '이메일', en: 'Email' },
  { value: 'sms', icon: '/icons/sms.svg', ko: 'SMS 문자', en: 'SMS', disabled: true },
];

const SessionReminderDrawer = ({
  open,
  onOpenChange,
  sessionId,
  clientId,
  clientName,
  scheduledTime,
}: SessionReminderDrawerProps) => {
  const locale = useLocale();
  const todayDateKey = getTodayDateKey();
  const todayDate = formatDateForDisplay(todayDateKey, locale);
  const fixedTime = normalizeScheduleTime(scheduledTime) ?? '09:00';
  const [channels, setChannels] = useState<ReminderChannel[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultMessage =
    locale === 'en'
      ? `Hello ${clientName}, this is a reminder for your counseling session scheduled on ${todayDate} ${fixedTime}. If you cannot attend, please let us know in advance.`
      : `안녕하세요 ${clientName}님, ${todayDate} ${fixedTime}에 예정된 상담 세션을 알려드립니다. 참석이 어려우시면 미리 알려주세요.`;

  const labels = useMemo(
    () => ({
      title: locale === 'en' ? 'Send Session Reminder' : '세션 알림 발송',
      subtitle:
        locale === 'en'
          ? `Send the next session reminder to ${clientName}.`
          : `${clientName}님께 다음 상담 세션 알림을 발송합니다.`,
      scheduleTitle: locale === 'en' ? 'Next session schedule' : '다음 상담',
      channelTitle: locale === 'en' ? 'Notification channels' : '알림 유형 선택',
      messageTitle: locale === 'en' ? 'Message' : '메시지 내용',
      messagePlaceholder:
        locale === 'en' ? 'Please enter the message content.' : '메시지 내용을 입력해 주세요.',
      cancel: locale === 'en' ? 'Cancel' : '취소',
      send: locale === 'en' ? 'Send' : '발송하기',
    }),
    [clientName, locale],
  );

  const readonlyScheduleLabel = `${todayDate} ${fixedTime}`;
  const isSendEnabled = channels.length > 0;
  const resolvedMessage = message || defaultMessage;

  const toggleChannel = (next: ReminderChannel) => {
    setChannels((prev) => {
      if (prev.includes(next)) {
        return prev.filter((channel) => channel !== next);
      }
      return [...prev, next];
    });
  };

  const handleSend = async () => {
    if (!isSendEnabled || isSubmitting) return;

    setIsSubmitting(true);
    const result = await sendSessionReminder(sessionId);
    setIsSubmitting(false);

    if (!result.success) {
      toast(
        result.message ||
          (locale === 'en' ? 'Failed to send session reminder.' : '세션 알림 발송에 실패했습니다.'),
      );
      return;
    }

    toast(
      locale === 'en'
        ? `Session reminder sent to ${clientName}.`
        : `${clientName} 님에게 세션 알림이 발송되었습니다.`,
    );
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="flex max-w-[695px] flex-col gap-[26px] overflow-y-auto bg-neutral-99 px-8 py-[23px]"
      >
        <DrawerClose asChild>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center hover:cursor-pointer"
          >
            <Image src="/icons/fold.svg" alt="" width={20} height={20} aria-hidden />
          </button>
        </DrawerClose>

        <DrawerHeader className="flex flex-col w-full items-start gap-2 p-0">
          <DrawerTitle>{labels.title}</DrawerTitle>
          <p className="body-16 text-neutral-40">{labels.subtitle}</p>
        </DrawerHeader>

        <div className="flex w-full flex-col gap-[34px]">
          <div className="flex w-full px-3 py-4 gap-[6px] rounded-2xl bg-white">
            <div className="flex w-[53px] h-[53px] rounded-[10px] bg-[#FEECEC] justify-center items-center">
              <Image src="/icons/date.svg" alt="date" width={28} height={28} aria-hidden />
            </div>
            <div className="flex flex-col justify-center gap-[3px]">
              <span className="body-16 text-label-alternative">{labels.scheduleTitle}</span>
              <span className="body-16 font-semibold text-label-normal">
                {readonlyScheduleLabel}
              </span>
            </div>
          </div>
          <Divider />

          <div className="flex flex-col w-full gap-[42px]">
            <div className="flex flex-col w-full gap-4">
              <span className="body-18 font-semibold text-neutral-20">{labels.channelTitle}</span>
              <div className="flex w-full gap-4 justify-between items-center">
                {CHANNELS.map((channel) => {
                  const isDisabled = Boolean(channel.disabled);
                  const selected = channels.includes(channel.value);
                  return (
                    <button
                      key={channel.value}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => toggleChannel(channel.value)}
                      className={cn(
                        'flex flex-col w-full h-24 items-center justify-center gap-2 p-5 rounded-2xl border border-neutral-95 body-16 font-medium hover:cursor-pointer active:bg-neutral-95 active:text-label-neutral active:border-neutral-95',
                        isDisabled
                          ? 'cursor-not-allowed border-neutral-95 bg-neutral-99 text-label-disable'
                          : selected
                            ? 'border-primary bg-fill-pressed text-primary'
                            : 'border-neutral-95 bg-white text-label-alternative',
                      )}
                    >
                      <span
                        className={cn(
                          'h-6 w-6',
                          isDisabled
                            ? 'bg-label-disable'
                            : selected
                              ? 'bg-primary'
                              : 'bg-label-neutral',
                        )}
                        style={{
                          maskImage: `url(${channel.icon})`,
                          WebkitMaskImage: `url(${channel.icon})`,
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                        }}
                        aria-hidden
                      />
                      {locale === 'en' ? channel.en : channel.ko}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col w-full gap-4">
              <span className="body-18 font-semibold text-neutral-20">{labels.messageTitle}</span>
              <Textarea
                value={resolvedMessage}
                placeholder={labels.messagePlaceholder}
                onChange={(event) => setMessage(event.target.value.slice(0, MESSAGE_MAX_LENGTH))}
                className="min-h-[148px] resize-none rounded-2xl border-none bg-white"
                maxLength={1000}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            className="w-full max-w-[144px]"
          >
            {labels.cancel}
          </Button>
          <Button
            type="button"
            size="lg"
            className="w-full max-w-[264px]"
            disabled={!isSendEnabled || isSubmitting}
            onClick={handleSend}
          >
            {isSubmitting ? (locale === 'en' ? 'Sending...' : '발송 중...') : labels.send}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const getTodayDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const formatDateForDisplay = (dateKey: string, locale: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const safeDate = new Date(year, (month || 1) - 1, day || 1);

  if (locale === 'en') {
    return safeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return `${year}년 ${month}월 ${day}일`;
};

const normalizeScheduleTime = (value?: string) => {
  if (!value) return null;
  const matched = value.match(/^(\d{1,2}):(\d{2})/);
  if (!matched) return null;
  const hour = String(Number(matched[1])).padStart(2, '0');
  const minute = matched[2];
  return `${hour}:${minute}`;
};

export default SessionReminderDrawer;
