import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Card } from "@/components/ui/Card"
import { Container } from "@/components/ui/Container"
import { PageHeader } from "@/components/ui/PageHeader"

import { useFetch } from "@/hooks/useFetch"
import { fetchSiteContent } from "@/api/content.api"

import { Skeleton } from "@/components/ui/Skeleton"
import { ErrorState } from "@/components/ui/ErrorState"

import { setPageMeta } from "@/utils/seo"

interface ServiceIconProps {
  className?: string
}

function PlantsIcon({ className = "h-6 w-6" }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10" />

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

      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
    </svg>
  )
}

function GardenIcon({ className = "h-6 w-6" }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 20v-6.5a5 5 0 0 1 10 0V20"
      />

      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10V7h6v3" />

      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7V4" />

      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4" />
    </svg>
  )
}

function PotIcon({ className = "h-6 w-6" }: ServiceIconProps) {
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

      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V5" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9h12l-1.2 9a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 9Z"
      />

      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20h6" />
    </svg>
  )
}

function GardeningIcon({ className = "h-6 w-6" }: ServiceIconProps) {
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

      <path strokeLinecap="round" strokeLinejoin="round" d="m16 4 4 4" />

      <path strokeLinecap="round" strokeLinejoin="round" d="M18 14v6" />

      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h6" />
    </svg>
  )
}

function LeafIcon({ className = "h-6 w-6" }: ServiceIconProps) {
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
        d="M20 4C11 4 5 7.5 5 14c0 3.5 2.5 6 6 6 6.5 0 9-7 9-16Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20c2.5-4 6-7 11-9"
      />
    </svg>
  )
}

function HeartIcon({ className = "h-6 w-6" }: ServiceIconProps) {
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
        d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"
      />
    </svg>
  )
}

function SparkleIcon({ className = "h-6 w-6" }: ServiceIconProps) {
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
        d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"
      />
    </svg>
  )
}

const SERVICE_ICONS = [
  PlantsIcon,
  GardenIcon,
  PotIcon,
  GardeningIcon,
]

const VALUE_ICONS = [
  LeafIcon,
  HeartIcon,
  SparkleIcon,
]

