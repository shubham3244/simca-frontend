import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface DropdownProps {
  trigger: (state: { isOpen: boolean; toggle: () => void }) => ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: 'left' | 'right';
  panelClassName?: string;
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = 'right',
  panelClassName,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((s) => !s);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointer = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {trigger({ isOpen, toggle })}
      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 mt-2 min-w-[12rem] rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  destructive?: boolean;
  leftIcon?: ReactNode;
}

export function DropdownItem({
  onClick,
  className,
  children,
  destructive,
  leftIcon,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none',
        destructive ? 'text-destructive' : 'text-foreground',
        className,
      )}
    >
      {leftIcon && <span className="text-muted-foreground">{leftIcon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  );
}
