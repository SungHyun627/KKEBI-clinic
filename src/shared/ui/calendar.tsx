'use client';

import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import Image from 'next/image';
import { useLocale } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import { buttonVariants } from '@/shared/ui/button';

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  components,
  month,
  defaultMonth,
  onMonthChange,
  ...props
}: React.ComponentProps<typeof DayPicker>) => {
  const locale = useLocale();
  const [internalMonth, setInternalMonth] = React.useState<Date>(defaultMonth ?? new Date());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = React.useState(false);
  const [pickerYear, setPickerYear] = React.useState<number>(
    (month ?? defaultMonth ?? new Date()).getFullYear(),
  );
  const currentMonth = month ?? internalMonth;

  const handleMonthChange = React.useCallback(
    (nextMonth: Date) => {
      if (!month) {
        setInternalMonth(nextMonth);
      }
      onMonthChange?.(nextMonth);
    },
    [month, onMonthChange],
  );

  const monthLabels = React.useMemo(
    () =>
      locale === 'en'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    [locale],
  );
  const defaultClassNames = getDefaultClassNames();
  const mergedClassNames = {
    ...defaultClassNames,
    root: cn('relative w-fit'),
    months: cn('flex flex-col'),
    month: cn('space-y-7', isMonthPickerOpen && 'space-y-0'),
    month_caption: cn(
      'relative flex items-center justify-center pt-1',
      isMonthPickerOpen && 'h-0 min-h-0 overflow-hidden p-0',
    ),
    caption_label: cn(
      'body-14 text-netural-30 absolute left-1/2 -translate-x-1/2 font-medium text-center pt-3',
      isMonthPickerOpen && 'invisible pointer-events-none',
    ),
    nav: cn('absolute inset-x-0  flex h-[21.334px] items-center justify-between px-1'),
    button_previous: cn(
      buttonVariants({ variant: 'outline', size: 'icon' }),
      'h-6 w-6 border-0 p-0 hover:bg-white',
    ),
    button_next: cn(
      buttonVariants({ variant: 'icon', size: 'icon' }),
      'h-6 w-6 rounded-md border-0 p-0 hover:bg-white',
    ),
    month_grid: cn('w-full border-collapse', isMonthPickerOpen && 'hidden'),
    weekdays: cn('grid w-full grid-cols-7 gap-x-[3px]', isMonthPickerOpen && 'hidden'),
    weekday: cn(
      'body-14 flex h-[47.6px] w-[33.3px] items-center justify-center px-0 pt-1 pb-[3px] font-normal text-neutral-50',
    ),
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

  const mergedComponents: React.ComponentProps<typeof DayPicker>['components'] = {
    Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) =>
      orientation === 'left' ? (
        <Image
          src="/icons/big-left.svg"
          alt=""
          width={24}
          height={24}
          className={cn('h-full w-full object-contain', chevronClassName)}
          aria-hidden
          {...chevronProps}
        />
      ) : (
        <Image
          src="/icons/big-right.svg"
          alt=""
          width={24}
          height={24}
          className={cn('h-full w-full object-contain', chevronClassName)}
          aria-hidden
          {...chevronProps}
        />
      ),
    CaptionLabel: ({ children, className: captionClassName, ...captionProps }) => (
      <div className="flex items-center justify-center">
        <button
          type="button"
          className={cn(
            'body-14 pt-3 font-medium text-center text-netural-30 hover:cursor-pointer',
            captionClassName,
          )}
          onClick={() => {
            setPickerYear(currentMonth.getFullYear());
            setIsMonthPickerOpen((prev) => !prev);
          }}
          {...captionProps}
        >
          {children}
        </button>
      </div>
    ),
    ...components,
  };

  return (
    <div className={cn('relative', className)}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        month={currentMonth}
        defaultMonth={defaultMonth}
        onMonthChange={handleMonthChange}
        className={cn(className)}
        classNames={mergedClassNames}
        formatters={{
          formatWeekdayName: (date) =>
            new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
              weekday: 'short',
            }).format(date),
          formatCaption: (date) =>
            locale === 'en'
              ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date)
              : `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
        }}
        components={mergedComponents}
        {...props}
      />
      {isMonthPickerOpen ? (
        <div className="mx-auto inline-flex w-[252px] flex-col rounded-lg border border-neutral-95 bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              className="h-6 w-6 rounded-md hover:bg-neutral-95"
              onClick={() => setPickerYear((prev) => prev - 1)}
              aria-label="Previous year"
            >
              <Image src="/icons/big-left.svg" alt="" width={20} height={20} aria-hidden />
            </button>
            <span className="body-14 font-medium text-label-normal">{pickerYear}</span>
            <button
              type="button"
              className="h-6 w-6 rounded-md hover:bg-neutral-95"
              onClick={() => setPickerYear((prev) => prev + 1)}
              aria-label="Next year"
            >
              <Image src="/icons/big-right.svg" alt="" width={20} height={20} aria-hidden />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {monthLabels.map((label, monthIndex) => (
              <button
                key={`${label}-${monthIndex}`}
                type="button"
                className={cn(
                  'h-8 w-full rounded-md body-12 hover:bg-neutral-95',
                  currentMonth.getFullYear() === pickerYear &&
                    currentMonth.getMonth() === monthIndex
                    ? 'bg-neutral-95 text-label-normal'
                    : '',
                )}
                onClick={() => {
                  const nextMonth = new Date(currentMonth);
                  nextMonth.setFullYear(pickerYear);
                  nextMonth.setMonth(monthIndex);
                  handleMonthChange(nextMonth);
                  setIsMonthPickerOpen(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export { Calendar };
