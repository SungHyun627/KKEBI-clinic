import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer font-semibold disabled:bg-label-disable',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-dark disabled:hover:no-underline',
        outline:
          'border border-input text-label-alternative bg-background hover:bg-neutral-99 disabled:border-label-disable disabled:text-neutral-95 disabled:hover:no-underline disabled:bg-normal',
        pause: 'bg-normal border border-input text-primary hover:bg-neutral-99',
        icon: 'border border-input border-neutral-95 bg-transparent hover:bg-neutral-99 flex items-center justify-center p-0 disabled:bg-label-disable',
      },
      size: {
        lg: 'h-[58px] px-3 py-4 body-16 rounded-2xl',
        md: 'h-[42px] px-[10px] py-2 body-14 rounded-md',
        sm: 'h-[34px] px-4 py-[6px] body-14 rounded-md',
        default: 'h-[58px] px-3 py-4 body-16 rounded-2xl',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
