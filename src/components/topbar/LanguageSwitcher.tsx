import { useState } from 'react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

type LanguageCode = 'EN' | 'FR';

const LANGUAGES: Array<{ code: LanguageCode; label: string }> = [
  { code: 'EN', label: 'English (EN)' },
  { code: 'FR', label: 'Français (FR)' },
];

export function LanguageSwitcher() {
  const [current, setCurrent] = useState<LanguageCode>('EN');

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
          aria-label={`Language: ${current}`}
          className="flex h-9 items-center gap-1 rounded-md px-2 text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          {current}
          <svg className="size-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    >
      {(close) =>
        LANGUAGES.map((lang) => (
          <DropdownItem
            key={lang.code}
            onClick={() => {
              setCurrent(lang.code);
              close();
            }}
          >
            {lang.label}
          </DropdownItem>
        ))
      }
    </Dropdown>
  );
}
