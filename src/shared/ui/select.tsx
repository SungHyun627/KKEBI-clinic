'use client';

import Image from 'next/image';
import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  className?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, options, value, defaultValue, onValueChange, placeholder }, ref) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const selectedValue = value ?? internalValue;
    const selected = options.find((option) => option.value === selectedValue);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const setRefs = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
        return;
      }
      ref.current = node;
    };

    const handleSelect = (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      setIsOpen(false);
    };

    return (
      <div ref={setRefs} className={cn('relative w-full', className)}>
        <button
          type="button"
          className="flex h-10 w-full items-center rounded-[12px] bg-neutral-99 px-4 py-2 outline-none transition-colors hover:border-label-strong focus:border-label-normal"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex w-full items-center justify-between gap-2 hover:cursor-pointer">
            <span className="truncate body-16 text-label-normal">
              {selected?.label ?? placeholder ?? ''}
            </span>
            <Image
              src={isOpen ? '/icons/up.svg' : '/icons/down.svg'}
              alt=""
              width={24}
              height={24}
              aria-hidden
            />
          </span>
        </button>
        <div
          className={cn(
            'absolute top-full w-full flex flex-col items-start shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-50 mt-3 overflow-hidden rounded-[12px] bg-white',
            isOpen ? 'block' : 'hidden',
          )}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <button
                key={option.value}
                type="button"
                className={cn('flex w-full items-center px-2 py-[6px]')}
                onClick={() => handleSelect(option.value)}
              >
                <div
                  className={cn(
                    'flex p-2 w-full justify-start body-16 items-center text-label-normal gap-[10px] rounded-[12px] hover:bg-neutral-95 hover:cursor-pointer',
                    isSelected && 'bg-neutral-99 font-semibold text-primary ',
                  )}
                >
                  {option.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
Select.displayName = 'Select';

export { Select };
