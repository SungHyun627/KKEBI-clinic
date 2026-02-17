'use client';

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import type { ComponentProps } from 'react';

export function Toast(props: ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: [
            'rounded-[100px]',
            'flex',
            'h-12',
            'border-0',
            'py-[9px]',
            'px-5',
            'justify-center',
            'items-center',
            'gap-[10px]',
          ].join(' '),
          title: '',
          description: '',
          actionButton: '',
          cancelButton: '',
        },
        style: {
          background: 'rgba(46,47,51,0.88)',
          boxShadow:
            '0 0 15px 0 rgba(0,0,0,0.03), 0 2px 30px 0 rgba(0,0,0,0.08), 0 0 1px 0 rgba(0,0,0,0.30)',
          color: '#fff',
          fontFamily: 'Pretendard, sans-serif',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '160%',
          textAlign: 'center',
          borderRadius: '100px',
          border: 'none',
        },
      }}
      {...props}
    />
  );
}

export const toast = sonnerToast;
