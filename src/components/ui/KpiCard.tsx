import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface KpiCardProps {
  title: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function KpiCard({ title, icon, className, children }: KpiCardProps) {
  return (
    <section
      className={cn(
        'rounded-lg bg-card p-6 shadow-sm',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <h2 className="text-base font-medium text-foreground">{title}</h2>
        {icon}
      </header>
      <div className="mt-4">{children}</div>
    </section>
  );
}
