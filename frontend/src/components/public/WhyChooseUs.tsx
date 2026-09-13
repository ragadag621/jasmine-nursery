import { useTranslation } from 'react-i18next';

import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';

interface BenefitIconProps {
  className?: string;
}

function QualityIcon({ className = 'h-6 w-6' }: BenefitIconProps) {
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
        d="M12 3.5 14 5l2.5-.2.8 2.4 2.2 1.3-.8 2.4.8 2.4-2.2 1.3-.8 2.4L14 17l-2 1.5L10 17l-2.5.2-.8-2.4-2.2-1.3.8-2.4-.8-2.4 2.2-1.3.8-2.4L10 5l2-1.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.5 11.8 2.2 2.2 4.8-5"
      />
    </svg>
  );
}

function SelectionIcon({ className = 'h-6 w-6' }: BenefitIconProps) {
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
        d="M12 21c4.2-3.1 6.5-6.1 6.5-9.5C18.5 7.7 16 5 12 3c-4 2-6.5 4.7-6.5 8.5C5.5 14.9 7.8 17.9 12 21Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21c-.2-4.2-.1-7.8 1.8-11.8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.8 13.2c-1.8-.8-3.3-2-4.4-3.6"
      />
    </svg>
  );
}

function ExpertiseIcon({ className = 'h-6 w-6' }: BenefitIconProps) {
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
        d="M8.5 11.5 11 9a2.1 2.1 0 0 1 3 0l.5.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 14 3.2-3.2a1.8 1.8 0 0 1 2.5 0l2.3 2.3a1.8 1.8 0 0 0 2.5 0l.7-.7a1.8 1.8 0 0 1 2.5 2.5l-3.1 3.1a3.5 3.5 0 0 1-5 0L5 14Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.5 9.5 1.8-1.8a1.8 1.8 0 0 1 2.5 2.5L17 12"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 15.5 2.8 14.3M20 9.5l1.2-1.2"
      />
    </svg>
  );
}

function LocalIcon({ className = 'h-6 w-6' }: BenefitIconProps) {
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
        d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"
      />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

const BENEFIT_ICONS = [
  QualityIcon,
  SelectionIcon,
  ExpertiseIcon,
  LocalIcon,
];

export function WhyChooseUs() {
  const { t } = useTranslation();

  const BENEFITS = [
    {
      title: t('home.whyQuality'),
      description: t('home.whyQualityDesc'),
    },
    {
      title: t('home.whySelection'),
      description: t('home.whySelectionDesc'),
    },
    {
      title: t('home.whyExpertise'),
      description: t('home.whyExpertiseDesc'),
    },
    {
      title: t('home.whyLocal'),
      description: t('home.whyLocalDesc'),
    },
  ];

  return (
    <Section tone="cream-alt">
      <PageHeader
        as="h2"
        title={t('home.whyTitle')}
      />

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-4 lg:gap-8">
        {BENEFITS.map((benefit, index) => {
          const Icon = BENEFIT_ICONS[index];

          return (
            <div
              key={benefit.title}
              className="
                group
                flex
                flex-col
                items-center
                text-center
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--color-sage-100)]
                  text-[var(--color-forest-700)]
                  transition-all
                  duration-300
                  ease-[var(--ease-botanical)]
                  group-hover:bg-[var(--color-sage-200)]
                  group-hover:text-[var(--color-forest-800)]
                  group-hover:shadow-[var(--shadow-soft)]
                  md:h-12
                  md:w-12
                "
              >
                <Icon />
              </div>

              <h3
                className="
                  mt-3
                  font-display
                  text-base
                  font-semibold
                  leading-tight
                  text-[var(--color-forest-800)]
                  sm:text-lg
                "
              >
                {benefit.title}
              </h3>

              <p
                className="
                  mt-2
                  max-w-xs
                  text-xs
                  leading-6
                  text-[var(--color-ink-600)]
                  sm:text-sm
                  sm:leading-7
                "
              >
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}