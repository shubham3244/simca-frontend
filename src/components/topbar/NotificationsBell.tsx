import { Dropdown } from '../ui/Dropdown';
import { cn } from '../../utils/cn';

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: "Workshop 'AutoGlass Pro' updated claim WC-2024-001",
    subtitle: 'Workshop Update',
  },
  {
    id: 'n2',
    title: 'SLA deadline approaching for claim WC-2024-005',
    subtitle: 'System Alert',
  },
];

export function NotificationsBell() {
  const count = MOCK_NOTIFICATIONS.length;

  return (
    <Dropdown
      align="right"
      panelClassName="w-80 p-2"
      trigger={({ toggle, isOpen }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Notifications${count ? ` — ${count} unread` : ''}`}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            'relative flex size-9 items-center justify-center rounded-md text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/30',
          )}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {count > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground"
            >
              {count}
            </span>
          )}
        </button>
      )}
    >
      <div className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Notifications
      </div>
      {MOCK_NOTIFICATIONS.length === 0 ? (
        <div className="px-3 py-4 text-center text-sm text-muted-foreground">
          No notifications
        </div>
      ) : (
        <ul className="flex flex-col">
          {MOCK_NOTIFICATIONS.map((n) => (
            <li
              key={n.id}
              className="rounded-md px-3 py-2 hover:bg-accent"
            >
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.subtitle}</p>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
