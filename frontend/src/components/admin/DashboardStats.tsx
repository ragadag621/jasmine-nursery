import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import type { DashboardStats as Stats } from '@/api/dashboard.api';
import { useTranslation } from 'react-i18next';

interface DashboardStatsProps {
  stats: Stats;
}

type StatConfig = {
  key: keyof Stats;
  labelKey: string;
  descriptionKey: string;
  href: string;
  icon: React.ReactNode;
};

const STAT_CONFIG: StatConfig[] = [
  {
    key: 'plants',
    labelKey: 'dashboard.stats.plants.label',
    descriptionKey: 'dashboard.stats.plants.description',
    href: '/admin/plants',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20V10"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 13c-4.5 0-7-2.5-7-7 4.5 0 7 2.5 7 7Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16c0-4.5 2.5-7 7-7 0 4.5-3 7-7 7Z"
        />
      </svg>
    ),
  },
  {
    key: 'categories',
    labelKey: 'dashboard.stats.categories.label',
    descriptionKey: 'dashboard.stats.categories.description',
    href: '/admin/categories',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5A1.5 1.5 0 0 1 12 5.5v5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 10.5v-5ZM12 13.5a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5v-5Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 5h6M17 2v6"
        />
      </svg>
    ),
  },
  {
    key: 'galleryImages',
    labelKey: 'dashboard.stats.galleryImages.label',
    descriptionKey: 'dashboard.stats.galleryImages.description',
    href: '/admin/gallery',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
        />
        <circle cx="8.5" cy="9" r="1.5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 15-4.5-4.5L7 20"
        />
      </svg>
    ),
  },
  {
    key: 'newMessages',
    labelKey: 'dashboard.stats.newMessages.label',
    descriptionKey: 'dashboard.stats.newMessages.description',
    href: '/admin/messages',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3 7 9 6 9-6"
        />
      </svg>
    ),
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CONFIG.map((item) => {
        const value = stats[item.key];

        const hasNewMessages =
          item.key === 'newMessages' && value > 0;

        return (
          <Link
            key={item.key}
            to={item.href}
            className="block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-forest-600)] focus-visible:ring-offset-2"
            aria-label={`${t(item.labelKey)}: ${value.toLocaleString()}`}
          >
            <Card
              className="
                group
                relative
                h-full
                overflow-hidden
                border
                border-[var(--color-sage-200)]
                bg-white
                p-0
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[var(--color-sage-300)]
                hover:shadow-md
              "
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[var(--color-sage-100)]
                      text-[var(--color-forest-700)]
                      transition-colors
                      duration-200
                      group-hover:bg-[var(--color-sage-200)]
                    "
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>

                  {hasNewMessages && (
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-[var(--color-sage-100)]
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-[var(--color-forest-700)]
                      "
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-[var(--color-forest-600)]
                        "
                        aria-hidden="true"
                      />

                      {t('dashboard.stats.new')}
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <p
                    className="
                      font-display
                      text-3xl
                      font-semibold
                      leading-none
                      tracking-tight
                      text-[var(--color-forest-800)]
                    "
                  >
                    {value.toLocaleString()}
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      font-medium
                      text-[var(--color-ink-700)]
                    "
                  >
                    {t(item.labelKey)}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[var(--color-ink-500)]
                    "
                  >
                    {t(item.descriptionKey)}
                  </p>
                </div>
              </div>

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-0.5
                  bg-[var(--color-sage-300)]
                  opacity-60
                  transition-opacity
                  duration-200
                  group-hover:opacity-100
                "
                aria-hidden="true"
              />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
