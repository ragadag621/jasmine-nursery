import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';

import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function PlantIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 21V10" />
      <path d="M12 13C8 13 5 10.5 5 6c4.5 0 7 2.5 7 7Z" />
      <path d="M12 10c0-4 2.5-7 7-7 0 4.5-3 7-7 7Z" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H10l2 2h5.5A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-11Z" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4.5 17 4.5-4 3.5 3 2.5-2.5 4.5 4" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 3.5h9l3 3V20.5H6z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12h6M9 15.5h6" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="15" rx="2" />
      <path d="m5 6 7 5 7-5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

const ADMIN_ICONS = [
  DashboardIcon,
  PlantIcon,
  CategoryIcon,
  GalleryIcon,
  ContentIcon,
  MessagesIcon,
];

export function AdminSidebar() {
  const { logout, admin } = useAuth();
  const { t, i18n } = useTranslation();
  const { data: content } = useFetch(fetchSiteContent, []);
  const language = i18n.language.startsWith('ar') ? 'ar' : 'he';

  const [isOpen, setIsOpen] = useState(false);

  const ADMIN_LINKS = [
    {
      to: '/admin',
      label: t('admin.sidebar.dashboard'),
      end: true,
    },
    {
      to: '/admin/plants',
      label: t('admin.sidebar.plants'),
    },
    {
      to: '/admin/categories',
      label: t('admin.sidebar.categories'),
    },
    {
      to: '/admin/gallery',
      label: t('admin.sidebar.gallery'),
    },
    {
      to: '/admin/content',
      label: t('admin.sidebar.content'),
    },
    {
      to: '/admin/messages',
      label: t('admin.sidebar.messages'),
    },
  ];

  const linkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `
      group
      flex
      min-h-11
      items-center
      gap-3
      rounded-lg
      px-3
      py-2.5
      text-sm
      font-medium
      transition-all
      duration-200
      ease-[var(--ease-botanical)]
      ${
        isActive
          ? `
            bg-[var(--color-forest-700)]
            text-white
            shadow-[var(--shadow-soft)]
          `
          : `
            text-[var(--color-ink-900)]
            hover:bg-[var(--color-sage-100)]
            hover:text-[var(--color-forest-800)]
          `
      }
    `;

  useEffect(() => {
    const handleLanguageChanged = () => {
      setIsOpen(false);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleNavigation = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="
          flex
          min-h-16
          items-center
          justify-between
          border-b
          border-[var(--color-border)]
          bg-[var(--color-cream-50)]
          px-4
          md:hidden
        "
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {content?.logo?.url && (
            <img src={content.logo.url} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
          )}

          <div className="min-w-0">
            <p
              className="
                truncate
                font-display
                text-base
                text-[var(--color-forest-800)]
              "
            >
              {content?.siteName?.[language] ?? ''}
            </p>

            {admin && (
              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-[var(--color-ink-600)]
                "
              >
                {admin.username}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t('admin.sidebar.openMenu')}
          aria-expanded={isOpen}
          aria-controls="admin-mobile-sidebar"
          className="
            flex
            min-h-11
            min-w-11
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-white
            bg-[var(--color-forest-700)]
            shadow-[var(--shadow-soft)]
            transition-colors
            hover:bg-[var(--color-forest-700)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--color-forest-600)]
          "
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label={t('admin.sidebar.closeMenu')}
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/30
            md:hidden
          "
        />
      )}

      {/* Mobile drawer */}
      <aside
        id="admin-mobile-sidebar"
        className={`
          fixed
          inset-y-0
          right-0
          z-50
          flex
          w-[min(19rem,88vw)]
          flex-col
          border-l
          border-[var(--color-border)]
          bg-[var(--color-cream-50)]
          p-4
          shadow-[var(--shadow-lifted)]
          transition-transform
          duration-300
          ease-[var(--ease-botanical)]
          md:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!isOpen}
      >
        {/* Drawer header */}
        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-[var(--color-border)]/70
            pb-4
          "
        >
          <div className="flex min-w-0 items-center gap-2.5">
            {content?.logo?.url && (
              <img src={content.logo.url} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
            )}

            <div className="min-w-0">
              <p
                className="
                  truncate
                  font-display
                  text-base
                  text-[var(--color-forest-800)]
                "
              >
                {content?.siteName?.[language] ?? ''}
              </p>

              {admin && (
                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-[var(--color-ink-600)]
                  "
                >
                  {admin.username}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label={t('admin.sidebar.closeMenu')}
            className="
              flex
              min-h-11
              min-w-11
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-[var(--color-forest-800)]
              transition-colors
              hover:bg-[var(--color-sage-100)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--color-forest-600)]
            "
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex flex-1 flex-col gap-1"
          aria-label={t('admin.sidebar.navigation')}
        >
          {ADMIN_LINKS.map((link, index) => {
            const Icon = ADMIN_ICONS[index];

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
                onClick={handleNavigation}
              >
                <Icon />

                <span className="min-w-0 flex-1 truncate">
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div
          className="
            mt-5
            flex
            flex-col
            gap-3
            border-t
            border-[var(--color-border)]/70
            pt-4
          "
        >
          <div onClick={handleNavigation}>
            <LanguageSwitcher />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full"
          >
            {t('admin.sidebar.logout')}
          </Button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="
          hidden
          w-60
          shrink-0
          flex-col
          border-l
          border-[var(--color-border)]
          bg-[var(--color-cream-50)]
          p-4
          md:sticky
          md:top-0
          md:flex
          md:h-screen
        "
      >
        {/* Header */}
        <div
          className="
            mb-5
            flex
            items-center
            gap-2.5
            border-b
            border-[var(--color-border)]/70
            pb-4
          "
        >
          {content?.logo?.url && (
            <img src={content.logo.url} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
          )}

          <div className="min-w-0">
            <p
              className="
                truncate
                font-display
                text-base
                text-[var(--color-forest-800)]
              "
            >
              {content?.siteName?.[language] ?? ''}
            </p>

            {admin && (
              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-[var(--color-ink-600)]
                "
              >
                {admin.username}
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex flex-1 flex-col gap-1"
          aria-label={t('admin.sidebar.navigation')}
        >
          {ADMIN_LINKS.map((link, index) => {
            const Icon = ADMIN_ICONS[index];

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
              >
                <Icon />

                <span className="min-w-0 flex-1 truncate">
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div
          className="
            mt-5
            flex
            flex-col
            gap-3
            border-t
            border-[var(--color-border)]/70
            pt-4
          "
        >
          <LanguageSwitcher />

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full"
          >
            {t('admin.sidebar.logout')}
          </Button>
        </div>
      </aside>
    </>
  );
}
