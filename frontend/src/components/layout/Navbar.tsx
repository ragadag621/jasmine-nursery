import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'בית' },
  { to: '/about', label: 'אודות' },
  { to: '/plants', label: 'קטלוג צמחים' },
  { to: '/gallery', label: 'גלריה' },
  { to: '/services', label: 'שירותים' },
  { to: '/contact', label: 'צור קשר' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-[var(--color-forest-800)]' : 'text-[var(--color-ink-600)] hover:text-[var(--color-forest-700)]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-sage-200)] bg-[var(--color-cream-50)]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <NavLink to="/" className="font-display text-lg text-[var(--color-forest-800)]">
          משתלת אליאסמין
        </NavLink>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="פתח תפריט"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="h-0.5 w-6 bg-[var(--color-forest-800)]" />
          <span className="h-0.5 w-6 bg-[var(--color-forest-800)]" />
          <span className="h-0.5 w-6 bg-[var(--color-forest-800)]" />
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <ul className="flex flex-col gap-1 border-t border-[var(--color-sage-200)] bg-[var(--color-cream-50)] px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <div className="rounded-md px-2 py-2.5">{link.label}</div>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
