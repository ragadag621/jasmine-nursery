import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';

export function AdminSidebar() {
  const { logout, admin } = useAuth();
  const { t } = useTranslation();

  const ADMIN_LINKS = [
    { to: '/admin', label: t('admin.sidebar.dashboard'), end: true, icon: '📊' },
    { to: '/admin/plants', label: t('admin.sidebar.plants'), icon: '🌱' },
    { to: '/admin/categories', label: t('admin.sidebar.categories'), icon: '📂' },
    { to: '/admin/gallery', label: t('admin.sidebar.gallery'), icon: '🖼️' },
    { to: '/admin/content', label: t('admin.sidebar.content'), icon: '📝' },
    { to: '/admin/messages', label: t('admin.sidebar.messages'), icon: '✉️' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      isActive
        ? 'bg-[var(--color-forest-700)] text-white shadow-[0_2px_8px_rgba(32,74,43,0.2)]'
        : 'text-[var(--color-ink-900)] hover:bg-[var(--color-sage-100)]'
    }`;

  return (
    <aside className="flex w-full flex-col border-l border-[var(--color-sage-200)] bg-[var(--color-cream-50)] p-4 md:h-screen md:w-60 md:sticky md:top-0">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">🌿</span>
        <div>
          <p className="font-display text-base text-[var(--color-forest-800)]">
            {t('admin.sidebar.title')}
          </p>
          {admin && <p className="text-xs text-[var(--color-ink-600)]">{admin.username}</p>}
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {ADMIN_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mb-3">
        <LanguageSwitcher />
      </div>
      <Button variant="outline" size="sm" onClick={() => logout()}>
        {t('admin.sidebar.logout')}
      </Button>
    </aside>
  );
}
