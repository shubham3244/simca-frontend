import { Link } from 'react-router-dom';
import { CountrySwitcher } from '../../../components/topbar/CountrySwitcher';
import { LanguageSwitcher } from '../../../components/topbar/LanguageSwitcher';
import { ProfileMenu } from '../../../components/topbar/ProfileMenu';
import { TagNetworkBrand } from '../../../components/ui/TagNetworkBrand';

export function CustomerTopbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <TagNetworkBrand size="sm" />
        <div className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
        <Link
          to="/customer"
          className="hidden items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-foreground hover:bg-accent sm:flex"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </Link>
        <span className="text-base font-semibold text-foreground">
          Customer Portal
        </span>
      </div>

      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <CountrySwitcher />
        <ProfileMenu />
      </div>
    </header>
  );
}
