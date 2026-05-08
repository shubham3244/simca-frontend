import { cn } from '../../utils/cn';

interface TagNetworkBrandProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'h-12 w-16 text-xs',
  md: 'h-16 w-20 text-sm',
  lg: 'h-20 w-24 text-base',
};

export function TagNetworkBrand({ size = 'md', className }: TagNetworkBrandProps) {
  return (
    <div
      aria-label="TAG Network"
      className={cn(
        'flex flex-col items-center justify-center rounded-md bg-primary text-primary-foreground font-bold leading-tight',
        sizeStyles[size],
        className,
      )}
    >
      <span>TAG</span>
      <span className="text-[0.7em] font-semibold tracking-wider">NETWORK</span>
    </div>
  );
}
