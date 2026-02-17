'use client';
import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, maxLength = 300, value, onChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value ?? '');
  const val = typeof value === 'string' ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div
      className={cn(
        'group flex h-[87px] min-h-[87px] flex-col justify-between self-stretch rounded-2xl border border-neutral-95 bg-white p-4 focus-within:border-label-normal',
        className,
      )}
    >
      <textarea
        ref={ref}
        className={
          'w-full h-full resize-none bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground flex-1'
        }
        maxLength={maxLength}
        value={val}
        onChange={handleChange}
        {...props}
      />
      <div className="flex justify-end items-start gap-[1.5px] body-14">
        <span className="text-label-assistive group-focus-within:text-label-alternative">
          {String(val).length}
        </span>
        <span className="text-label-assistive">/</span>
        <span className="text-label-assistive">{maxLength}</span>
      </div>
    </div>
  );
});
Textarea.displayName = 'Textarea';
