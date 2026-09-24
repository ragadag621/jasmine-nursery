import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/Button"
import { ErrorState } from "@/components/ui/ErrorState"
import { Skeleton } from "@/components/ui/Skeleton"
import { formatWhatsAppLink } from "@/utils/formatters"
import type { FetchStatus } from "@/hooks/useFetch"

import type { SiteContent } from "@/types/content.types"

interface HeroProps {
  content: SiteContent | null
  status: FetchStatus
  onRetry: () => void
}

export function Hero({ content, status, onRetry }: HeroProps) {
  const { t, i18n } = useTranslation()

  if (status === "loading") {
    return (
      <section
        className="
          relative
          flex
          min-h-[68vh]
          items-center
          justify-center
          overflow-hidden
          bg-[var(--color-sage-100)]
          px-4
          py-16
          sm:min-h-[72vh]
          md:min-h-[78vh]
        "
        aria-busy="true"
        aria-label={t("common.loading")}
      >
        <Skeleton
          className="absolute inset-0 h-full w-full rounded-none bg-[var(--color-sage-200)]"
          radius="0"
        />

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4 px-2 sm:gap-5">
          <Skeleton
            className="h-7 w-32 rounded-full bg-white/40 sm:w-40"
            radius="999px"
          />

          <Skeleton className="h-12 w-[min(90%,28rem)] bg-white/50 sm:h-16" />

          <Skeleton className="h-5 w-[min(82%,24rem)] bg-white/40 sm:h-6" />

          <div className="mt-2 flex w-full max-w-sm flex-col gap-3 sm:mt-3 sm:flex-row sm:justify-center">
            <Skeleton
              className="h-12 w-full bg-white/50 sm:w-36"
              radius="var(--radius-sm)"
            />

            <Skeleton
              className="h-12 w-full bg-white/40 sm:w-40"
              radius="var(--radius-sm)"
            />
          </div>
        </div>
      </section>
    )
  }

  if (status === "error" || !content) {
    return (
      <section
        className="bg-[var(--color-cream-100)] px-4 py-12 sm:py-16"
        aria-live="polite"
      >
        <div className="mx-auto max-w-2xl">
          <ErrorState onRetry={onRetry} />
        </div>
      </section>
    )
  }

  const heroImage = content.heroImage?.url
  const titleKey = i18n.language === "ar" ? "ar" : "he"

  return (
    <section
      className="
        relative
        flex
        min-h-[68vh]
        items-center
        justify-center
        overflow-hidden
        bg-cover
        bg-center
        px-4
        py-16
        text-center
        sm:min-h-[72vh]
        md:min-h-[78vh]
      "
      style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
    >
      {/* Bottom overlay for text contrast */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[var(--color-forest-950)]/60
          via-[var(--color-forest-900)]/25
          to-transparent
        "
        aria-hidden="true"
      />

      {/* Soft top overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/10
          to-transparent
        "
        aria-hidden="true"
      />

      {/* Glass text container */}
      <div
        className="
          relative
          z-10
          max-w-2xl
          rounded-[var(--radius-card)]
          border
          border-white/15
          bg-black/10
          p-5
          shadow-[var(--shadow-medium)]
          backdrop-blur-md
          sm:p-7
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-4
            px-1
            animate-[fadeInUp_0.7s_var(--ease-botanical)]
            sm:gap-5
          "
        >
          {content.address && (
            <span
              className="
                rounded-full
                border
                border-white/30
                bg-white/10
                px-3.5
                py-1.5
                text-xs
                font-medium
                tracking-wide
                text-white
                backdrop-blur-sm
                sm:px-4
              "
            >
              {content.address}
            </span>
          )}

          <h1
            className="
              max-w-xl
              font-display
               text-[clamp(2rem,9vw,3.75rem)]
               leading-[1.12]
               text-white
               drop-shadow-sm
               sm:text-[clamp(2.5rem,8vw,4.5rem)]"
          >
            {content.heroTitle[titleKey]}
          </h1>

          <p
            className="
              max-w-lg
              text-sm
              leading-6
              text-white/90
              sm:text-base
              sm:leading-7
              md:text-xl
            "
          >
            {content.heroSubtitle[titleKey]}
          </p>

          <div
            className="
              mt-2
              flex
              w-full
              max-w-sm
              flex-col
              items-stretch
              justify-center
              gap-3
              sm:mt-3
              sm:max-w-none
              sm:flex-row
              sm:items-center
            "
          >
            <Link to="/plants" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                {t("home.viewPlants")}
              </Button>
            </Link>

            {(content.whatsapp || content.phone) && (
              <a
                href={formatWhatsAppLink(content.whatsapp || content.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="
                    w-full
                    border-white/70
                    bg-white/5
                    text-white
                    backdrop-blur-sm
                    hover:bg-[var(--color-forest-900)]
                    sm:w-auto
                  "
                >
                  {t("home.contactWhatsApp")}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Soft transition into the page background */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-16
          bg-gradient-to-b
          from-transparent
          to-[var(--color-cream-100)]
          sm:h-24
        "
        aria-hidden="true"
      />
    </section>
  )
}
