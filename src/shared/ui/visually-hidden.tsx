'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

const VisuallyHidden = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      'absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 -m-px',
      className,
    )}
    {...props}
  />
);

export { VisuallyHidden };
