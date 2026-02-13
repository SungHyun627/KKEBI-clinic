'use client';

import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import Image from 'next/image';

import { cn } from '@/shared/lib/utils';
import { buttonVariants } from '@/shared/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();
  const mergedClassNames = {
    ...defaultClassNames,
    root: cn('w-fit'),
    months: cn('flex flex-col'),
    month: cn('space-y-7'),
    caption: cn('relative flex items-center justify-center pt-1'),
    caption_label: cn(
      'body-14 text-netural-30 absolute left-1/2 -translate-x-1/2 font-medium text-center',
    ),
    nav: cn('absolute inset-x-0 top-4.5 flex h-[21.334px] items-center justify-between'),
    button_previous: cn(
      buttonVariants({ variant: 'outline', size: 'icon' }),
      'h-6 w-6 border-0 p-0 hover:bg-white',
    ),
    button_next: cn(
      buttonVariants({ variant: 'icon', size: 'icon' }),
      'h-6 w-6 rounded-md border-0 p-0 hover:bg-white',
    ),
    month_grid: cn('w-full border-collapse'),
    weekdays: cn('grid w-full grid-cols-7 gap-x-[3px]'),
    weekday: cn(
      'body-14 flex h-[47.6px] w-[33.3px] items-center justify-center px-0 pt-1 pb-[3px] font-normal text-neutral-50',
    ),
    weeks: cn('grid gap-y-2'),
    week: cn('grid w-full grid-cols-7 gap-x-[3px]'),
    day: cn(
      buttonVariants({ variant: 'outline', size: 'icon' }),
      'h-[47.6px] w-[33.3px] hover:cursor-pointer rounded-md border-0 px-0 pt-1 pb-[3px] font-normal text-netural-40 data-[selected=true]:rounded-[14.223px] data-[selected=true]:bg-[rgba(250,84,84,0.10)] data-[selected=true]:text-primary',
    ),
    day_button: cn('h-[47.6px] w-[33.3px] rounded-[14.223px] px-0 pt-1 pb-[3px] font-normal'),
    selected: cn('text-primary'),
    outside: cn('text-neutral-60 opacity-50'),
    disabled: cn('text-neutral-60 opacity-50'),
    hidden: cn('invisible'),
    ...classNames,
  };
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(className)}
      classNames={mergedClassNames}
      formatters={{
        formatWeekdayName: (date) =>
          new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date),
        formatCaption: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) =>
          orientation === 'left' ? (
            <Image
              src="/icons/big-left.svg"
              alt=""
              width={24}
              height={24}
              className={cn('h-full w-full object-contain ml-4', chevronClassName)}
              aria-hidden
              {...chevronProps}
            />
          ) : (
            <Image
              src="/icons/big-right.svg"
              alt=""
              width={24}
              height={24}
              className={cn('h-full w-full object-contain mr-4', chevronClassName)}
              aria-hidden
              {...chevronProps}
            />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
