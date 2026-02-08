'use client';

import type { ComponentProps } from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: 'rounded-2xl border border-neutral-95 bg-white text-label-normal shadow-lg',
          title: 'text-sm font-medium',
          description: 'text-sm text-label-alternative',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-neutral-99 text-label-normal',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
