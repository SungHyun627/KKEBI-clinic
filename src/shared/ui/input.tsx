'use client';
import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  icon?: React.ReactNode;
  onClear?: () => void;
  status?: 'POSTIVE' | 'COMPLETE' | 'NEGATIVE';
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, onClear, status, rightIcon, onRightIconClick, ...props }, ref) => {
    return (
      <div
        className={cn(
          'group relative flex items-center w-full h-14.5 px-4 rounded-2xl border bg-white transition-all gap-2',
          status === 'POSTIVE' && 'border-status-positive',
          status === 'NEGATIVE' && 'border-status-negative',
          status === 'COMPLETE' && 'border-label-normal',
          !status && 'border-neutral-95 hover:border-label-strong',
          status === 'POSTIVE'
            ? 'focus-within:border-positive'
            : status === 'NEGATIVE'
              ? 'focus-within:border-negative'
              : 'focus-within:border-label-normal',
          'has-disabled:bg-fill-normal has-disabled:cursor-not-allowed',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {icon && (
            <div
              className={cn(
                'flex items-center justify-center shrink-0 h-6 w-6 transition-colors duration-200',
                'text-label-alternative',
                'group-focus-within:text-label-strong',
                'group-has-disabled:text-label-disable',
              )}
              tabIndex={-1}
            >
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none border-none p-0 text-base placeholder:text-muted-foreground disabled:text-label-disable disabled:placeholder:text-label-disable disabled:cursor-not-allowed',
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-1">
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="flex items-center justify-center text-label-assistive hover:text-label-strong transition-colors cursor-pointer opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto"
              aria-label="입력 보조 버튼"
              tabIndex={-1}
            >
              {rightIcon}
            </button>
          )}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center justify-center text-label-assistive hover:text-label-strong transition-colors cursor-pointer opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto"
              aria-label="입력 내용 초기화"
              tabIndex={-1}
            >
              <div
                className="h-6 w-6 bg-neutral-20"
                style={{
                  maskImage: 'url(/icons/xmark-circle.svg)',
                  WebkitMaskImage: 'url(/icons/xmark-circle.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            </button>
          )}
        </div>
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
