import type { Ref, TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  rightLabelSlot?: React.ReactNode;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  label,
  error,
  helperText,
  required,
  rightLabelSlot,
  id,
  className,
  ref,
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const describedById = error
    ? `${textareaId}-error`
    : helperText
      ? `${textareaId}-helper`
      : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {(label || rightLabelSlot) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-sm font-medium text-foreground"
            >
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </label>
          )}
          {rightLabelSlot && (
            <span className="text-xs text-muted-foreground">{rightLabelSlot}</span>
          )}
        </div>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById}
        className={cn(
          'min-h-24 w-full rounded-md border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
          error
            ? 'border-destructive focus:border-destructive focus:ring-destructive/30'
            : 'border-border focus:border-ring focus:ring-ring/30',
          className,
        )}
        {...rest}
      />

      {error ? (
        <p id={`${textareaId}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${textareaId}-helper`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
