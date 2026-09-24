import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { useFetch } from '@/hooks/useFetch'
import { fetchSiteContent } from '@/api/content.api'

import { Container } from '@/components/ui/Container'

export function Footer() {
  const { data: content } = useFetch(fetchSiteContent, [])
  const { t, i18n } = useTranslation()
  const language = i18n.language.startsWith('ar') ? 'ar' : 'he'

  const FOOTER_LINKS = [
    { to: '/', label: t('nav.home') },
    { to: '/offers', label: t('nav.offers') },
    { to: '/plants', label: t('nav.catalog') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/services', label: t('nav.services') },
    { to: '/contact', label: t('nav.contact') },
  ]

  const getDayLabel = (day: string): string => {
    const normalizedDay = day.trim().toLowerCase()

    const dayKeyMap: Record<string, string> = {
      sunday: 'sunday',
      monday: 'monday',
      tuesday: 'tuesday',
      wednesday: 'wednesday',
      thursday: 'thursday',
      friday: 'friday',
      saturday: 'saturday',
    }

    const dayKey = dayKeyMap[normalizedDay]

    if (!dayKey) {
      return day
    }

    return t(`footer.days.${dayKey}`, {
      defaultValue: day,
    })
  }

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-sage-100)]">
      <Container size="wide">
        <div
          className="
            grid
            gap-7
            py-8
            md:grid-cols-2
            lg:grid-cols-4
            lg:gap-8
            lg:py-9
          "
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              {content?.logo?.url && (
                <img src={content.logo.url} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
              )}
              <h3 className="font-display text-base text-[var(--color-forest-800)]">
                {content?.siteName?.[language] ?? ''}
              </h3>
            </div>

            <p className="mt-2.5 max-w-xs text-xs leading-5 text-[var(--color-ink-600)]">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-forest-800)]">
              {t('footer.navigation')}
            </h4>

            <nav className="mt-2.5">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 lg:grid-cols-1">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className="
                        text-xs
                        text-[var(--color-ink-600)]
                        transition-colors
                        hover:text-[var(--color-forest-800)]
                      "
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-forest-800)]">
              {t('footer.contact')}
            </h4>

            <ul className="mt-2.5 space-y-1.5 text-xs text-[var(--color-ink-600)]">
              <li dir="rtl" className="whitespace-pre-line">
                {content?.phone ?? t('footer.phoneFallback')}
              </li>

              <li dir="rtl" className="whitespace-pre-line">
                {content?.address ?? t('footer.addressFallback')}
              </li>
            </ul>

            {content?.socialLinks && (
              <div className="mt-3 flex flex-wrap gap-3">
                {content.socialLinks.instagram && (
                  <a
                    href={content.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      text-xs
                      text-[var(--color-forest-700)]
                      hover:text-[var(--color-forest-900)]
                      hover:underline
                    "
                  >
                    Instagram
                  </a>
                )}

                {content.socialLinks.facebook && (
                  <a
                    href={content.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      text-xs
                      text-[var(--color-forest-700)]
                      hover:text-[var(--color-forest-900)]
                      hover:underline
                    "
                  >
                    Facebook
                  </a>
                )}

                {content.socialLinks.tiktok && (
                  <a
                    href={content.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      text-xs
                      text-[var(--color-forest-700)]
                      hover:text-[var(--color-forest-900)]
                      hover:underline
                    "
                  >
                    TikTok
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-forest-800)]">
              {t('footer.hours')}
            </h4>

            {content?.openingHours &&
            content.openingHours.length > 0 ? (
              <ul className="mt-2.5 space-y-1.5">
                {content.openingHours.map((h) => (
                  <li
                    key={h.day}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      text-xs
                      text-[var(--color-ink-600)]
                    "
                  >
                    <span>{getDayLabel(h.day)}</span>

                    <span
                      dir="ltr"
                      className="whitespace-nowrap"
                    >
                      {h.open}–{h.close}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-xs leading-5 text-[var(--color-ink-600)]">
                {t('footer.hoursSoon')}
              </p>
            )}
          </div>
        </div>
      </Container>

      <div className="border-t border-[var(--color-border)]">
        <Container size="wide">
          <div className="py-2.5 text-center text-[11px] text-[var(--color-ink-600)]">
            © {new Date().getFullYear()} {t('footer.copyright')}
          </div>
        </Container>
      </div>
    </footer>
  )
}