export default function ServicesPage() {
  const { t, i18n } = useTranslation()

  const key = i18n.language.startsWith("ar") ? "ar" : "he"

  const {
    data: content,
    status,
    error,
    refetch,
  } = useFetch(fetchSiteContent, [])

  useEffect(() => {
    setPageMeta(
      t("services.title"),
      t("services.subtitle"),
    )
  }, [t])

  const SERVICES = [
    {
      title: t("services.catalogTitle"),
      description: t("services.catalogDescription"),
    },
    {
      title: t("services.gardenTitle"),
      description: t("services.gardenDescription"),
    },
    {
      title: t("services.potsTitle"),
      description: t("services.potsDescription"),
    },
    {
      title: t("services.gardeningTitle"),
      description: t("services.gardeningDescription"),
    },
  ]

  const VALUES = [
    {
      title: t("services.values.qualityTitle"),
      description: t("services.values.qualityDescription"),
    },
    {
      title: t("services.values.careTitle"),
      description: t("services.values.careDescription"),
    },
    {
      title: t("services.values.varietyTitle"),
      description: t("services.values.varietyDescription"),
    },
  ]

  return (
    <Container
      as="main"
      className="py-[var(--space-section)]"
    >
      <PageHeader
        title={t("services.title")}
        description={t("services.subtitle")}
      />

      {/* About / Introduction */}
      <section
        className="mb-16"
        aria-labelledby="about-section-title"
      >
        <div
          className={[
            "relative overflow-hidden rounded-3xl",
            "border border-[var(--color-border)]",
            "bg-white shadow-[var(--shadow-soft)]",
          ].join(" ")}
        >
          <div
            className={[
              "absolute inset-x-0 top-0 h-1.5",
              "bg-[var(--color-forest-700)]",
            ].join(" ")}
            aria-hidden="true"
          />

          <div className="grid gap-8 p-6 md:grid-cols-[auto_1fr] md:p-10">
            <div
              className={[
                "flex h-14 w-14 shrink-0 items-center",
                "justify-center rounded-2xl",
                "bg-[var(--color-sage-100)]",
                "text-[var(--color-forest-700)]",
              ].join(" ")}
              aria-hidden="true"
            >
              <PlantsIcon className="h-7 w-7" />
            </div>

            <div>
              <p
                id="about-section-title"
                className={[
                  "mb-3 text-sm font-semibold",
                  "text-[var(--color-forest-700)]",
                ].join(" ")}
              >
                {t("services.aboutEyebrow")}
              </p>

              <h2
                className={[
                  "font-display text-2xl font-semibold",
                  "text-[var(--color-forest-900)]",
                  "md:text-3xl",
                ].join(" ")}
              >
                {t("services.aboutTitle")}
              </h2>

              <div
                className={[
                  "mt-5 text-base leading-8",
                  "text-[var(--color-ink-700)]",
                  "md:text-lg md:leading-9",
                ].join(" ")}
                dir={key === "ar" ? "rtl" : "rtl"}
              >
                {status === "loading" && (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-10/12" />
                    <Skeleton className="h-5 w-8/12" />
                  </div>
                )}

                {status === "error" && (
                  <ErrorState
                    message={error ?? undefined}
                    onRetry={refetch}
                  />
                )}

                {status === "success" && (
                  <p className="whitespace-pre-line">
                    {content?.aboutText?.[key] ||
                      t("about.fallback")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            className={[
              "border-t border-[var(--color-border)]",
              "bg-[var(--color-sage-50)]",
              "px-6 py-5 md:px-10",
            ].join(" ")}
          >
            <div
              className="flex items-center gap-3"
              dir={key === "ar" ? "rtl" : "rtl"}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-forest-600)]"
                aria-hidden="true"
              />

              <p className="text-sm font-medium text-[var(--color-forest-800)]">
                {t("home.heroTitleFallback")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="mb-16"
        aria-labelledby="values-section-title"
      >
        <div className="mb-7 max-w-2xl">
          <p
            className={[
              "mb-2 text-sm font-semibold",
              "text-[var(--color-forest-700)]",
            ].join(" ")}
          >
            {t("services.valuesEyebrow")}
          </p>

          <h2
            id="values-section-title"
            className={[
              "font-display text-2xl font-semibold",
              "text-[var(--color-forest-900)]",
              "md:text-3xl",
            ].join(" ")}
          >
            {t("services.valuesTitle")}
          </h2>

          <p className="mt-3 leading-7 text-[var(--color-ink-600)]">
            {t("services.valuesSubtitle")}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((value, index) => {
            const Icon = VALUE_ICONS[index]

            return (
              <Card
                key={value.title}
                className={[
                  "group relative overflow-hidden p-6",
                  "border border-[var(--color-border)]",
                  "transition-all duration-300",
                  "hover:-translate-y-1",
                  "hover:shadow-[var(--shadow-medium)]",
                ].join(" ")}
              >
                <div
                  className={[
                    "mb-5 flex h-12 w-12 items-center",
                    "justify-center rounded-2xl",
                    "bg-[var(--color-sage-100)]",
                    "text-[var(--color-forest-700)]",
                    "transition-all duration-300",
                    "group-hover:scale-105",
                    "group-hover:bg-[var(--color-sage-200)]",
                  ].join(" ")}
                >
                  <Icon />
                </div>

                <div className="mb-2 text-xs font-medium text-[var(--color-ink-400)]">
                  0{index + 1}
                </div>

                <h3
                  className={[
                    "font-display text-lg font-semibold",
                    "text-[var(--color-forest-800)]",
                  ].join(" ")}
                >
                  {value.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-[var(--color-ink-600)]">
                  {value.description}
                </p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Services */}
      <section
        className="mb-16"
        aria-labelledby="services-section-title"
      >
        <div className="mb-7 max-w-2xl">
          <p
            className={[
              "mb-2 text-sm font-semibold",
              "text-[var(--color-forest-700)]",
            ].join(" ")}
          >
            {t("services.offeringsEyebrow")}
          </p>

          <h2
            id="services-section-title"
            className={[
              "font-display text-2xl font-semibold",
              "text-[var(--color-forest-900)]",
              "md:text-3xl",
            ].join(" ")}
          >
            {t("services.offeringsTitle")}
          </h2>

          <p className="mt-3 leading-7 text-[var(--color-ink-600)]">
            {t("services.offeringsSubtitle")}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[index]

            return (
              <Card
                key={service.title}
                className={[
                  "group relative overflow-hidden p-6",
                  "transition-all duration-300",
                  "hover:-translate-y-1",
                  "hover:shadow-[var(--shadow-medium)]",
                ].join(" ")}
              >
                <div
                  className={[
                    "absolute inset-x-0 top-0 h-1",
                    "bg-[var(--color-sage-200)]",
                    "transition-colors duration-300",
                    "group-hover:bg-[var(--color-forest-600)]",
                  ].join(" ")}
                  aria-hidden="true"
                />

                <div className="flex items-start gap-5">
                  <div
                    className={[
                      "flex h-12 w-12 shrink-0 items-center",
                      "justify-center rounded-2xl",
                      "bg-[var(--color-sage-100)]",
                      "text-[var(--color-forest-700)]",
                      "transition-all duration-300",
                      "group-hover:scale-105",
                      "group-hover:bg-[var(--color-sage-200)]",
                    ].join(" ")}
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

                    <h3
                      className={[
                        "font-display text-lg font-semibold",
                        "text-[var(--color-forest-800)]",
                      ].join(" ")}
                    >
                      {service.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink-600)]">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Closing statement */}
      <section
        className={[
          "relative overflow-hidden rounded-3xl",
          "bg-[var(--color-forest-800)]",
          "px-6 py-10 text-center",
          "md:px-12 md:py-14",
        ].join(" ")}
      >
        <div
          className={[
            "pointer-events-none absolute -left-12 -top-12",
            "h-32 w-32 rounded-full",
            "border border-white/10",
          ].join(" ")}
          aria-hidden="true"
        />

        <div
          className={[
            "pointer-events-none absolute -bottom-16 -right-10",
            "h-40 w-40 rounded-full",
            "border border-white/10",
          ].join(" ")}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl">
          <div
            className={[
              "mx-auto mb-5 flex h-12 w-12 items-center",
              "justify-center rounded-2xl",
              "bg-white/10 text-white",
            ].join(" ")}
            aria-hidden="true"
          >
            <PlantsIcon />
          </div>

          <h2
            className={[
              "font-display text-2xl font-semibold text-white",
              "md:text-3xl",
            ].join(" ")}
          >
            {t("services.closingTitle")}
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/75 md:text-base">
            {t("services.closingDescription")}
          </p>
        </div>
      </section>
    </Container>
  )
}