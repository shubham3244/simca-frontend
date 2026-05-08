import { useState } from 'react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

type CountryCode = 'CA' | 'US' | 'AU';

const COUNTRIES: Array<{ code: CountryCode; name: string }> = [
  { code: 'CA', name: 'Canada' },
  { code: 'US', name: 'USA' },
  { code: 'AU', name: 'Australia' },
];

export function CountrySwitcher() {
  const [current, setCurrent] = useState<CountryCode>('CA');
  const currentCountry = COUNTRIES.find((c) => c.code === current)!;

  return (
    <Dropdown
      align="right"
      panelClassName="w-44"
      trigger={({ toggle, isOpen }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={`Country: ${currentCountry.name}`}
          className="flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="text-[11px] font-semibold uppercase text-muted-foreground">
            {currentCountry.code.toLowerCase()}
          </span>
          <span>{currentCountry.name}</span>
          <svg className="size-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    >
      {(close) =>
        COUNTRIES.map((c) => (
          <DropdownItem
            key={c.code}
            onClick={() => {
              setCurrent(c.code);
              close();
            }}
            leftIcon={
              <span className="text-[11px] font-semibold uppercase">
                {c.code.toLowerCase()}
              </span>
            }
          >
            {c.name}
          </DropdownItem>
        ))
      }
    </Dropdown>
  );
}
