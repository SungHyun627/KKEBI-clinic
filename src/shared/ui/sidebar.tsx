import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const Sidebar = React.forwardRef<HTMLElement, React.ComponentProps<'aside'>>(
  ({ className, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          'flex h-screen w-full max-w-[258px] flex-col border-r border-neutral-95 bg-neutral-99',
          className,
        )}
        {...props}
      />
    );
  },
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(className)} {...props} />;
  },
);
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-1 flex-col gap-2 px-4', className)} {...props} />
    );
  },
);
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('mt-auto p-4', className)} {...props} />;
  },
);
SidebarFooter.displayName = 'SidebarFooter';

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex min-h-screen flex-1 flex-col', className)} {...props} />
    );
  },
);
SidebarInset.displayName = 'SidebarInset';

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => {
    return <ul ref={ref} className={cn('flex flex-col gap-3', className)} {...props} />;
  },
);
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => {
    return <li ref={ref} className={cn('list-none', className)} {...props} />;
  },
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'flex w-full items-center px-5 py-2 body-16 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
  {
    variants: {
      active: {
        true: 'bg-fill-pressed text-primary font-semibold rounded-[12px] hover:bg-fill-pressed hover:text-primary',
        false: 'text-label-alternative hover:bg-neutral-95 hover:text-label-normal rounded-[12px]',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> &
    VariantProps<typeof sidebarMenuButtonVariants> & {
      asChild?: boolean;
    }
>(({ className, asChild = false, active, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp ref={ref} className={cn(sidebarMenuButtonVariants({ active }), className)} {...props} />
  );
});
SidebarMenuButton.displayName = 'SidebarMenuButton';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};
