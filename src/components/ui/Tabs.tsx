import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface TabsContextValue<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs.* must be rendered inside <Tabs>');
  }
  return ctx;
}

interface TabsProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs<T extends string>({
  value,
  onValueChange,
  children,
  className,
}: TabsProps<T>) {
  return (
    <TabsContext.Provider
      value={{ value, onChange: onValueChange as (v: string) => void }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex w-full gap-1 rounded-lg bg-muted p-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: active, onChange } = useTabsContext();
  const isActive = active === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onChange(value)}
      className={cn(
        'flex-1 rounded-md px-4 py-2.5 text-sm transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive
          ? 'bg-primary font-semibold text-primary-foreground shadow-md'
          : 'font-medium text-muted-foreground hover:bg-background hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: active } = useTabsContext();
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}
