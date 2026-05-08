import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...opts, resolve });
    });
  }, []);

  const settle = (value: boolean) => {
    setState((current) => {
      current?.resolve(value);
      return null;
    });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        isOpen={state !== null}
        onClose={() => settle(false)}
        title={state?.title ?? ''}
        maxWidth="sm"
        ariaLabel="Confirmation"
      >
        <div className="flex flex-col gap-5 p-5">
          {state?.message && (
            <div className="text-sm leading-relaxed text-foreground">
              {state.message}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => settle(false)}
              // Destructive confirms focus the safe action by default
              data-autofocus={state?.variant === 'destructive' ? true : undefined}
            >
              {state?.cancelLabel ?? 'Cancel'}
            </Button>
            <Button
              variant={state?.variant === 'destructive' ? 'destructive' : 'primary'}
              onClick={() => settle(true)}
              data-autofocus={state?.variant !== 'destructive' ? true : undefined}
            >
              {state?.confirmLabel ?? 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>');
  }
  return ctx;
}
