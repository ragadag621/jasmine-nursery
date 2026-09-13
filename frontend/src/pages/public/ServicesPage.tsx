import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';

import { setPageMeta } from '@/utils/seo';

interface ServiceIconProps {
  className?: string;
}

function PlantsIcon({ className = 'h-6 w-6' }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21V10"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14c-3.5 0-6-2.2-6-5.5C9.5 8.5 12 10.5 12 14Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 11c0-3.2 2.3-5.5 6-5.5C18 9 15.5 11 12 11Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 21h8"
      />
    </svg>
  );
}

function GardenIcon({ className = 'h-6 w-6' }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20h16"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 20v-6.5a5 5 0 0 1 10 0V20"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 10V7h6v3"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7V4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 4h4"
      />
    </svg>
  );
}

function PotIcon({ className = 'h-6 w-6' }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8c0-2.2 1.3-4 4-5 2.7 1 4 2.8 4 5"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8V5"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9h12l-1.2 9a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 9Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 20h6"
      />
    </svg>
  );
}

function GardeningIcon({ className = 'h-6 w-6' }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.5 5.5 18.5 9.5"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7 5 15a2.8 2.8 0 0 0 4 4l8-8"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16 4 4 4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 14v6"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h6"
      />
    </svg>
  );
}

const SERVICE_ICONS = [
  PlantsIcon,
  GardenIcon,
  PotIcon,
  GardeningIcon,
];

export default function ServicesPage() {
  const { t } = useTranslation();

  const SERVICES = [
    {
      title: t('services.catalogTitle'),
      description: t('services.catalogDescription'),
    },
    {
      title: t('services.gardenTitle'),
      description: t('services.gardenDescription'),
    },
    {
      title: t('services.potsTitle'),
      description: t('services.potsDescription'),
    },
    {
      title: t('services.gardeningTitle'),
      description: t('services.gardeningDescription'),
    },
  ];

  useEffect(() => {
    setPageMeta(
      t('services.title'),
      t('services.subtitle'),
    );
  }, [t]);

  return (
    <Container
      as="main"
      className="py-[var(--space-section)]"
    >
      <PageHeader
        title={t('services.title')}
        description={t('services.subtitle')}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {SERVICES.map((service, index) => {
          const Icon = SERVICE_ICONS[index];

          return (
            <Card
              key={service.title}
              className={[
                'group relative overflow-hidden p-6',
                'transition-all duration-300',
                'hover:-translate-y-1',
                'hover:shadow-[var(--shadow-medium)]',
              ].join(' ')}
            >
              <div
                className={[
                  'absolute inset-x-0 top-0 h-1',
                  'bg-[var(--color-sage-200)]',
                  'transition-colors duration-300',
                  'group-hover:bg-[var(--color-forest-600)]',
                ].join(' ')}
                aria-hidden="true"
              />

              <div className="flex items-start gap-5">
                <div
                  className={[
                    'flex h-12 w-12 shrink-0 items-center',
                    'justify-center rounded-2xl',
                    'bg-[var(--color-sage-100)]',
                    'text-[var(--color-forest-700)]',
                    'transition-all duration-300',
                    'group-hover:scale-105',
                    'group-hover:bg-[var(--color-sage-200)]',
                  ].join(' ')}
                >
                  <Icon />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--color-ink-400)]">
                      0{index + 1}
                    </span>

                    <span
                      className="h-px w-6 bg-[var(--color-sage-300)]"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="font-display text-lg font-semibold text-[var(--color-forest-800)]">
                    {service.title}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-[var(--color-ink-600)]">
                    {service.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}