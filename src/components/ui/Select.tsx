import type { Ref, SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  ref?: Ref<HTMLSelectElement>;
}

export function Select({
  label,
  error,
  helperText,
  required,
  id,
  className,
  children,
  ref,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const describedById = error
    ? `${selectId}-error`
    : helperText
      ? `${selectId}-helper`
      : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById}
          className={cn(
            'h-10 w-full appearance-none rounded-md border bg-input-background px-3 pr-9 text-sm text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/30'
              : 'border-border focus:border-ring focus:ring-ring/30',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
