import { Link } from 'react-router-dom';
import type { Portal } from '../store/auth.types';

interface PortalLink {
  portal: Portal;
  label: string;
  loginPath: string;
}

const ALL_PORTALS: PortalLink[] = [
  { portal: 'CALL_CENTER', label: 'Call Center', loginPath: '/call-center/login' },
  { portal: 'CUSTOMER', label: 'Customer', loginPath: '/customer/login' },
  { portal: 'INSURER', label: 'Insurer', loginPath: '/insurer/login' },
];

interface DevPortalSwitcherProps {
  currentPortal: Portal;
}

/**
 * Dev-only quick-jump links between portal login pages.
 * Renders nothing in production builds — gated by Vite's `import.meta.env.DEV`,
 * which is dead-code-eliminated when `NODE_ENV=production`.
 */
export function DevPortalSwitcher({ currentPortal }: DevPortalSwitcherProps) {
  if (!import.meta.env.DEV) return null;

  const others = ALL_PORTALS.filter((p) => p.portal !== currentPortal);
  if (others.length === 0) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-4 text-xs">
      <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-800">
        Dev
      </span>
      <span className="text-muted-foreground">Switch to:</span>
      {others.map((p, i) => (
        <span key={p.portal}>
          {i > 0 && <span className="mx-1 text-muted-foreground">·</span>}
          <Link
            to={p.loginPath}
            className="font-medium text-primary hover:underline"
          >
            {p.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
