import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from './LanguageSwitcher';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { formatWhatsAppLink } from '@/utils/formatters';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();

  const { data: content } = useFetch(fetchSiteContent, []);

  const NAV_LINKS = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/plants', label: t('nav.catalog') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/services', label: t('nav.services') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const whatsappHref = formatWhatsAppLink(
    content?.whatsapp ||
      content?.phone ||
      '972546643896'
  );

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

  const linkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `
      relative
      text-sm
      font-medium
      transition-colors
      after:absolute
      after:inset-x-0
      after:-bottom-1
      after:h-0.5
      after:scale-x-0
      after:bg-[var(--color-forest-700)]
      after:transition-transform
      after:duration-300
      after:content-['']
      md:hover:after:scale-x-100
      ${
        isActive
          ? 'text-[var(--color-forest-800)] after:scale-x-100'
          : 'text-[var(--color-ink-600)] md:hover:text-[var(--color-forest-700)]'
      }
    `;

  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-[var(--color-border)]/80
        bg-[var(--color-cream-50)]/95
        backdrop-blur-md
      "
    >
      <Container size="wide">
        <nav
          className="
            flex
            min-h-16
            items-center
            justify-between
            gap-4
            py-2.5
            sm:py-3
          "
          aria-label={t('nav.ariaLabel')}
        >
          <NavLink
            to="/"
            end
            className="
              flex
              min-h-11
              min-w-0
              shrink
              items-center
              gap-2.5
              font-display
              text-base
              tracking-tight
              text-[var(--color-forest-800)]
              sm:gap-3
              sm:text-lg
            "
          >
            <img
              src="https://scontent.cdninstagram.com/v/t51.2885-19/275404626_540804370599970_3247346516516391331_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=102&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=7pBNqPTKewkQ7kNvwF2rYbX&_nc_oc=Adq1WhueFYwuH0Fu4wrAf2djiBudhFi7VYshNFnnn43Z1JX6Pf8Ben9wGPYCToa2HNw&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_ss=7b689&oh=00_AQLBajWL2ZBQ_uHqxZZDz__N1r3KHo6O25EMw8_jW5fCdw&oe=6AA672B9"
              alt=""
              aria-hidden="true"
              className="
                h-9
                w-9
                shrink-0
                object-contain
                sm:h-10
                sm:w-10
              "
            />

            <span className="truncate">
              {t('nav.brandName')}
            </span>
          </NavLink>

          <ul className="hidden items-center gap-6 lg:flex xl:gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={linkClass}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm">
                {t('home.contactWhatsApp')}
              </Button>
            </a>
          </div>

          <button
            type="button"
            className="
              flex
              min-h-11
              min-w-11
              shrink-0
              items-center
              justify-center
              rounded-lg
              transition-colors
              hover:bg-[var(--color-sage-100)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--color-forest-600)]
              lg:hidden
            "
            aria-label={
              isOpen
                ? t('nav.closeMenu')
                : t('nav.openMenu')
            }
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((value) => !value)}
          >
            <span className="flex w-6 flex-col gap-1.5">
              <span
                className={`
                  h-0.5
                  w-6
                  origin-center
                  rounded-full
                  bg-[var(--color-forest-800)]
                  transition-transform
                  duration-300
                  ${
                    isOpen
                      ? 'translate-y-2 rotate-45'
                      : ''
                  }
                `}
              />

              <span
                className={`
                  h-0.5
                  w-6
                  rounded-full
                  bg-[var(--color-forest-800)]
                  transition-opacity
                  duration-200
                  ${
                    isOpen
                      ? 'opacity-0'
                      : 'opacity-100'
                  }
                `}
              />

              <span
                className={`
                  h-0.5
                  w-6
                  origin-center
                  rounded-full
                  bg-[var(--color-forest-800)]
                  transition-transform
                  duration-300
                  ${
                    isOpen
                      ? '-translate-y-2 -rotate-45'
                      : ''
                  }
                `}
              />
            </span>
          </button>
        </nav>
      </Container>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="
            animate-[fadeIn_0.2s_ease-out]
            border-t
            border-[var(--color-border)]
            bg-[var(--color-cream-50)]
            px-4
            py-3
            lg:hidden
          "
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `
                      flex
                      min-h-11
                      items-center
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-colors
                      ${
                        isActive
                          ? 'bg-[var(--color-sage-100)] text-[var(--color-forest-800)]'
                          : 'text-[var(--color-ink-600)] hover:bg-[var(--color-sage-100)]'
                      }
                    `
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div
            className="
              mt-3
              flex
              items-center
              gap-3
              border-t
              border-[var(--color-border)]
              pt-3
            "
          >
            <LanguageSwitcher />

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1"
              onClick={() => setIsOpen(false)}
            >
              <Button
                size="sm"
                className="w-full"
              >
                {t('home.contactWhatsApp')}
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}