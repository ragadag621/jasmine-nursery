import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const NAV_LINKS = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/plants', label: t('nav.catalog') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/services', label: t('nav.services') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:scale-x-0 after:bg-[var(--color-forest-700)] after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 ${
      isActive
        ? 'text-[var(--color-forest-800)] after:scale-x-100'
        : 'text-[var(--color-ink-600)] hover:text-[var(--color-forest-700)]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-sage-200)]/80 bg-[var(--color-cream-50)]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
        <NavLink to="/" className="font-display text-lg tracking-tight text-[var(--color-forest-800)]">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ303NQSJwkNnKFjZetSdpxDiJoA-xnlHhRanbal9MfEA&s=10" alt="Al-Yasmin Nursery" className="h-12 w-auto"/>
        </NavLink>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label={t('nav.toggle_menu')}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 origin-center bg-[var(--color-forest-800)] transition-transform duration-300 ${isOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`h-0.5 w-6 bg-[var(--color-forest-800)] transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-0.5 w-6 origin-center bg-[var(--color-forest-800)] transition-transform duration-300 ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="animate-[fadeIn_0.2s_ease-out] border-t border-[var(--color-sage-200)] bg-[var(--color-cream-50)] px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--color-sage-100)] text-[var(--color-forest-800)]'
                        : 'text-[var(--color-ink-600)] hover:bg-[var(--color-sage-100)]'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-[var(--color-sage-200)] pt-3">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}