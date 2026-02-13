import { cn } from '@/shared/lib/utils';

interface DividerProps {
  className?: string;
}

export default function Divider({ className }: DividerProps) {
  return <div className={cn('h-[1px] w-full bg-neutral-95', className)} aria-hidden />;
}
