import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const ADMIN_LINKS = [
  { to: '/admin', label: 'לוח בקרה', end: true },
  { to: '/admin/plants', label: 'צמחים' },
  { to: '/admin/categories', label: 'קטגוריות' },
  { to: '/admin/gallery', label: 'גלריה' },
  { to: '/admin/content', label: 'תוכן האתר' },
  { to: '/admin/messages', label: 'הודעות' },
];

export function AdminSidebar() {
  const { logout, admin } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-[var(--color-forest-700)] text-white'
        : 'text-[var(--color-ink-900)] hover:bg-[var(--color-sage-100)]'
    }`;

  return (
    <aside className="flex w-full flex-col border-l border-[var(--color-sage-200)] bg-[var(--color-cream-50)] p-4 md:h-screen md:w-56 md:sticky md:top-0">
      <div className="mb-6">
        <p className="font-display text-base text-[var(--color-forest-800)]">ניהול משתלה</p>
        {admin && <p className="text-xs text-[var(--color-ink-600)]">{admin.username}</p>}
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {ADMIN_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <Button variant="outline" size="sm" onClick={() => logout()}>
        התנתקות
      </Button>
    </aside>
  );
}
