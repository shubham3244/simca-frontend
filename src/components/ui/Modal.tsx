import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  closeOnBackdropClick?: boolean;
  ariaLabel?: string;
  contentClassName?: string;
}

const widthMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
  '2xl': 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  closeOnBackdropClick = true,
  ariaLabel,
  contentClassName,
}: ModalProps) {
  const titleId = useId();
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Keep onClose stable in a ref so it doesn't trigger the open/close effect
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Open/close lifecycle: runs ONCE per isOpen toggle.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKey);

    // Auto-focus order:
    //   1. explicit [data-autofocus] (consumer-controlled, e.g. safe action on destructive confirm)
    //   2. first text input (form modals shouldn't trap focus on the close button)
    //   3. first focusable button or [tabindex]
    const rafId = requestAnimationFrame(() => {
      const root = dialogRef.current;
      if (!root) return;
      const explicit = root.querySelector<HTMLElement>(
        '[data-autofocus]:not([disabled])',
      );
      const textInput = root.querySelector<HTMLElement>(
        'textarea:not([disabled]), input:not([disabled]):not([type="hidden"])',
      );
      const focusable =
        explicit ??
        textInput ??
        root.querySelector<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
      focusable?.focus();
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      previouslyFocused.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => closeOnBackdropClick && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title && ariaLabel ? ariaLabel : undefined}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex max-h-[90vh] w-full flex-col rounded-lg bg-background shadow-xl',
          widthMap[maxWidth],
          contentClassName,
        )}
      >
        {title && (
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2
              id={titleId}
              className="text-base font-semibold text-foreground"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
