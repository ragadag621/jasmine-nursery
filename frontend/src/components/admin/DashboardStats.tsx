import { Card } from '@/components/ui/Card';
import type { DashboardStats as Stats } from '@/api/dashboard.api';

interface DashboardStatsProps {
  stats: Stats;
}

const STAT_CONFIG: { key: keyof Stats; label: string; icon: string }[] = [
  { key: 'plants', label: 'צמחים', icon: '🌱' },
  { key: 'categories', label: 'קטגוריות', icon: '📂' },
  { key: 'galleryImages', label: 'תמונות בגלריה', icon: '🖼️' },
  { key: 'newMessages', label: 'הודעות חדשות', icon: '✉️' },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {STAT_CONFIG.map((item) => (
        <Card key={item.key} className="p-5 text-center">
          <span className="mb-1 block text-2xl" aria-hidden="true">
            {item.icon}
          </span>
          <p className="font-display text-2xl text-[var(--color-forest-800)]">{stats[item.key]}</p>
          <p className="text-sm text-[var(--color-ink-600)]">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
